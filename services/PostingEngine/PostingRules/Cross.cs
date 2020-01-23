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
    public class Cross : IPostingRule
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

                    var tradeCurrency = element.TradeCurrency;
                    var settleCurrency = element.SettleCurrency;
                    var allocations = env.FindTradeAllocations(element);

                    var buy = allocations.Where(i => i.SecurityType.Equals("SPOT") && i.Side.Equals("BUY")).FirstOrDefault();
                    var sell = allocations.Where(i => i.SecurityType.Equals("SPOT") && i.Side.Equals("SELL")).FirstOrDefault();

                    if (buy == null || sell == null)
                    {
                        Logger.Error($"Unable to process {element.SecurityType}::{element.LpOrderId}");
                        return;
                    }

                    var prevEodPrice = 0.0;
                    var eodPrice = 0.0;
                    var fxRate = 0.0;

                    if (element.TradeCurrency.Equals(env.BaseCurrency))
                    {
                        if (env.ValueDate == element.TradeDate)
                        {
                            prevEodPrice = element.SettleNetPrice;
                            fxRate = FxRates.Find(env.ValueDate, element.SettleCurrency).Rate;
                            eodPrice = 1 / fxRate;
                        }
                        else
                        {
                            prevEodPrice = FxRates.Find(env.PreviousValueDate, element.SettleCurrency).Rate;
                            fxRate = FxRates.Find(env.PreviousValueDate, element.SettleCurrency).Rate;
                            eodPrice = 1 / fxRate;
                        }
                    }
                    else
                    {
                        if (env.ValueDate == element.TradeDate)
                        {
                            prevEodPrice = element.SettleNetPrice;
                            fxRate = FxRates.Find(env.ValueDate, element.TradeCurrency).Rate;
                            eodPrice = FxRates.Find(env.ValueDate, element.TradeCurrency).Rate;
                        }
                        else
                        {
                            prevEodPrice = FxRates.Find(env.PreviousValueDate, element.TradeCurrency).Rate;
                            fxRate = FxRates.Find(env.ValueDate, element.TradeCurrency).Rate;
                            eodPrice = FxRates.Find(env.ValueDate, element.TradeCurrency).Rate;
                        }
                    }

                    var unrealizedPnl = 0.0;
                    var q1 = buy.Quantity;
                    var q2 = sell.Quantity;

                    var quantity = taxlot.Quantity;
                    var rateDiff = (eodPrice - prevEodPrice);

                    if ( element.SettleCurrency.Equals(env.BaseCurrency))
                    {
                        unrealizedPnl = (rateDiff * quantity);
                    } else {
                        unrealizedPnl = (rateDiff * quantity) * fxRate;
                    }
                        
                    var originalAccount = AccountUtils.GetDerivativeAccountType(unrealizedPnl);
                    var fromToAccounts = new AccountUtils().GetAccounts(env, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", listOfTags, taxlot.Trade);

                    var fund = env.GetFund(element);

                    var debit = new Journal(element)
                    {
                        Account = fromToAccounts.From,
                        When = env.ValueDate,
                        Symbol = taxlot.Symbol,
                        Quantity = quantity,
                        FxRate = rateDiff,
                        Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, false, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromToAccounts.From, unrealizedPnl),
                        StartPrice = prevEodPrice,
                        EndPrice = eodPrice,
                        Event = Event.UNREALIZED_PNL,
                        Fund = fund,
                    };

                    var credit = new Journal(debit)
                    {
                        Account = fromToAccounts.To,
                        Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, false, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromToAccounts.To, unrealizedPnl),
                    };

                    env.Journals.AddRange(new[] { debit, credit });

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
            // NO Need for Swaps and Futures / Forwards as we don't own the stock

            // On Settlement Date we backout the Tax Lot for FORWARDS
            if (env.TaxLotStatus.ContainsKey(element.LpOrderId))
            {
                var taxlot = env.TaxLotStatus[element.LpOrderId];

                if ( element.SecurityType.Equals("CROSS"))
                {
                    var tradeCurrency = element.TradeCurrency;
                    var settleCurrency = element.SettleCurrency;
                    var allocations = env.FindTradeAllocations(element);

                    var buy = allocations.Where(i => i.SecurityType.Equals("SPOT") && i.Side.Equals("BUY")).FirstOrDefault();
                    var sell = allocations.Where(i => i.SecurityType.Equals("SPOT") && i.Side.Equals("SELL")).FirstOrDefault();

                    if ( buy == null || sell == null)
                    {
                        Logger.Error($"Unable to process {element.SecurityType}::{element.LpOrderId}");
                        return;
                    }

                    var listOfTradeTags = new List<Tag> {
                        Tag.Find("SecurityType"),
                        Tag.Find("CustodianCode"),
                        Tag.Find("TradeCurrency")
                    };

                    var accountSell = new AccountUtils()
                        .CreateAccount(AccountType.All.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfTradeTags, sell);

                    var accountBuy = new AccountUtils()
                        .CreateAccount(AccountType.All.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfTradeTags, buy);

                    new AccountUtils().SaveAccountDetails(env, accountSell);
                    new AccountUtils().SaveAccountDetails(env, accountBuy);

                    var sellFx = FxRates.Find(env.ValueDate, sell.TradeCurrency);
                    var buyFx = FxRates.Find(env.ValueDate, buy.TradeCurrency);

                    var sellValue = sell.Quantity * sellFx.Rate;
                    var buyValue = buy.Quantity * buyFx.Rate;


                    if ( element.IsBuy() ) // BUY
                    {
                        var realizedPnl = buyValue + sellValue;

                        var debit = new Journal(accountBuy, Event.SETTLED_CASH, env.ValueDate)
                        {
                            Source = element.LpOrderId,
                            Fund = env.GetFund(element),
                            FxCurrency = element.TradeCurrency,
                            Symbol = element.Symbol,
                            SecurityId = element.SecurityId,
                            Quantity = Convert.ToDouble(buy.Quantity),

                            FxRate = buyFx.Rate,
                            StartPrice = 0,
                            EndPrice = 0,

                            Value = env.SignedValue(accountBuy, accountSell, true, buy.Quantity * buyFx.Rate),
                            CreditDebit = env.DebitOrCredit(accountBuy, buy.Quantity),
                        };

                        var credit = new Journal(accountSell, Event.SETTLED_CASH, env.ValueDate)
                        {
                            Source = element.LpOrderId,
                            Fund = env.GetFund(element),
                            FxCurrency = element.SettleCurrency,
                            Symbol = element.Symbol,
                            SecurityId = element.SecurityId,
                            Quantity = Convert.ToDouble(sell.Quantity),

                            FxRate = sellFx.Rate,
                            StartPrice = 0,
                            EndPrice = 0,

                            Value = env.SignedValue(accountBuy, accountSell, true, sell.Quantity * sellFx.Rate),
                            CreditDebit = env.DebitOrCredit(accountSell, sell.Quantity),
                        };

                        env.Journals.AddRange(new[] { credit, debit });

                        var originalAccount = AccountUtils.GetDerivativeAccountType(realizedPnl);
                        if (originalAccount.Contains("(Liabilities)"))
                        {
                            // This needs to be registered as a Credit to the Libabilities
                            realizedPnl *= -1;
                        }

                        CommonRules.PostRealizedPnl(env, element, realizedPnl, originalAccount, "REALIZED GAIN/(LOSS)");
                    }
                    else // SELL
                    {
                        var realizedPnl = buyValue + sellValue;

                        var debit = new Journal(accountBuy, Event.SETTLED_CASH, env.ValueDate)
                        {
                            Source = element.LpOrderId,
                            Fund = env.GetFund(element),
                            FxCurrency = element.TradeCurrency,
                            Symbol = element.Symbol,
                            SecurityId = element.SecurityId,
                            Quantity = Convert.ToDouble(buy.Quantity),

                            FxRate = buyFx.Rate,
                            StartPrice = 0,
                            EndPrice = 0,

                            Value = env.SignedValue(accountBuy, accountSell, true, buy.Quantity * buyFx.Rate),
                            CreditDebit = env.DebitOrCredit(accountBuy, buy.Quantity),
                        };

                        var credit = new Journal(accountSell, Event.SETTLED_CASH, env.ValueDate)
                        {
                            Source = element.LpOrderId,
                            Fund = env.GetFund(element),
                            FxCurrency = element.SettleCurrency,
                            Symbol = element.Symbol,
                            SecurityId = element.SecurityId,
                            Quantity = Convert.ToDouble(sell.Quantity),

                            FxRate = sellFx.Rate,
                            StartPrice = 0,
                            EndPrice = 0,

                            Value = env.SignedValue(accountBuy, accountSell, true, sell.Quantity * sellFx.Rate),
                            CreditDebit = env.DebitOrCredit(accountSell, sell.Quantity),
                        };

                        env.Journals.AddRange(new[] { credit, debit });

                        var originalAccount = AccountUtils.GetDerivativeAccountType(realizedPnl);
                        if (originalAccount.Contains("(Liabilities)"))
                        {
                            // This needs to be registered as a Credit to the Libabilities
                            realizedPnl *= -1;
                        }

                        CommonRules.PostRealizedPnl(env, element, realizedPnl, originalAccount, "REALIZED GAIN/(LOSS)");

                    }

                    // Now Generate the Flows

                    // TBD: Now need to create the flows for realized PNL

                    if (taxlot.Quantity != 0)
                    {
                        var buyTrade = env.FindTrade(taxlot.OpenId);
                        CommonRules.RelieveTaxLot(env, buyTrade, element, taxlot.Quantity * -1, true);
                        taxlot.Quantity = 0;
                        taxlot.Status = "Closed";
                    }
                }
                else
                {
                    var buyTrade = env.FindTrade(taxlot.OpenId);
                    if (taxlot.Quantity != 0)
                    {
                        CommonRules.RelieveTaxLot(env, buyTrade, element, taxlot.Quantity * -1, true);
                        taxlot.Quantity = 0;
                        taxlot.Status = "Closed";
                    }
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
