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
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace PostingEngine.PostingRules
{
    // Common functions that are shared across all IPostingRule implementations
    public class DefaultPostingRules
    {
        private List<Tag> listOfTags = new List<Tag>
                {
                    Tag.Find("SecurityType"),
                    Tag.Find("CustodianCode")
                };

        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        internal void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            var fxrate = element.FxRate(env);

            // Calculate the unrealized PNL
            if (env.TaxLotStatus.ContainsKey(element.LpOrderId))
            {
                // Determine if we need to accumulate unrealized PNL
                var taxLotStatus = env.TaxLotStatus[element.LpOrderId];

                // Check to see if the TaxLot is still open and it has a non zero Quantity
                if (!taxLotStatus.Status.ToLowerInvariant().Equals("closed") && Math.Abs(taxLotStatus.Quantity) > 0)
                {
                    GenerateDailyUnrealized(env, taxLotStatus, element, taxLotStatus.Quantity, fxrate);
                }
            }
            else
            {
                if (fxrate != 1.0)
                {
                    if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                    {
                        var closingTaxLots = env.TaxLot.Where(i => i.ClosingLotId.Equals(element.LpOrderId)).ToList();

                        foreach (var closingTaxLot in closingTaxLots)
                        {
                            var taxLotStatus = env.TaxLotStatus[closingTaxLot.OpeningLotId];

                            var fxJournals = FxPosting.ReverseFxPosting(
                                    env,
                                    "DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )",
                                    "fx gain or loss on unsettled balance",
                                    "daily",
                                    taxLotStatus, closingTaxLot);
                            env.Journals.AddRange(fxJournals);

                        }

                    }
                }

                }
        }

        private double GenerateDailyUnrealized(PostingEngineEnvironment env, TaxLotStatus taxLotStatus, Transaction element, double quantity, double fxRate, bool closeout = false)
        {
            var prevEodPrice = 0.0;
            var eodPrice = 0.0;

            if (env.ValueDate == taxLotStatus.Trade.TradeDate)
            {
                prevEodPrice = taxLotStatus.Trade.SettleNetPrice;
                eodPrice = MarketPrices.GetPrice(env, env.ValueDate, taxLotStatus.Trade).Price;
            }
            else
            {
                prevEodPrice = MarketPrices.GetPrice(env, env.PreviousValueDate, taxLotStatus.Trade).Price;
                eodPrice = MarketPrices.GetPrice(env, env.ValueDate, taxLotStatus.Trade).Price;
            }

            var endPrice = element.SettleNetPrice;

            if ( closeout )
            {
                eodPrice = endPrice;
            }

            var unrealizedPnl = CommonRules.CalculateUnrealizedPnl(env, taxLotStatus, quantity, eodPrice);

            var originalAccount = taxLotStatus.Side == "SHORT" ? "Mark to Market Shorts" : "Mark to Market Longs";
            var fromToAccounts = new AccountUtils().GetAccounts(env, originalAccount, "CHANGE IN UNREALIZED GAIN/(LOSS)", listOfTags, taxLotStatus.Trade);

            if (taxLotStatus.Trade.IsShort())
            {
                unrealizedPnl *= -1;
            }

            var fund = env.GetFund(taxLotStatus.Trade);

            var debit = new Journal(taxLotStatus.Trade)
            {
                Account = fromToAccounts.From,
                When = env.ValueDate,
                Symbol = taxLotStatus.Symbol,
                Quantity = quantity,
                FxRate = fxRate,
                Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, true, unrealizedPnl),
                CreditDebit = env.DebitOrCredit(fromToAccounts.From, unrealizedPnl),
                StartPrice = prevEodPrice,
                EndPrice = eodPrice,
                Event = Event.DAILY_UNREALIZED_PNL,
                Fund = fund,
            };

            var credit = new Journal(debit)
            {
                Account = fromToAccounts.To,
                Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, false, unrealizedPnl),
                CreditDebit = env.DebitOrCredit(fromToAccounts.To, unrealizedPnl),
            };

            env.Journals.AddRange(new[] { debit, credit });

            if (fxRate != 1.0)
            {
                if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                {
                    // Take into account the FX rate between Value and Settlement Date
                    var fxJournals = FxPosting.CreateFx(
                        env,
                        "DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )",
                        "fx gain or loss on unsettled balance",
                        "daily",
                        quantity, null, element, true);
                    env.Journals.AddRange(fxJournals);
                }

                if (taxLotStatus.Quantity != 0.0)
                {
                    if (element.TradeDate != env.ValueDate)
                    {
                        // Has to happen for every day
                        var fxJournalsForInvestmentAtCost = FxPosting.CreateFx(
                            env,
                            "Change in unrealized due to fx on original Cost",
                            CommonRules.GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"),
                            "daily", quantity, taxLotStatus, element);
                        env.Journals.AddRange(fxJournalsForInvestmentAtCost);

                        new FxPosting().CreateFxUnsettled(env, element);
                    }
                }
            }

            return unrealizedPnl;
        }

        internal void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            if (env.IsTaxLot(element))
            {
                CommonRules.GenerateSettlementDateJournals(env, element);
                return;
            }

            // This is only for closing tax lots
            var closingTaxLots = env.TaxLot.Where(i => i.ClosingLotId.Equals(element.LpOrderId)).ToList();

            foreach (var closingTaxLot in closingTaxLots)
            {
                var taxLotStatus = env.TaxLotStatus[closingTaxLot.OpeningLotId];

                CommonRules.GenerateSettlementDateJournals(env, taxLotStatus, closingTaxLot);
            }
        }

        internal void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            var multiplier = element.Multiplier(env);
            var fxrate = element.FxRate(env);

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
                if (element.Quantity == 0)
                {
                    // TODO: Need to review this as we need to see if there is a parent, and what the parents actuall is
                    return;
                }

                var tl = env.GenerateOpenTaxLotStatus(element, fxrate);
                CommonRules.GenerateTradeDateJournals(env, element);
            }
            else if (element.IsSell() || element.IsCover())
            {
                var workingQuantity = element.Quantity;

                var openLots = env.Methodology.GetOpenLots(env, element, workingQuantity);

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
                        Logger.Info($"Relieving Tax Lot {taxlotStatus.TradeDate.ToString("MM-dd-yyyy")}::{taxlotStatus.Symbol}::{taxlotStatus.OpenId}::{lot.TaxLiability}::{lot.TaxRate.Rate}::{lot.PotentialPnl}");

                        if ( taxlotStatus.OpenId.Equals("61994d8d-946a-4ede-8e42-5f890452a0cb"))
                        {

                        }

                        // Does the open Lot fully fullfill the quantity ?
                        if (Math.Abs(taxlotStatus.Quantity) >= Math.Abs(workingQuantity))
                        {
                            // Lets generate all the journal entries we need
                            var closingTaxLot = GenerateJournals(env, lot, taxlotStatus, element, workingQuantity, fxrate, multiplier);

                            CommonRules.GenerateTradeDateJournals(env, taxlotStatus, closingTaxLot);

                            break;
                        }
                        else
                        {
                            var quantity = taxlotStatus.Quantity;

                            var closingTaxLot = GenerateJournals(env, lot, taxlotStatus, element, taxlotStatus.Quantity * -1, fxrate, multiplier);

                            CommonRules.GenerateTradeDateJournals(env, taxlotStatus, closingTaxLot);

                            workingQuantity += quantity;
                        }
                    }
                }
            }
            else
            {
                // We have a Debit / Credit Dividends
            }
        }


        /// <summary>
        /// Generate all of the journal entries we need for reduction / closeout of a tax lot
        /// </summary>
        /// <param name="env"></param>
        /// <param name="lot"></param>
        /// <param name="taxlotStatus"></param>
        /// <param name="element"></param>
        /// <param name="workingQuantity"></param>
        /// <param name="fxrate"></param>
        /// <param name="multiplier"></param>
        private TaxLot GenerateJournals(PostingEngineEnvironment env, 
            TaxLotDetail lot, 
            TaxLotStatus taxlotStatus, 
            Transaction element, double workingQuantity, double fxrate, double multiplier)
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

            var localWorkingQuantity = taxlotStatus.Quantity;

            taxlotStatus.Quantity += workingQuantity;
            if (taxlotStatus.Quantity == 0)
                taxlotStatus.Status = "Closed";
            else
                taxlotStatus.Status = "Partially Closed";

            // Is this really needed, as if the tax lot is zero then should not generate any additional unrealized pnl
            var dailyUnrealized = GenerateDailyUnrealized(env, taxlotStatus, element, workingQuantity * -1, fxrate, true);

            var eodPrice = MarketPrices.GetPrice(env, env.PreviousValueDate, buyTrade).Price;

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

            DataTableCollection dataTable = null;
            if (!env.BaseCurrency.Equals(element.SettleCurrency))
            {
                List<SqlParameter> sqlParams = new List<SqlParameter>();
                sqlParams.Add(new SqlParameter("@busDate", env.ValueDate));
                sqlParams.Add(new SqlParameter("@LpOrderId", lot.Trade.LpOrderId));

                // This gets passed values, we also need to get anything that posts for this valuedate
                dataTable = new SqlHelper(env.ConnectionString).GetDataTables("ClosingTaxLot", CommandType.StoredProcedure, sqlParams.ToArray());
            }

            var journalsToBePosted = env.Journals.Where(i => i.Source.Equals(lot.Trade.LpOrderId));

            var unrealisedPnl = journalsToBePosted.Unrealized() * -1;
            var unrealisedPnlFx = journalsToBePosted.UnrealizedFxTranslation() * -1;
            var assetUnrealisedPnl = journalsToBePosted.AssetDailyUnrealizedFx();
            var revenueUnrealisedPnl = journalsToBePosted.RevenueDailyUnrealizedFx();

            var q = Math.Abs(localWorkingQuantity);
            var p = Math.Abs(taxlot.Quantity);
            var percentage = p / q;

            var changeInUnRealized = 0.0;
            if (dataTable != null)
            {
                if (dataTable[0].Rows.Count > 0)
                    changeInUnRealized = Convert.ToDouble(dataTable[0].Rows[0][2]);

                //changeInUnRealized -= (dailyUnrealized + unrealisedPnl);

                changeInUnRealized *= percentage;
                changeInUnRealized -= (unrealisedPnl);
            }
            else
            {
                changeInUnRealized = taxlot.RealizedPnl;
            }

            // Need to backout the Unrealized PNL here, as we are reducing the position of the TaxLot
            CommonRules.ReverseUnrealizedPnl(
                env,
                buyTrade,
                element,
                changeInUnRealized,
                buyTrade.SettleNetPrice,
                element.SettleNetPrice,
                fxrate);

            var changeInUnRealizedFx = 0.0;
            if (dataTable != null && dataTable[1].Rows.Count > 0)
                changeInUnRealizedFx = Convert.ToDouble(dataTable[1].Rows[0][2]);

            if (changeInUnRealizedFx != 0.0)
            {
                var closeOut = changeInUnRealizedFx - fxChange;

                // Need to reserve the amount
                ReverseUnrealizedFxGain(env, buyTrade, closeOut * -1, taxlot.TradePrice, taxlot.CostBasis, changeDueToFx);
            }

            var sumFxMarkToMarket = 0.0;
            if (dataTable != null && dataTable[2].Rows.Count > 0)
            {
                sumFxMarkToMarket = Convert.ToDouble(dataTable[2].Rows[0][2]);
                //sumFxMarkToMarket -= fxJournalsForInvestmentAtCost[0].Value;

                //sumFxMarkToMarket -= revenueUnrealisedPnl;

                // partial same as Unrealized PNL
                sumFxMarkToMarket *= percentage;

                sumFxMarkToMarket -= revenueUnrealisedPnl;

                ReversePosting(env, "Change in unrealized due to fx on original Cost", CommonRules.GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"), buyTrade, sumFxMarkToMarket);
            }

            return taxlot;
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

                Value = env.SignedValue(fromTo.From, fromTo.To, true, realizedFxPnl),
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

        /// <summary>
        /// Reverse the collection fx due to Transaction
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element"></param>
        /// <param name="realizedFxPnl"></param>
        /// <param name="start"></param>
        /// <param name="end"></param>
        /// <param name="fxrate"></param>
        private void ReverseUnrealizedFxGain(PostingEngineEnvironment env, Transaction element, double fxTranslationPnl, double start, double end, double fxrate)
        {
            var m2mtranslation = element.IsShort() ? "Mark to Market shorts fx translation gain or loss" : "Mark to Market longs fx translation gain or loss";

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

                Value = env.SignedValue(fromTo.From, fromTo.To, true, fxTranslationPnl),
                CreditDebit = env.DebitOrCredit(fromTo.From, fxTranslationPnl),
            };

            var credit = new Journal(debit)
            {
                Account = fromTo.To,
                Value = env.SignedValue(fromTo.From, fromTo.To, false, fxTranslationPnl),
                CreditDebit = env.DebitOrCredit(fromTo.To, fxTranslationPnl),
            };

            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
        }
    }
}
