using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using PostingEngine.TaxLotMethods;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.PostingRules
{
    public class Forward : IPostingRule
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
                            eodPrice = MarketPrices.Find(env.ValueDate, element).Price;
                            prevEodPrice = element.SettleNetPrice;
                        }
                        else
                        {
                            prevEodPrice = MarketPrices.Find(env.PreviousValueDate, element).Price;
                            eodPrice = MarketPrices.Find(env.ValueDate, element).Price;
                        }

                        var unrealizedPnl = CommonRules.CalculateUnrealizedPnl(env, taxlot);

                        var originalAccount = AccountUtils.GetDerivativeAccountType(unrealizedPnl);

                    if (originalAccount.Contains("(Liabilities)"))
                    {
                        // This needs to be registered as a Credit to the Libabilities
                        unrealizedPnl *= -1;
                    }

                    var fromToAccounts = new AccountUtils().GetAccounts(env, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", listOfTags, taxlot.Trade);

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
                            Event = Event.UNREALIZED_PNL,
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
                            Event = Event.UNREALIZED_PNL,
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
                                if (element.TradeDate != env.ValueDate)
                                {
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
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            // On Settlement Date we backout the Tax Lot for FORWARDS
            if (env.TaxLotStatus.ContainsKey(element.LpOrderId))
            {
                var taxlotStatus = env.TaxLotStatus[element.LpOrderId];

                var buyTrade = env.FindTrade(taxlotStatus.OpenId);
                if (taxlotStatus.Quantity != 0)
                {
                    var taxlot = CommonRules.RelieveTaxLot(env, buyTrade, element, taxlotStatus.Quantity * -1, true);
                    taxlotStatus.Quantity = 0;
                    taxlotStatus.Status = "Closed";

                    var realizedPnl = taxlot.RealizedPnl;
                    // now we need to post this amount

                    var originalAccount = AccountUtils.GetDerivativeAccountType(realizedPnl);
                    if (originalAccount.Contains("(Liabilities)"))
                    {
                        // This needs to be registered as a Credit to the Libabilities
                        realizedPnl *= -1;
                    }

                    CommonRules.PostRealizedPnl(env, element, realizedPnl, originalAccount, "REALIZED GAIN/(LOSS)");
                }
            }
        }

        /// <summary>
        /// TradeCurrency == Base
        /// SettleCurrency == Risk
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element"></param>
        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            double fxrate = 1.0;

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
                var openLots = env.Methodology.GetOpenLots(env, element);

                if ( openLots.Count() == 0)
                {
                    var t1 = env.GenerateOpenTaxLot(element, fxrate);

                    // Whats going on here?
                    // We are skipping anything that does not get an OpenLot
                    env.AddMessage($"Created an Open Tax Lot for {element.Symbol}::{element.Side}");
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
                            Logger.Warn($"Unable to Find Tax Lot for {lot.Trade.Symbol}::{lot.Trade.Side}::{lot.Trade.Status}");
                            // TODO: For this open lot there should be a corresponding open to 
                            //Logger.Warn($"Unable to Find Tax Lot for {lot.Trade.Symbol}::{lot.Trade.Side}::{lot.Trade.Status}");
                            continue;
                        }

                        var taxlotStatus = env.TaxLotStatus[lot.Trade.LpOrderId];
                        if (taxlotStatus != null && taxlotStatus.Quantity != 0 && !taxlotStatus.Status.ToLowerInvariant().Equals("closed"))
                        {
                            // Does the open Lot fully fullfill the quantity ?
                            if (Math.Abs(taxlotStatus.Quantity) >= Math.Abs(workingQuantity))
                            {
                                var buyTrade = env.FindTrade(lot.Trade.LpOrderId);

                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, workingQuantity, true);

                                taxlotStatus.Quantity += workingQuantity;
                                if (taxlotStatus.Quantity == 0)
                                    taxlotStatus.Status = "Closed";
                                else
                                    taxlotStatus.Status = "Partially Closed";

                                var prevPrice = MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price;
                                var unrealizedPnl = taxlotStatus.Quantity * (element.SettleNetPrice - prevPrice) * fxrate;

                                CommonRules.PostUnRealizedPnl(
                                    env,
                                    buyTrade, 
                                    unrealizedPnl,
                                    MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price,
                                    element.SettleNetPrice, fxrate);

                                var PnL = Math.Abs(taxlot.Quantity) * (taxlot.CostBasis - taxlot.TradePrice) * fxrate;
                                CommonRules.PostRealizedPnl(
                                    env,
                                    buyTrade, 
                                    taxlot.RealizedPnl,
                                    taxlot.TradePrice,
                                    taxlot.CostBasis, fxrate);

                                var listOfFromTags = new List<Tag>
                                    {
                                        Tag.Find("SecurityType"),
                                        Tag.Find("CustodianCode")
                                    };

                                if (!element.IsDerivative())
                                {
                                    Logger.Error($"Should not be here");
                                    break;
                                }

                                var markToMarketAccount = "Mark to Market Derivatives Contracts at Fair Value (Assets)";
                                if (taxlot.RealizedPnl > 0 )
                                {
                                    markToMarketAccount = "Mark to Market Derivatives Contracts at Fair Value (Liabilities)";
                                }
                                var account = "Change in Unrealized Derivatives Contracts at Fair Value";

                                var fromAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(account)).FirstOrDefault(), listOfFromTags, element);
                                var toAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(markToMarketAccount)).FirstOrDefault(), listOfFromTags, element);

                                new AccountUtils().SaveAccountDetails(env, fromAccount);
                                new AccountUtils().SaveAccountDetails(env, toAccount);


                                // Now Generate Entries
                                var fromJournal = new Journal(element)
                                {
                                    Account = fromAccount,
                                    CreditDebit = env.DebitOrCredit(fromAccount, taxlot.RealizedPnl),
                                    Value = taxlot.RealizedPnl,

                                    When = env.ValueDate,
                                    StartPrice = taxlot.TradePrice,
                                    EndPrice = taxlot.CostBasis,
                                    FxRate = 1.0,
                                    Event = Event.REALIZED_PNL,
                                    Fund = env.GetFund(element),
                                };

                                var toJournal = new Journal(fromJournal)
                                {
                                    Account = toAccount,
                                    CreditDebit = env.DebitOrCredit(toAccount, taxlot.RealizedPnl),
                                    Value = taxlot.RealizedPnl * -1,
                                };

                                env.Journals.AddRange(new[] { fromJournal, toJournal });

                                break;
                            }
                            else
                            {
                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, taxlotStatus.Quantity * -1);

                                workingQuantity += taxlotStatus.Quantity;

                                CommonRules.PostRealizedPnl(env, element, taxlot.RealizedPnl, taxlot.TradePrice, taxlot.CostBasis,fxrate);

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
