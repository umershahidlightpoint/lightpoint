using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.Extensions;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using PostingEngine.TaxLotMethods;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace PostingEngine.PostingRules
{
    public class Derivatives : IPostingRule
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        public bool IsValid(PostingEngineEnvironment env, Transaction element)
        {
            return element.IsDerivative();
        }

        /// <summary>
        /// Run for each day that the Tax Lot remains open / partially closed
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element">Trade we aee interested in</param>
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, element.SettleCurrency).Rate);
            }

            // Calculate the unrealized PNL
            if (env.TaxLotStatus.ContainsKey(element.LpOrderId))
            {
                // Determine if we need to accumulate unrealized PNL
                var taxlot = env.TaxLotStatus[element.LpOrderId];

                // Check to see if the TaxLot is still open and it has a non zero Quantity
                if (!taxlot.Status.ToLowerInvariant().Equals("closed") && Math.Abs(taxlot.Quantity) > 0)
                {
                    var listOfTags = new List<Tag>
                    {
                        Tag.Find("SecurityType"),
                        Tag.Find("CustodianCode")
                    };

                    // We have an open / partially closed tax lot so now need to calculate unrealized Pnl
                    var quantity = taxlot.Quantity;

                    var prevEodPrice = 0.0;
                    var eodPrice = 0.0;

                    if (env.ValueDate == element.TradeDate)
                    {
                        eodPrice = MarketPrices.GetPrice(env, env.ValueDate, element).Price;
                        prevEodPrice = element.FactoredSettleNetPrice();
                    }
                    else
                    {
                        prevEodPrice = MarketPrices.GetPrice(env, env.PreviousValueDate, element).Price;
                        eodPrice = MarketPrices.GetPrice(env, env.ValueDate, element).Price;
                    }

                    var unrealizedPnl = CommonRules.CalculateUnrealizedPnl(env, taxlot);

                    AccountToFrom fromToAccounts;

                    var originalAccount = AccountUtils.GetDerivativeAccountType(unrealizedPnl);
                    if ( originalAccount.Contains("(Liabilities)"))
                    {
                        // This needs to be registered as a Credit to the Libabilities
                        unrealizedPnl *= -1;
                    }

                    fromToAccounts = new AccountUtils().GetAccounts(env, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", listOfTags, taxlot.Trade);

                    var fund = env.GetFund(element);

                    var debit = new Journal(element)
                    {
                        Account = fromToAccounts.From,
                        When = env.ValueDate,
                        Symbol = taxlot.Symbol,
                        Quantity = quantity,
                        FxRate = fxrate,
                        Value = AccountCategory.SignedValue(fromToAccounts.From, fromToAccounts.To, true, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromToAccounts.From, unrealizedPnl),
                        StartPrice = prevEodPrice,
                        EndPrice = eodPrice,
                        Event = Event.DAILY_UNREALIZED_PNL,
                        Fund = fund,
                    };

                    var credit = new Journal(element)
                    {
                        Account = fromToAccounts.To,
                        When = env.ValueDate,
                        FxRate = fxrate,
                        Quantity = quantity,
                        Value = AccountCategory.SignedValue(fromToAccounts.From, fromToAccounts.To, false, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromToAccounts.To, AccountCategory.SignedValue(fromToAccounts.From, fromToAccounts.To, false, unrealizedPnl)),
                        Event = Event.DAILY_UNREALIZED_PNL,
                        StartPrice = prevEodPrice,
                        EndPrice = eodPrice,
                        Fund = fund,
                    };

                    Logger.Info($"[Journals] ==> From : {debit.CreditDebit}::{debit.Value}::{debit.Account.Type.Category.Name} --> To : {credit.CreditDebit}::{credit.Value}::{credit.Account.Type.Category.Name} ({unrealizedPnl})");

                    env.Journals.AddRange(new[] { debit, credit });

                    // For Derivatives this is un-necessary as we do not have an investment at cost, but we do have Fx on unsettled
                    if (taxlot.Quantity != 0.0)
                    {
                        if (element.TradeDate != env.ValueDate)
                        {
                            new FxPosting().CreateFxUnsettled(env, element);
                        }
                    }
                }
            }
            else
            {
                if (fxrate != 1.0)
                {
                    if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                    {
                        /*
                        var fxJournals = FxPosting.CreateFx(
                            env,
                            "DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )",
                            "fx gain or loss on unsettled balance",
                            "daily",
                            element.Quantity, null, element);
                        env.Journals.AddRange(fxJournals);
                        */
                    }
                }

            }
        }


        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            // NO Need for Swaps and Futures / Forwards as we don't own the stock
        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            var multiplier = element.Multiplier(env);

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, element.SettleCurrency).Rate);
            }

            if ( element.IsBuy() || element.IsShort())
            {
                var t1 = env.GenerateOpenTaxLotStatus(element, fxrate);

                if ( element.Quantity == 0 )
                {
                    // TODO: Need to review this as we need to see if there is a parent, and what the parents actuall is
                    return;
                }
            }
            else if (element.IsSell() || element.IsCover())
            {
                // Get Matching Lots
                var openLots = env.Methodology.GetOpenLots(env, element, element.Quantity);

                if ( openLots.Count() == 0)
                {
                    var t1 = env.GenerateOpenTaxLotStatus(element, fxrate);
                    // Whats going on here?
                    // We are skipping anything that does not get an OpenLot
                    env.AddMessage($"There should be for a sell {element.Symbol} have at least one open lot, non found");
                }
                else
                {
                    var workingQuantity = element.Quantity;

                    foreach( var lot in openLots)
                    {
                        if (workingQuantity == 0)
                            break;

                        if ( !env.TaxLotStatus.ContainsKey(lot.Trade.LpOrderId))
                        {
                            // TODO: For this open lot there should be a corresponding open to 
                            env.AddMessage($"Unable to Find Tax Lot for {lot.Trade.Symbol}::{lot.Trade.Side}::{lot.Trade.Status}");
                            continue;
                        }

                        var taxlotStatus = env.TaxLotStatus[lot.Trade.LpOrderId];
                        if (taxlotStatus != null && taxlotStatus.Quantity != 0 && !taxlotStatus.Status.ToLowerInvariant().Equals("closed"))
                        {
                            Logger.Info($"Relieving Tax Lot {taxlotStatus.TradeDate.ToString("MM-dd-yyyy")}::{taxlotStatus.Symbol}::{taxlotStatus.OpenId}::{lot.TaxLiability}::{lot.TaxRate.Rate}::{lot.PotentialPnl}");

                            // Does the open Lot fully fullfill the quantity ?
                            if (Math.Abs(taxlotStatus.Quantity) >= Math.Abs(workingQuantity))
                            {
                                GenerateJournals(env, lot, taxlotStatus, element, workingQuantity, fxrate, multiplier);

                                break;
                            }
                            else
                            {
                                var quantity = taxlotStatus.Quantity;

                                GenerateJournals(env, lot, taxlotStatus, element, taxlotStatus.Quantity * -1, fxrate, multiplier);

                                workingQuantity += quantity;
                            }
                        }
                    }                    
                }
            }
            else
            {
                // We have a Debit / Credit Dividends
            }
        }

        private void GenerateJournals(PostingEngineEnvironment env, TaxLotDetail lot, TaxLotStatus taxlotStatus, Transaction element, double workingQuantity, double fxrate, double multiplier)
        {
            var buyTrade = env.FindTrade(lot.Trade.LpOrderId);

            var taxlot = CommonRules.RelieveTaxLot(env, lot, element, workingQuantity, true);

            // Has to happen for every day
            var fxJournalsForInvestmentAtCost = FxPosting.CreateFx(
                env,
                CommonRules.GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"),
                "Change in unrealized due to fx on original Cost",
                "daily", workingQuantity, taxlotStatus, buyTrade);
            env.Journals.AddRange(fxJournalsForInvestmentAtCost);

            taxlotStatus.Quantity += workingQuantity;
            if (taxlotStatus.Quantity == 0)
                taxlotStatus.Status = "Closed";
            else
                taxlotStatus.Status = "Partially Closed";

            if (taxlotStatus.Quantity == 0.0)
            {
                // Is this really needed, as if the tax lot is zero then should not generate any additional unrealized pnl
                //GenerateDailyUnrealized(env, taxlotStatus, element, workingQuantity * -1, fxrate);
            }

            var eodPrice = MarketPrices.GetPrice(env, env.PreviousValueDate, buyTrade).Price;

            // Calculate the unrealized Backout PNL for the created Tax Lot
            var unrealizedPnl = Math.Abs(taxlot.Quantity) * (eodPrice - buyTrade.FactoredSettleNetPrice()) * multiplier * fxrate;

            unrealizedPnl *= CommonRules.DetermineSign(element);

            // Need to backout the Unrealized PNL here, as we are reducing the position of the TaxLot
            CommonRules.ReverseUnrealizedPnl(
                env,
                buyTrade,
                element,
                unrealizedPnl * -1,
                buyTrade.FactoredSettleNetPrice(),
                element.FactoredSettleNetPrice(),
                fxrate);

            // Original FxRate
            var changeDueToFx = fxrate - taxlotStatus.FxRate;
            // Original Trade Price
            var changeInRealizedPnlDueToFx = changeDueToFx * (taxlot.TradePrice) * Math.Abs(taxlot.Quantity);
            var changeInUnRealizedPnlDueToFx = changeDueToFx * (taxlot.CostBasis - taxlot.TradePrice) * Math.Abs(taxlot.Quantity);

            CommonRules.PostRealizedPnl(
                env,
                buyTrade,
                taxlot.RealizedPnl,
                taxlot.TradePrice,
                taxlot.CostBasis,
                fxrate);

            /*
            if (fxrate != 1.0)
                PostRealizedFxGain(env, buyTrade, changeInRealizedPnlDueToFx, taxlot.TradePrice, taxlot.CostBasis, changeDueToFx);
            */

            var fxChange = new FxPosting().CreateFxUnsettled(env, buyTrade);

            List<SqlParameter> sqlParams = new List<SqlParameter>
            {
                new SqlParameter("@busDate", env.ValueDate),
                new SqlParameter("@LpOrderId", lot.Trade.LpOrderId)
            };

            var dataTable = new SqlHelper(env.ConnectionString).GetDataTables("ClosingTaxLot", CommandType.StoredProcedure, sqlParams.ToArray());

            var changeInUnRealized = 1.0;
            if (dataTable[0].Rows.Count > 0)
                changeInUnRealized = Convert.ToDouble(dataTable[0].Rows[0][2]);

            var changeInUnRealizedFx = 0.0;
            if (dataTable[1].Rows.Count > 0)
                changeInUnRealizedFx = Convert.ToDouble(dataTable[1].Rows[0][2]);

            if (changeInUnRealizedFx != 0.0)
            {
                var closeOut = changeInUnRealizedFx + fxChange;

                //PostUnrealizedFxGain(env, buyTrade, closeOut, taxlot.TradePrice, taxlot.CostBasis, changeDueToFx);
            }

            if (dataTable[2].Rows.Count > 0)
            {
                var sumFxMarkToMarket = Convert.ToDouble(dataTable[2].Rows[0][2]);
                sumFxMarkToMarket += fxJournalsForInvestmentAtCost[0].Value;

                //ReversePosting(env, "Change in unrealized due to fx on original Cost", CommonRules.GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"), buyTrade, sumFxMarkToMarket);
            }
        }

        private void PostRealizedFxGain(PostingEngineEnvironment env, Transaction element, double realizedFxPnl, double start, double end, double fxrate)
        {
            var accountType = (element.IsShort() || element.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";
            var fromTo = new AccountUtils().GetAccounts(env, accountType, "REALIZED GAIN/(LOSS) DUE TO FX", new string[] { element.SettleCurrency }.ToList());

            var debit = new Journal(fromTo.From, Event.REALIZED_CASH_FX, env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = env.GetFund(element),
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),

                FxRate = fxrate,
                StartPrice = start,
                EndPrice = end,

                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, realizedFxPnl),
                CreditDebit = env.DebitOrCredit(fromTo.From, realizedFxPnl),
            };

            var credit = new Journal(fromTo.To, Event.REALIZED_CASH_FX, env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = env.GetFund(element),
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),

                FxRate = fxrate,
                StartPrice = start,
                EndPrice = end,

                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, realizedFxPnl),
                CreditDebit = env.DebitOrCredit(fromTo.To, realizedFxPnl),
            };


            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
        }

        private void ReversePosting(PostingEngineEnvironment env, string fromAccount, string toAccount, Transaction element, double reversalAmount)
        {
            var fromTo = new AccountUtils().GetAccounts(env, fromAccount, toAccount, new string[] { element.SettleCurrency }.ToList());

            var debit = new Journal(fromTo.From, "reversal-unrealized-cash-fx", env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = env.GetFund(element),
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),
                FxRate = 0,
                StartPrice = 0,
                EndPrice = 0,

                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, reversalAmount * -1),
                CreditDebit = env.DebitOrCredit(fromTo.From, reversalAmount),
            };

            var credit = new Journal(fromTo.To, "reversal-unrealized-cash-fx", env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = env.GetFund(element),
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),

                FxRate = 0,
                StartPrice = 0,
                EndPrice = 0,

                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, reversalAmount * -1),
                CreditDebit = env.DebitOrCredit(fromTo.To, reversalAmount),
            };

            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
        }

        private void PostUnrealizedFxGain(PostingEngineEnvironment env, Transaction element, double realizedFxPnl, double start, double end, double fxrate)
        {
            var m2mtranslation = "Mark to Market longs fx translation gain or loss";
            if (element.IsShort())
                m2mtranslation = "Mark to Market shorts fx translation gain or loss";

            var fromTo = new AccountUtils().GetAccounts(env, m2mtranslation, "change in unrealized do to fx translation", new string[] { element.SettleCurrency }.ToList());

            var debit = new Journal(fromTo.From, Event.UNREALIZED_FX_TRANSLATION, env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = env.GetFund(element),
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),

                FxRate = fxrate,
                StartPrice = start,
                EndPrice = end,

                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, realizedFxPnl * -1),
                CreditDebit = env.DebitOrCredit(fromTo.From, realizedFxPnl),
            };

            var credit = new Journal(fromTo.To, Event.UNREALIZED_FX_TRANSLATION, env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = env.GetFund(element),
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),

                FxRate = fxrate,
                StartPrice = start,
                EndPrice = end,

                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, realizedFxPnl * -1),
                CreditDebit = env.DebitOrCredit(fromTo.To, realizedFxPnl),
            };

            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
        }


    }
}
