using LP.Finance.Common.Models;
using PostingEngine.Contracts;
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

    // Common functions that are shared across all IPostingRule implementations
    public class DefaultPostingRules
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        internal void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
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
                        eodPrice = MarketPrices.Find(env.ValueDate, element).Price;
                        prevEodPrice = element.SettleNetPrice;
                    }
                    else
                    {
                        prevEodPrice = MarketPrices.Find(env.PreviousValueDate, element).Price;
                        eodPrice = MarketPrices.Find(env.ValueDate, element).Price;
                    }

                    var unrealizedPnl = CommonRules.CalculateUnrealizedPnl(env, taxlot);
                   
                    AccountToFrom fromToAccounts = null;

                    if ( element.IsDerivative())
                    {
                        var originalAccount = AccountUtils.GetDerivativeAccountType(unrealizedPnl);
                        fromToAccounts = new AccountUtils().GetAccounts(env, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", listOfTags, taxlot.Trade);
                    }
                    else
                    {
                        var originalAccount = taxlot.Side == "SHORT" ? "Mark to Market Shorts" : "Mark to Market Longs";
                        fromToAccounts = new AccountUtils().GetAccounts(env, originalAccount, "CHANGE IN UNREALIZED GAIN/(LOSS)", listOfTags, taxlot.Trade);
                        if ( taxlot.Side == "SHORT" )
                        {
                            unrealizedPnl *= -1;
                        }
                    }

                    var fund = env.GetFund(element);

                    var debit = new Journal(element)
                    {
                        Account = fromToAccounts.From,
                        When = env.ValueDate,
                        Symbol = taxlot.Symbol,
                        Quantity = quantity,
                        FxRate = fxrate,
                        Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, true, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromToAccounts.From, unrealizedPnl),
                        StartPrice = prevEodPrice,
                        EndPrice = eodPrice,
                        Event = "unrealizedpnl",
                        Fund = fund,
                    };

                    var credit = new Journal(element)
                    {
                        Account = fromToAccounts.To,
                        When = env.ValueDate,
                        FxRate = fxrate,
                        Quantity = quantity,
                        Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, false, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromToAccounts.To, unrealizedPnl),
                        Event = "unrealizedpnl",
                        StartPrice = prevEodPrice,
                        EndPrice = eodPrice,
                        Fund = fund,
                    };

                    env.Journals.AddRange(new[] { debit, credit });

                    if (fxrate != 1.0)
                    {
                        if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                        {
                            var fxJournals = FxPosting.CreateFx(
                                env,
                                "DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )", 
                                "fx gain or loss on unsettled balance",
                                "daily", 
                                quantity, null, element);
                            env.Journals.AddRange(fxJournals);
                        }

                        if (taxlot.Quantity != 0.0)
                        {
                            if ( env.ValueDate.Equals(new DateTime(2019,12,17)))
                            {

                            }

                            if (element.TradeDate != env.ValueDate)
                            {

                                // Has to happen for every day
                                var fxJournalsForInvestmentAtCost = FxPosting.CreateFx(
                                    env,
                                    CommonRules.GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"),
                                    CommonRules.GetChangeInUnrealizedDueToFx(element, "Change in unrealized due to fx on original Cost"),
                                    "daily", quantity, taxlot, element);
                                env.Journals.AddRange(fxJournalsForInvestmentAtCost);

                                new FxPosting().CreateFxUnsettled(env, element);
                            }
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
                        var fxJournals = FxPosting.CreateFx(
                            env,
                            "DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )",
                            "fx gain or loss on unsettled balance",
                            "daily",
                            element.Quantity, null, element);
                        env.Journals.AddRange(fxJournals);
                    }
                }

                }

            if (element.SettleCurrency.Equals(env.BaseCurrency))
                return;

            /*
            if ( env.ValueDate > element.TradeDate && env.ValueDate <= element.SettleDate)
            {
                var prev = Convert.ToDouble(FxRates.Find(env.PreviousValueDate, element.SettleCurrency).Rate);
                var eod = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);

                var local = Convert.ToDouble(element.NetMoney);

                var changeDelta = eod - prev;
                var change = changeDelta * local * -1;
                var fromTo = new AccountUtils().GetAccounts(env, "Settled Cash", "fx gain or loss on settled balance", new string[] { element.SettleCurrency }.ToList());

                var debit = new Journal(fromTo.From, "settled-cash-fx", env.ValueDate)
                {
                    Source = element.LpOrderId,
                    Fund = element.Fund,
                    Quantity = local,

                    FxCurrency = element.SettleCurrency,
                    Symbol = element.Symbol,
                    SecurityId = element.SecurityId,
                    FxRate = changeDelta,
                    StartPrice = prev,
                    EndPrice = eod,

                    Value = env.SignedValue(fromTo.From, fromTo.To, true, change),
                    CreditDebit = env.DebitOrCredit(fromTo.From, change),
                };

                var credit = new Journal(fromTo.To, "settled-cash-fx", env.ValueDate)
                {
                    Source = element.LpOrderId,
                    Fund = element.Fund,
                    Quantity = local,

                    FxCurrency = element.SettleCurrency,
                    Symbol = element.Symbol,
                    SecurityId = element.SecurityId,
                    FxRate = changeDelta,
                    StartPrice = prev,
                    EndPrice = eod,

                    Value = env.SignedValue(fromTo.From, fromTo.To, false, change),
                    CreditDebit = env.DebitOrCredit(fromTo.To, change),
                };

                env.Journals.AddRange(new[] { debit, credit });
            }
                */
        }
        internal void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            CommonRules.GenerateSettlementDateJournals(env, element);
        }
        internal void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            double multiplier = 1.0;

            if (env.SecurityDetails.ContainsKey(element.BloombergCode))
                multiplier = env.SecurityDetails[element.BloombergCode].Multiplier;

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }


            if ( element.IsCredit() || element.IsDebit())
            {
                if ( element.TransactionCategory == "Cash Dividends")
                {
                    // We have a Cash Dividend, so how do we treat this
                    return;
                }
            }

            if (element.IsBuy() || element.IsShort())
            {
                var tl = env.GenerateOpenTaxLot(element, fxrate);

                if (element.Quantity == 0)
                {
                    // TODO: Need to review this as we need to see if there is a parent, and what the parents actuall is
                    return;
                }

                //tl.Save(env.Connection, env.Transaction);
            }
            else if (element.IsSell() || element.IsCover())
            {
                // Get Matching Lots
                var openLots = env.Methodology.GetOpenLots(env, element);

                if (openLots.Count() == 0)
                {
                    // We are unable to find the coresponding Tax Lots for this trade

                    // If no open Tax Lot, need to create a new one
                    var tl = env.GenerateOpenTaxLot(element, fxrate);

                    // Whats going on here?
                    // We are skipping anything that does not get an OpenLot
                    env.AddMessage($"Created an Open Tax Lot for {element.Symbol}::{element.Side}");
                }
                else
                {
                    var workingQuantity = element.Quantity;

                    foreach (var lot in openLots)
                    {
                        if (workingQuantity == 0)
                            break;

                        if (!env.TaxLotStatus.ContainsKey(lot.Trade.LpOrderId))
                        {
                            // TODO: For this open lot there should be a corresponding open to 
                            env.AddMessage($"Unable to Find Tax Lot for {lot.Trade.Symbol}::{lot.Trade.Side}::{lot.Trade.Status}");
                            //Logger.Warn($"Unable to Find Tax Lot for {element.Symbol}::{element.Side}::{element.Status}");
                            continue;
                        }

                        var taxlotStatus = env.TaxLotStatus[lot.Trade.LpOrderId];
                        if (taxlotStatus != null && taxlotStatus.Quantity != 0 && !taxlotStatus.Status.ToLowerInvariant().Equals("closed"))
                        {
                            // Does the open Lot fully fullfill the quantity ?
                            if (Math.Abs(taxlotStatus.Quantity) >= Math.Abs(workingQuantity))
                            {
                                // Lets generate all the journal entries we need
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

            CommonRules.GenerateTradeDateJournals(env, element);

        }

        private void GenerateJournals(PostingEngineEnvironment env, TaxLotDetail lot, TaxLotStatus taxlotStatus, Transaction element, double workingQuantity, double fxrate, double multiplier)
        {
            var buyTrade = env.FindTrade(lot.Trade.LpOrderId);

            var taxlot = CommonRules.RelieveTaxLot(env, lot, element, workingQuantity, true);

            // Has to happen for every day
            var fxJournalsForInvestmentAtCost = FxPosting.CreateFx(
                env,
                CommonRules.GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"),
                CommonRules.GetChangeInUnrealizedDueToFx(element, "Change in unrealized due to fx on original Cost"),
                "daily", workingQuantity, taxlotStatus, buyTrade);
            env.Journals.AddRange(fxJournalsForInvestmentAtCost);

            taxlotStatus.Quantity += workingQuantity;
            if (taxlotStatus.Quantity == 0)
                taxlotStatus.Status = "Closed";
            else
                taxlotStatus.Status = "Partially Closed";

            var prevPrice = MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price;

            // Calculate the unrealized PNL for the created Tax Lot
            var unrealizedPnl = Math.Abs(taxlot.Quantity) * (element.SettleNetPrice - prevPrice) * multiplier;

            unrealizedPnl *= CommonRules.DetermineSign(element);

            CommonRules.PostUnRealizedPnl(
                env,
                buyTrade,
                unrealizedPnl,
                prevPrice,
                element.SettleNetPrice,
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

            if (fxrate != 1.0)
                PostRealizedFxGain(env, buyTrade, changeInRealizedPnlDueToFx, taxlot.TradePrice, taxlot.CostBasis, changeDueToFx);

            var fxChange = new FxPosting().CreateFxUnsettled(env, buyTrade);

            List<SqlParameter> sqlParams = new List<SqlParameter>();
            sqlParams.Add(new SqlParameter("@busDate", env.ValueDate));
            sqlParams.Add(new SqlParameter("@LpOrderId", lot.Trade.LpOrderId));

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

                PostUnrealizedFxGain(env, buyTrade, closeOut, taxlot.TradePrice, taxlot.CostBasis, changeDueToFx);
            }

            var sumFxMarkToMarket = 0.0;
            if (dataTable[2].Rows.Count > 0)
            {
                sumFxMarkToMarket = Convert.ToDouble(dataTable[2].Rows[0][2]);
                sumFxMarkToMarket += fxJournalsForInvestmentAtCost[0].Value;

                ReversePosting(env, CommonRules.GetChangeInUnrealizedDueToFx(element, "Change in unrealized due to fx on original Cost"), CommonRules.GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"), buyTrade, sumFxMarkToMarket);
            }


            var listOfFromTags = new List<Tag>
                                    {
                                        Tag.Find("SecurityType"),
                                        Tag.Find("CustodianCode")
                                    };

            var markToMarketAccount = (buyTrade.IsShort() || buyTrade.IsCover()) ? "Mark to Market Shorts" : "Mark to Market Longs";

            var fromTo = new AccountUtils().GetAccounts(env, "CHANGE IN UNREALIZED GAIN/(LOSS)", markToMarketAccount, listOfFromTags, element);

            if (fxrate == 1.0)
            {
                changeInUnRealized = Convert.ToDouble(taxlot.RealizedPnl) * -1;
            }

            // Now Generate Entries for the trade that is drawing down on the taxLot
            var fromJournal = new Journal(buyTrade)
            {
                Account = fromTo.From,
                When = env.ValueDate,

                CreditDebit = env.DebitOrCredit(fromTo.From, changeInUnRealized),
                Value = env.SignedValue(fromTo.From, fromTo.To, true, changeInUnRealized),
                Event = "unrealizedpnl",
                Fund = env.GetFund(element),

                StartPrice = taxlot.TradePrice,
                EndPrice = taxlot.CostBasis,
                FxRate = fxrate,
            };

            var toJournal = new Journal(buyTrade)
            {
                Account = fromTo.To,
                When = env.ValueDate,

                CreditDebit = env.DebitOrCredit(fromTo.To, changeInUnRealized * -1),
                Value = env.SignedValue(fromTo.From, fromTo.To, false, changeInUnRealized),
                Event = "unrealizedpnl",
                Fund = env.GetFund(element),

                StartPrice = taxlot.TradePrice,
                EndPrice = taxlot.CostBasis,
                FxRate = fxrate,
            };

            env.Journals.AddRange(new[] { fromJournal, toJournal });
        }

       
        private void PostRealizedFxGain(PostingEngineEnvironment env, Transaction element, double realizedFxPnl, double start, double end, double fxrate)
        {
            var accountType = (element.IsShort() || element.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";
            var fromTo = new AccountUtils().GetAccounts(env, accountType, "REALIZED GAIN/(LOSS) DUE TO FX", new string[] { element.SettleCurrency }.ToList());

            var debit = new Journal(fromTo.From, "realized-cash-fx", env.ValueDate)
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

                Value = env.SignedValue(fromTo.From, fromTo.To, true, realizedFxPnl),
                CreditDebit = env.DebitOrCredit(fromTo.From, realizedFxPnl),
            };

            var credit = new Journal(fromTo.To, "realized-cash-fx", env.ValueDate)
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

                Value = env.SignedValue(fromTo.From, fromTo.To, false, realizedFxPnl),
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

                Value = env.SignedValue(fromTo.From, fromTo.To, true, reversalAmount * -1),
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

                Value = env.SignedValue(fromTo.From, fromTo.To, false, reversalAmount * -1),
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

            var debit = new Journal(fromTo.From, "unrealized-cash-fx", env.ValueDate)
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

                Value = env.SignedValue(fromTo.From, fromTo.To, true, realizedFxPnl* -1),
                CreditDebit = env.DebitOrCredit(fromTo.From, realizedFxPnl),
            };

            var credit = new Journal(fromTo.To, "unrealized-cash-fx", env.ValueDate)
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

                Value = env.SignedValue(fromTo.From, fromTo.To, false, realizedFxPnl * -1),
                CreditDebit = env.DebitOrCredit(fromTo.To, realizedFxPnl),
            };

            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
        }
    }
}
