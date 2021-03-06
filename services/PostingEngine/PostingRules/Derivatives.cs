﻿using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
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
                        eodPrice = MarketPrices.GetPrice(env, env.ValueDate, element).Price;
                        prevEodPrice = element.SettleNetPrice;
                    }
                    else
                    {
                        prevEodPrice = MarketPrices.GetPrice(env, env.PreviousValueDate, element).Price;
                        eodPrice = MarketPrices.GetPrice(env, env.ValueDate, element).Price;
                    }

                    var unrealizedPnl = CommonRules.CalculateUnrealizedPnl(env, taxlot);

                    AccountToFrom fromToAccounts = null;

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
                        Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, true, unrealizedPnl),
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
                        Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, false, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromToAccounts.To, env.SignedValue(fromToAccounts.From, fromToAccounts.To, false, unrealizedPnl)),
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
            double fxrate = 1.0;

            double multiplier = 1.0;

            if (env.SecurityDetails.ContainsKey(element.BloombergCode))
                multiplier = env.SecurityDetails[element.BloombergCode].Multiplier;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            if ( element.IsBuy() || element.IsShort())
            {
                var t1 = env.GenerateOpenTaxLot(element, fxrate);

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
                    var t1 = env.GenerateOpenTaxLot(element, fxrate);
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
                            continue;
                        }

                        var taxlotStatus = env.TaxLotStatus[lot.Trade.LpOrderId];
                        if (taxlotStatus != null && taxlotStatus.Quantity != 0 && !taxlotStatus.Status.ToLowerInvariant().Equals("closed"))
                        {
                            // Does the open Lot fully fullfill the quantity ?
                            if (Math.Abs(taxlotStatus.Quantity) >= Math.Abs(workingQuantity))
                            {
                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, workingQuantity, true);

                                taxlotStatus.Quantity += workingQuantity;
                                if (taxlotStatus.Quantity == 0)
                                    taxlotStatus.Status = "Closed";
                                else
                                    taxlotStatus.Status = "Partially Closed";

                                CommonRules.GenerateCloseOutPostings(env, lot, taxlot, element, taxlotStatus, env.GetFund(element));

                                break;
                            }
                            else
                            {
                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, taxlotStatus.Quantity * -1);

                                workingQuantity -= Math.Abs(taxlotStatus.Quantity);

                                var accountTypes = AccountType.All;

                                var listOfTags = new List<Tag> {
                                    Tag.Find("SecurityType"),
                                    Tag.Find("CustodianCode")
                                 };

                                Account fromAccount = null; // Debiting Account
                                Account toAccount = null; // Crediting Account

                                var realizedPnl = taxlot.RealizedPnl;

                                var originalAccount = AccountUtils.GetDerivativeAccountType(realizedPnl);
                                if (originalAccount.Contains("(Liabilities)"))
                                {
                                    // This needs to be registered as a Credit to the Libabilities
                                    realizedPnl *= -1;
                                }

                                var fromToAccounts = new AccountUtils().GetAccounts(env, originalAccount, "REALIZED GAIN/(LOSS)", listOfTags, taxlot.Trade);
                                fromAccount = fromToAccounts.From;
                                toAccount = fromToAccounts.To;

                                var debitJournal = new Journal(element)
                                {
                                    Account = fromAccount,
                                    When = env.ValueDate,
                                    StartPrice = taxlot.TradePrice,
                                    EndPrice = taxlot.CostBasis,
                                    CreditDebit = env.DebitOrCredit(fromAccount, taxlot.RealizedPnl),
                                    Value = env.SignedValue(fromAccount, toAccount, true, taxlot.RealizedPnl),
                                    FxRate = fxrate,
                                    Event = Event.REALIZED_PNL,
                                    Fund = env.GetFund(element),
                                };

                                var creditJournal = new Journal(debitJournal)
                                {
                                    Account = toAccount,
                                    CreditDebit = env.DebitOrCredit(toAccount, taxlot.RealizedPnl * -1),
                                    Value = env.SignedValue(fromAccount, toAccount, false, taxlot.RealizedPnl),
                                };

                                env.Journals.AddRange(new[] { debitJournal, creditJournal });

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
        }
    }
}
