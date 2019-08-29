using LP.Finance.Common.Models;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.PostingRules
{
    public class FakeJournals : IPostingRule
    {
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }

        private AccountToFrom GetFromToAccount(Transaction element)
        {
            var type = element.GetType();
            var accountTypes = AccountType.All;

            var listOfFromTags = new List<Tag>
            {
                Tag.Find("Symbol")
            };

            var listOfToTags = new List<Tag>
            {
                Tag.Find("Symbol")
            };

            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account

            switch (element.Side.ToLowerInvariant())
            {
                case "debit":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("Expenses Paid")).FirstOrDefault(), listOfToTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("ACCRUED EXPENSES")).FirstOrDefault(), listOfFromTags, element);
                    break;
                case "credit":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("SHORT POSITIONS-COST")).FirstOrDefault(), listOfFromTags, element);
                    break;
            }

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            if ( element.Status.Equals("Cancelled"))
            {
                env.AddMessage($"Entry has been cancelled {element.LpOrderId} :: {element.Side}");
                return;
            }

            if ( element.TradeDate != element.SettleDate)
            {
                env.AddMessage($"Journal needs to be checked {element.LpOrderId}, {element.TradeDate}, {element.SettleDate}");
                return;
            }

            var accountToFrom = GetFromToAccount(element);

            if (accountToFrom.To == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            double fxrate = 1.0;

            if (!element.SettleCurrency.Equals("USD"))
            {
                fxrate = Convert.ToDouble(env.FxRates[element.TradeCurrency].Rate);
            }

            var moneyUSD = element.LocalNetNotional / fxrate;

            if (element.LocalNetNotional != 0.0)
            {
                var debit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    FxCurrency = element.TradeCurrency,
                    FxRate = fxrate,
                    Value = moneyUSD * -1,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                var credit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    FxCurrency = element.TradeCurrency,
                    FxRate = fxrate,
                    Value = moneyUSD,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                env.Journals.Add(debit);
                env.Journals.Add(credit);

                //new Journal[] { debit }.Save(env);
            }

            return;
        }
    }
}
