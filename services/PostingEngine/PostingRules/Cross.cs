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

        private List<Tag> listOfTags = new List<Tag> {
            Tag.Find("SecurityType"),
            Tag.Find("CustodianCode")
        };

        private List<Tag> listOfTradeTags = new List<Tag> {
            Tag.Find("SecurityType"),
            Tag.Find("CustodianCode"),
            Tag.Find("TradeCurrency")
        };

        private AccountType atSettledCash;
        private AccountType unrealizedAccountType;
        private AccountType realizedAccountType;

        public Cross()
        {
            atSettledCash = AccountType.Find("Settled Cash");
            unrealizedAccountType = AccountType.Find("Change in Unrealized Derivatives Contracts at Fair Value");
            realizedAccountType = AccountType.Find("REALIZED GAIN/(LOSS)");
        }

        public bool IsValid(PostingEngineEnvironment env, Transaction element)
        {
            return element.IsDerivative() && element.SecurityType.ToLowerInvariant().Equals("cross");
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
                    var prevEodPrice = 0.0;
                    var eodPrice = 0.0;
                    var fxRate = 0.0;

                    if (element.TradeCurrency.Equals(env.BaseCurrency))
                    {
                        if (env.ValueDate == element.TradeDate)
                        {
                            prevEodPrice =  1 / element.SettleNetPrice;
                            fxRate = FxRates.Find(env.ValueDate, element.SettleCurrency).Rate;
                            eodPrice = fxRate;
                        }
                        else
                        {
                            prevEodPrice = FxRates.Find(env.PreviousValueDate, element.SettleCurrency).Rate;
                            fxRate = FxRates.Find(env.PreviousValueDate, element.SettleCurrency).Rate;
                            eodPrice = fxRate;
                        }
                    }
                    else
                    {
                        if (env.ValueDate == element.TradeDate)
                        {
                            prevEodPrice = element.SettleNetPrice;
                            fxRate = FxRates.Find(env.ValueDate, element.TradeCurrency).Rate;
                            eodPrice = fxRate;
                        }
                        else
                        {
                            prevEodPrice = FxRates.Find(env.PreviousValueDate, element.TradeCurrency).Rate;
                            fxRate = FxRates.Find(env.ValueDate, element.TradeCurrency).Rate;
                            eodPrice = fxRate;
                        }
                    }

                    var unrealizedPnl = 0.0;

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
                        Event = Event.DAILY_UNREALIZED_PNL,
                        Fund = fund,
                    };

                    var credit = new Journal(debit)
                    {
                        Account = fromToAccounts.To,
                        Value = env.SignedValue(fromToAccounts.From, fromToAccounts.To, true, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromToAccounts.To, unrealizedPnl),
                    };

                    env.Journals.AddRange(new[] { debit, credit });
                    /*
                    if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                    {
                        var fxJournals = FxPosting.CreateFx(
                            env,
                            "daily",
                            quantity, null, element);
                        env.Journals.AddRange(fxJournals);
                    }
                    */
                }
            }
            else
            {
                /*
                if (fxrate != 1.0)
                {
                    if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                    {
                        var fxJournals = FxPosting.CreateFx(
                            env,
                            "daily",
                            element.Quantity, null, element);
                        env.Journals.AddRange(fxJournals);
                    }
                }
                */
            }
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            if (env.TaxLotStatus.ContainsKey(element.LpOrderId))
            {
                var taxlot = env.TaxLotStatus[element.LpOrderId];

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

                var accountSell = new AccountUtils().CreateAccount(atSettledCash, listOfTradeTags, sell);
                var accountBuy = new AccountUtils().CreateAccount(atSettledCash, listOfTradeTags, buy);

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

                        Value = env.SignedValue(accountBuy, accountSell, true, buyValue),
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

                        Value = env.SignedValue(accountBuy, accountSell, true, sellValue),
                        CreditDebit = env.DebitOrCredit(accountSell, sell.Quantity),
                    };

                    env.Journals.AddRange(new[] { credit, debit });

                    var originalAccount = AccountUtils.GetDerivativeAccountType(realizedPnl);

                    // Realized Pnl to go along with the Settled Cash
                    CommonRules.GenerateJournalEntry(env, element, listOfTags, realizedAccountType, Event.REALIZED_PNL, realizedPnl);

                    CommonRules.GenerateJournalEntries(env, element, listOfTags, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", realizedPnl * -1);
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

                    // Realized Pnl to go along with the Settled Cash
                    CommonRules.GenerateJournalEntry(env, element, listOfTags, realizedAccountType, Event.REALIZED_PNL, realizedPnl);

                    CommonRules.GenerateJournalEntries(env, element, listOfTags, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", realizedPnl * -1);
                }

                if (taxlot.Quantity != 0)
                {
                    var buyTrade = env.FindTrade(taxlot.OpenId);
                    CommonRules.RelieveTaxLot(env, buyTrade, element, taxlot.Quantity * -1, true);
                    taxlot.Quantity = 0;
                    taxlot.Status = "Closed";

                    //Now we have Realized Pnl
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

            // For a CROSS We just create an open Tax Lot, no other activity occurs
            var t1 = env.GenerateOpenTaxLot(element, fxrate);

            Logger.Info($"Generated Open TaxLot {t1.Symbol}::{t1.Side}::{element.SecurityType}");
        }
    }
}
