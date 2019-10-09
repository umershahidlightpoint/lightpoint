using LP.Finance.Common.Models;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.PostingRules
{
    public class Cash : IPostingRule
    {
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            return;
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            // Entry has already been processed
            if ( element.TradeDate.Date.Equals(element.SettleDate.Date))
            {
                return;
            }

            throw new NotImplementedException();
        }

        private AccountToFrom GetFromToAccount(Transaction element)
        {
            var type = element.GetType();
            var accountTypes = AccountType.All;

            var listOfFromTags = new List<Tag> {
             };

            var listOfToTags = new List<Tag>
            {
            };

            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account

            switch (element.Side.ToLowerInvariant())
            {
                case "debit":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("LONG POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, element);
                    break;
                case "credit":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("SHORT POSITIONS-COST")).FirstOrDefault(), listOfFromTags, element);
                    break;
                default:
                    break;
            }

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        private void AccrualPayment(PostingEngineEnvironment env, Transaction element, Accrual accrual)
        {
            var tradeAllocations = env.Allocations.Where(i => i.LpOrderId == element.LpOrderId).ToList();

            var accountToFrom = GetFromToAccount(element);

            if (accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            var accrual = env.Accruals.ContainsKey(element.AccrualId) ? env.Accruals[element.AccrualId] : null;

            if ( accrual != null )
            {
                AccrualPayment(env, element, accrual);
                return;
            }

            return;

            var accountToFrom = GetFromToAccount(element);

            if (accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if ( !element.TradeCurrency.Equals("USD"))
            {
                fxrate = Convert.ToDouble(env.FxRates[element.TradeCurrency].Rate);
            }

            if (element.Quantity != 0.0)
            {
                var moneyUSD = ((element.Quantity * element.TradePrice) / fxrate);
                var creditAmount = moneyUSD;
                var debitAmount = moneyUSD * -1;

                var debitJournal = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    Value = debitAmount,
                    Quantity = element.Quantity,
                    FxCurrency = element.TradeCurrency,
                    FxRate = fxrate,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                var creditJournal = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    FxCurrency = element.TradeCurrency,
                    FxRate = fxrate,
                    Value = creditAmount,
                    Quantity = element.Quantity,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                new Journal[] { debitJournal, creditJournal }.Save(env);
            }
        }

        public bool IsValid(PostingEngineEnvironment env, Transaction element)
        {
            return true;
        }
    }
}
