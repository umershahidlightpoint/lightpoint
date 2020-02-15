using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.Extensions;
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
            return element.IsDerivative() && element.SecurityType.ToLowerInvariant().Equals("forward");
        }

        private AccountType atSettledCash;
        private AccountType unrealizedAccountType;
        private AccountType realizedAccountType;

        private List<Tag> listOfTags = new List<Tag> {
            Tag.Find("SecurityType"),
            Tag.Find("CustodianCode")
        };

        public Forward()
        {
            atSettledCash = AccountType.Find("Settled Cash");
            unrealizedAccountType = AccountType.Find("Change in Unrealized Derivatives Contracts at Fair Value");
            realizedAccountType = AccountType.Find("REALIZED GAIN/(LOSS)");
        }

        /// <summary>
        /// Run for each day that the Tax Lot remains open / partially closed
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element">Trade we aee interested in</param>
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            var split = element.Symbol.Split(new char[] { '/', ' ' });
            var baseCurrency = split[0];
            var riskCurrency = split[1];

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

                    var eodPrice = MarketPrices.GetPrice(env, env.ValueDate, element).Price;
                    var prevEodPrice = MarketPrices.GetPrice(env, env.PreviousValueDate, element).Price;

                    if (env.ValueDate == element.TradeDate)
                    {
                        prevEodPrice = element.SettleNetPrice;
                    }

                    // we need to do this when there is no price for the trade from market data
                    if ( prevEodPrice == 0.0 )
                    {
                        prevEodPrice = element.SettleNetPrice;
                    }

                    if ( eodPrice == 0.0 )
                    {
                        eodPrice = element.SettleNetPrice;
                    }

                    // We have an open / partially closed tax lot so now need to calculate unrealized Pnl
                    var quantity = taxlot.Quantity;

                    var rateDiff = (eodPrice - prevEodPrice);

                    var unrealizedPnl = (rateDiff * quantity);

                    if (baseCurrency.Equals(env.BaseCurrency))
                    {
                        unrealizedPnl = unrealizedPnl / eodPrice;
                    }

                    var originalAccount = AccountUtils.GetDerivativeAccountType(unrealizedPnl);
                    var fromToAccounts = new AccountUtils().GetAccounts(env, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", listOfTags, taxlot.Trade);

                    var fund = env.GetFund(element);

                    var debit = new Journal(element)
                    {
                        FxCurrency = riskCurrency,
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

                    var fxChange = new FxPosting().CreateFxUnsettled(env, element);

                    /*
                    if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                    {
                        var fxJournals = FxPosting.CreateFx(
                            env,
                            "daily",
                            quantity, null, element);
                        if ( fxJournals.Count() > 0)
                            env.Journals.AddRange(fxJournals);
                    }
                    */
                }
            }
            else
            {
                /*
                if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                {
                    var fxJournals = FxPosting.CreateFx(
                        env,
                        "daily",
                        element.Quantity, null, element);
                    if (fxJournals.Count() > 0)
                        env.Journals.AddRange(fxJournals);
                }
                */
            }
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            // On Settlement Date we backout the Tax Lot for FORWARDS
            if (env.TaxLotStatus.ContainsKey(element.LpOrderId))
            {
                var taxlotStatus = env.TaxLotStatus[element.LpOrderId];

                var split = element.Symbol.Split(new char[] { '/', ' ' });
                var baseCurrency = split[0];
                var riskCurrency = split[1];

                var accountBuy = new AccountUtils().CreateAccount(atSettledCash, new List<string> { element.SecurityType, element.CustodianCode, baseCurrency });
                var accountSell = new AccountUtils().CreateAccount(atSettledCash, new List<string> { element.SecurityType, element.CustodianCode, riskCurrency });

                new AccountUtils().SaveAccountDetails(env, accountBuy);
                new AccountUtils().SaveAccountDetails(env, accountSell);

                var fxCurrency = riskCurrency;
                var tradePrice = taxlotStatus.TradePrice;
                var baseQuantity = element.Quantity;

                var eodPrice = MarketPrices.GetPrice(env, env.ValueDate, element).Price;
                var fxRate = FxRates.Find(env, env.ValueDate, fxCurrency).Rate;

                var buyValue = baseQuantity * tradePrice * fxRate;
                var sellValue = baseQuantity * eodPrice * fxRate;

                if (element.IsBuy()) // BUY
                {
                    var realizedPnl = sellValue - buyValue;

                    var debit = new Journal(accountBuy, Event.SETTLED_CASH, env.ValueDate)
                    {
                        Source = element.LpOrderId,
                        Fund = env.GetFund(element),
                        FxCurrency = baseCurrency,
                        Symbol = element.Symbol,
                        SecurityId = element.SecurityId,
                        Quantity = Convert.ToDouble(element.Quantity),

                        FxRate = fxRate,
                        StartPrice = tradePrice,
                        EndPrice = eodPrice,

                        Value = env.SignedValue(accountBuy, accountSell, true, sellValue),
                        CreditDebit = env.DebitOrCredit(accountBuy, sellValue),
                    };

                    var credit = new Journal(accountSell, Event.SETTLED_CASH, env.ValueDate)
                    {
                        Source = element.LpOrderId,
                        Fund = env.GetFund(element),
                        FxCurrency = riskCurrency,
                        Symbol = element.Symbol,
                        SecurityId = element.SecurityId,
                        Quantity = Convert.ToDouble(element.Quantity),

                        FxRate = fxRate,
                        StartPrice = tradePrice,
                        EndPrice = eodPrice,

                        Value = env.SignedValue(accountBuy, accountSell, true, buyValue * -1),
                        CreditDebit = env.DebitOrCredit(accountSell, buyValue * -1),
                    };

                    env.Journals.AddRange(new[] { credit, debit });

                    var originalAccount = AccountUtils.GetDerivativeAccountType(realizedPnl);

                    // Realized Pnl to go along with the Settled Cash
                    CommonRules.GenerateJournalEntry(env, element, listOfTags, realizedAccountType, Event.REALIZED_PNL, realizedPnl);

                    if (originalAccount.Contains("(Liabilities)"))
                    {
                        CommonRules.GenerateJournalEntries(env, element, listOfTags, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", realizedPnl);
                    }
                    else
                    {
                        CommonRules.GenerateJournalEntries(env, element, listOfTags, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", realizedPnl * -1);
                    }

                    
                }
                else // SELL
                {
                    var realizedPnl = sellValue - buyValue;

                    var debit = new Journal(accountSell, Event.SETTLED_CASH, env.ValueDate)
                    {
                        Source = element.LpOrderId,
                        Fund = env.GetFund(element),
                        FxCurrency = baseCurrency,
                        Symbol = element.Symbol,
                        SecurityId = element.SecurityId,
                        Quantity = Convert.ToDouble(element.Quantity),

                        FxRate = fxRate,
                        StartPrice = tradePrice,
                        EndPrice = eodPrice,

                        Value = env.SignedValue(accountSell, accountBuy, true, sellValue),
                        CreditDebit = env.DebitOrCredit(accountSell, sellValue),
                    };

                    var credit = new Journal(accountBuy, Event.SETTLED_CASH, env.ValueDate)
                    {
                        Source = element.LpOrderId,
                        Fund = env.GetFund(element),
                        FxCurrency = riskCurrency,
                        Symbol = element.Symbol,
                        SecurityId = element.SecurityId,
                        Quantity = Convert.ToDouble(element.Quantity),

                        FxRate = fxRate,
                        StartPrice = tradePrice,
                        EndPrice = eodPrice,

                        Value = env.SignedValue(accountSell, accountBuy, true, buyValue * -1),
                        CreditDebit = env.DebitOrCredit(accountSell, buyValue * -1),
                    };

                    env.Journals.AddRange(new[] { credit, debit });

                    var originalAccount = AccountUtils.GetDerivativeAccountType(realizedPnl);

                    // Realized Pnl to go along with the Settled Cash
                    CommonRules.GenerateJournalEntry(env, element, listOfTags, realizedAccountType, Event.REALIZED_PNL, realizedPnl);

                    if (originalAccount.Contains("(Liabilities)"))
                    {
                        CommonRules.GenerateJournalEntries(env, element, listOfTags, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", realizedPnl);
                    }
                    else
                    {
                        CommonRules.GenerateJournalEntries(env, element, listOfTags, originalAccount, "Change in Unrealized Derivatives Contracts at Fair Value", realizedPnl * -1);
                    }
                }

                if (taxlotStatus.Quantity != 0)
                {
                    var buyTrade = env.FindTrade(taxlotStatus.OpenId);
                    var taxlot = CommonRules.RelieveTaxLot(env, buyTrade, element, taxlotStatus.Quantity * -1, true);
                    taxlotStatus.Quantity = 0;
                    taxlotStatus.Status = "Closed";
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
                fxrate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, element.SettleCurrency).Rate);
            }

            var t1 = env.GenerateOpenTaxLotStatus(element, fxrate);
            Logger.Info($"Generated Open TaxLot {t1.Symbol}::{t1.Side}::{element.SecurityType}");
        }
    }
}
