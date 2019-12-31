﻿using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
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
                    var type = element.GetType();
                    var accountTypes = AccountType.All;

                    var listOfFromTags = new List<Tag>
                    {
                        Tag.Find("SecurityType"),
                        Tag.Find("CustodianCode")
                    };

                    var listOfToTags = new List<Tag> {
                        Tag.Find("SecurityType"),
                        Tag.Find("CustodianCode")
                     };

                    // We have an open / partially closed tax lot so now need to calculate unrealized Pnl
                    var quantity = taxlot.Quantity;
                    var symbol = element.Symbol;

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

                    var multiplier = 1.0;

                    if (env.SecurityDetails.ContainsKey(element.BloombergCode))
                        multiplier = env.SecurityDetails[element.BloombergCode].Multiplier;

                    var localunrealizedPnl = quantity * (eodPrice - prevEodPrice) * multiplier;

                    var unrealizedPnl = quantity * (eodPrice - prevEodPrice) * fxrate * multiplier;

                    var originalAccount = taxlot.Side == "SHORT" ? "Mark to Market Shorts" : "Mark to Market Longs";
                    unrealizedPnl = taxlot.Side == "SHORT" ? unrealizedPnl * -1 : unrealizedPnl;

                    // Need to work out based on the Security Type and the direction of the MTM
                    var fromToAccounts = new AccountUtils().GetAccounts(env, originalAccount, "CHANGE IN UNREALIZED GAIN/(LOSS)", listOfFromTags, element);

                    fromToAccounts.From = new AccountUtils().DeriveMTMCorrectAccount(fromToAccounts.From, element, listOfFromTags, unrealizedPnl);
                    new AccountUtils().SaveAccountDetails(env, fromToAccounts.From);

                    var fund = env.GetFund(element);

                    var debit = new Journal(element)
                    {
                        Account = fromToAccounts.From,
                        When = env.ValueDate,
                        Symbol = symbol,
                        Quantity = quantity,
                        FxRate = fxrate,
                        Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, true, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromToAccounts.From, taxlot.IsShort() ? unrealizedPnl * -1 : unrealizedPnl),
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
                                element.NetMoney, quantity, null, element);
                            env.Journals.AddRange(fxJournals);
                        }

                        if (taxlot.Quantity != 0.0)
                        {
                            if (element.TradeDate != env.ValueDate)
                            {
                                // Has to happen for every day
                                var fxJournalsForInvestmentAtCost = FxPosting.CreateFx(
                                    env,
                                    GetChangeInUnrealizedDueToFx(element, "Change in unrealized due to fx on original Cost"),
                                    GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"),
                                    "daily", element.NetMoney, quantity, taxlot, element);
                                env.Journals.AddRange(fxJournalsForInvestmentAtCost);

                                new FxPosting().CreateFxUnsettled(env, element);
                            }
                        }
                    }

                }
            }
            else
            {
                if (element.Symbol.Equals("RBD"))
                {
                }

                if (fxrate != 1.0)
                {
                    if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                    {
                        var fxJournals = FxPosting.CreateFx(
                            env,
                            "DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )",
                            "fx gain or loss on unsettled balance",
                            "daily",
                            element.NetMoney, element.Quantity, null, element);
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
            double tradefxrate = 1.0;
            double settlefxrate = 1.0;
            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                tradefxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
                fxrate = tradefxrate;
            }

            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                settlefxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
                fxrate = settlefxrate;
            }

            var accountToFrom = new AccountingRules().GetFromToAccountOnSettlement(element);

            if (accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            // This is the fully loaded value to tbe posting

            if (element.NetMoney != 0.0)
            {
                var moneyUSD = Math.Abs(element.NetMoney) * fxrate;

                // BUY -- Debit
                // SELL -- Credit

                if (element.IsShort() || element.IsSell())
                    moneyUSD = moneyUSD * -1;

                if (element.Symbol.Equals("FB"))
                {

                }
                var debit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    FxCurrency = element.SettleCurrency,
                    Symbol = element.Symbol,
                    SecurityId = element.SecurityId,
                    Quantity = element.Quantity,
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, moneyUSD),
                    Event = "settlement",
                    Fund = env.GetFund(element)
                };

                var credit = new Journal
                {
                    Source = element.LpOrderId,
                    FxCurrency = element.SettleCurrency,
                    Symbol = element.Symbol,
                    SecurityId = element.SecurityId,
                    Quantity = element.Quantity,

                    FxRate = fxrate,
                    When = env.ValueDate,
                    Account = accountToFrom.To,

                    CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD * -1),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, moneyUSD),
                    Event = "settlement",
                    Fund = env.GetFund(element)
                };

                env.Journals.AddRange(new[] { debit, credit });
            }
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
                    // If no open Tax Lot, need to create a new one
                    var tl = env.GenerateOpenTaxLot(element, fxrate);

                    // Whats going on here?
                    // We are skipping anything that does not get an OpenLot
                    Logger.Warn($"Created an Open Tax Lot for {element.Symbol}::{element.Side}");
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
                            Logger.Warn($"Unable to Find Tax Lot for {lot.Trade.Symbol}::{lot.Trade.Side}::{lot.Trade.Status}");
                            //Logger.Warn($"Unable to Find Tax Lot for {element.Symbol}::{element.Side}::{element.Status}");
                            continue;
                        }

                        var taxlotStatus = env.TaxLotStatus[lot.Trade.LpOrderId];
                        if (taxlotStatus != null && taxlotStatus.Quantity != 0 && !taxlotStatus.Status.ToLowerInvariant().Equals("closed"))
                        {
                            // Does the open Lot fully fullfill the quantity ?
                            if (Math.Abs(taxlotStatus.Quantity) >= Math.Abs(workingQuantity))
                            {
                                if (element.Symbol.Equals("RBD"))
                                {

                                }

                                var buyTrade = env.FindTrade(lot.Trade.LpOrderId);

                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, workingQuantity, true);

                                // Has to happen for every day
                                var fxJournalsForInvestmentAtCost = FxPosting.CreateFx(
                                    env,
                                    GetChangeInUnrealizedDueToFx(element, "Change in unrealized due to fx on original Cost"),
                                    GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"),
                                    "daily", buyTrade.NetMoney, workingQuantity, taxlotStatus, buyTrade);
                                env.Journals.AddRange(fxJournalsForInvestmentAtCost);

                                taxlotStatus.Quantity += workingQuantity;
                                if (taxlotStatus.Quantity == 0)
                                    taxlotStatus.Status = "Closed";
                                else
                                    taxlotStatus.Status = "Partially Closed";

                                var prevPrice = MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price;

                                // Calculate the unrealized PNL for the created Tax Lot
                                var unrealizedPnl = Math.Abs(taxlot.Quantity) * (element.SettleNetPrice - prevPrice) * multiplier;

                                

                                CommonRules.PostUnRealizedPnl(
                                    env,
                                    buyTrade,
                                    unrealizedPnl,
                                    prevPrice,
                                    element.SettleNetPrice, 
                                    fxrate);

                                // Calculate the Realized PNL from closing tax lot
                                var PnL = Math.Abs(taxlot.Quantity) * (taxlot.CostBasis - taxlot.TradePrice) * fxrate * multiplier;
                                
                                // Original FxRate
                                var changeDueToFx = fxrate - taxlotStatus.FxRate;
                                // Original Trade Price
                                var changeInRealizedPnlDueToFx = changeDueToFx * (taxlot.TradePrice) * Math.Abs(taxlot.Quantity);
                                var changeInUnRealizedPnlDueToFx = changeDueToFx * (taxlot.CostBasis - taxlot.TradePrice) * Math.Abs(taxlot.Quantity);

                                CommonRules.PostRealizedPnl(
                                    env,
                                    buyTrade,
                                    PnL,
                                    taxlot.TradePrice,
                                    taxlot.CostBasis, 
                                    fxrate);

                                if (fxrate != 1.0)
                                    PostRealizedFxGain(env, buyTrade, changeInRealizedPnlDueToFx, taxlot.TradePrice, taxlot.CostBasis, changeDueToFx);

                                new FxPosting().CreateFxUnsettled(env, buyTrade);

                                List<SqlParameter> sqlParams = new List<SqlParameter>();
                                sqlParams.Add(new SqlParameter("@busDate", env.ValueDate));
                                sqlParams.Add(new SqlParameter("@LpOrderId", lot.Trade.LpOrderId));

                                var dataTable = new SqlHelper(env.ConnectionString).GetDataTables("ClosingTaxLot", CommandType.StoredProcedure, sqlParams.ToArray());

                                var changeInUnRealized = 1.0;
                                if (dataTable[0].Rows.Count > 0)
                                    changeInUnRealized = Convert.ToDouble(dataTable[0].Rows[0][2]);

                                var changeInUnRealizedFx = 0.0;
                                if ( dataTable[1].Rows.Count > 0)
                                    changeInUnRealizedFx = Convert.ToDouble(dataTable[1].Rows[0][2]);

                                if (changeInUnRealizedFx != 0.0)
                                    PostUnrealizedFxGain(env, buyTrade, changeInUnRealizedFx, taxlot.TradePrice, taxlot.CostBasis, changeDueToFx);

                                var sumFxMarkToMarket = 0.0;
                                if (dataTable[2].Rows.Count > 0)
                                {
                                    sumFxMarkToMarket = Convert.ToDouble(dataTable[2].Rows[0][2]);
                                    sumFxMarkToMarket += fxJournalsForInvestmentAtCost[0].Value;

                                    ReversePosting(env, GetChangeInUnrealizedDueToFx(element, "Change in unrealized due to fx on original Cost"), GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"), buyTrade, sumFxMarkToMarket);
                                }


                                var listOfFromTags = new List<Tag>
                                    {
                                        Tag.Find("SecurityType"),
                                        Tag.Find("CustodianCode")
                                    };

                                var markToMarketAccount = (buyTrade.IsShort()|| buyTrade.IsCover()) ? "Mark to Market Shorts" : "Mark to Market Longs";

                                var fromTo = new AccountUtils().GetAccounts(env, "CHANGE IN UNREALIZED GAIN/(LOSS)", markToMarketAccount, listOfFromTags, element);

                                if ( fxrate == 1.0 )
                                {
                                    changeInUnRealized = Convert.ToDouble(PnL);
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

                                break;
                            }
                            else
                            {
                                // Need to reverse this as this is a complete reduction of the taxlot
                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, taxlotStatus.Quantity* -1);

                                workingQuantity += taxlotStatus.Quantity;

                                var PnL = Math.Abs(taxlot.Quantity) * (taxlot.CostBasis - taxlot.TradePrice) * fxrate * multiplier;

                                CommonRules.PostRealizedPnl(env, element, PnL, taxlot.TradePrice, taxlot.CostBasis, fxrate);

                                if (element.Symbol.Equals("RBD"))
                                {
                                }

                                // Has to happen for every day
                                var fxJournalsForInvestmentAtCost = FxPosting.CreateFx(
                                    env,
                                    GetChangeInUnrealizedDueToFx(element, "Change in unrealized due to fx on original Cost"),
                                    GetFXMarkToMarketAccountType(element, "FX MARKET TO MARKET ON STOCK COST"),
                                    "daily", element.NetMoney, taxlotStatus.Quantity, taxlotStatus, element);
                                env.Journals.AddRange(fxJournalsForInvestmentAtCost);

                                taxlotStatus.Quantity = 0;
                                taxlotStatus.Status = "Closed";
                            }
                        }
                    }
                }
            }
            else
            {
                // We have a Debit / Credit Dividends
            }

            var tradeAllocations = env.Allocations.Where(i => i.LpOrderId == element.LpOrderId).ToList();

            // Retrieve Allocation Objects for this trade
            if (tradeAllocations.Count() > 2)
            {
                env.AddMessage($"#of allocations > 2 please investigate {element.LpOrderId}");
                return;
            }

            if (tradeAllocations.Count() == 2)
            {
                var debitEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[0] : tradeAllocations[1];
                if (debitEntry.Symbol.Equals("@CASHUSD"))
                {
                    env.AddMessage($"Unexpected Cash allocation please investigate {element.LpOrderId}");
                    return;
                }
            }

            var accountToFrom = GetFromToAccount(element);
            if (accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);


            if (element.NetMoney != 0.0)
            {
                var moneyUSD = Math.Abs(element.NetMoney) * fxrate;

                // BUY -- Debit
                // SELL -- Credit

                if (element.IsSell() || element.IsCover())
                    moneyUSD = moneyUSD * -1;

                var eodPrice = MarketPrices.Find(env.ValueDate, element).Price;
                if ( element.TradeCurrency.Equals("GBX"))
                {
                    eodPrice = eodPrice / 100;
                }

                var fromJournal = new Journal(element, accountToFrom.From, "tradedate", env.ValueDate)
                {
                    CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, moneyUSD),
                    FxRate = fxrate,
                    StartPrice = element.SettleNetPrice,
                    EndPrice = eodPrice,
                    Fund = env.GetFund(element),
                };

                var toJournal = new Journal(element, accountToFrom.To, "tradedate", env.ValueDate)
                {
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD * -1),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, moneyUSD),
                    StartPrice = element.SettleNetPrice,
                    EndPrice = eodPrice,
                    Fund = env.GetFund(element),
                };

                env.Journals.AddRange(new[] { fromJournal, toJournal });
            }
        }

        private string GetFXMarkToMarketAccountType(Transaction element, string v)
        {
            var accounttype = v;

            switch (element.SecurityType)
            {
                case "FORWARD":
                case "Physical index future.":
                case "Equity Swap":
                    accounttype = "FX Mark to Market on Derivative Contracts";
                    break;
            }

            return accounttype;
        }
        private string GetChangeInUnrealizedDueToFx(Transaction element, string v)
        {
            var accounttype = v;

            switch (element.SecurityType)
            {
                case "FORWARD":
                case "Physical index future.":
                case "Equity Swap":
                    accounttype = "Change in unrealized due to fx on derivates contracts";
                    break;
            }

            return accounttype;
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
            if ( element.Symbol.Equals("RBD"))
            {

            }
            var fromTo = new AccountUtils().GetAccounts(env, "Mark to Market longs fx translation gain or loss", "change in unrealized do to fx translation", new string[] { element.SettleCurrency }.ToList());

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

        private AccountToFrom GetFromToAccount(Transaction element)
        {
            var type = element.GetType();
            var accountTypes = AccountType.All;

            var listOfFromTags = new List<Tag> {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
             };

            var listOfToTags = new List<Tag>
            {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
            };

            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account

            var accountType = (element.IsShort() || element.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";

            fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals(accountType)).FirstOrDefault(), listOfFromTags, element);
            toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, element);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

    }
}
