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
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("SHORT POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);
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
        }

        public bool IsValid(PostingEngineEnvironment env, Transaction element)
        {
            return true;
        }
    }
}
