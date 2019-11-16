using LP.Finance.Common.Models;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.PostingRules
{
    public class CashRule : IPostingRule
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
            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account

            var symbol = element.Symbol;
            symbol = FakeJournals._codeMap.ContainsKey(symbol) ? FakeJournals._codeMap[symbol] : symbol;


            var fromAccountType = AccountType.Find("ACCRUED EXPENSES");

            var toTags = new List<Tag>
                {
                    Tag.Find("CustodianCode")
                };

            switch (element.Side.ToLowerInvariant())
            {
                case "debit":
                    fromAccount = new AccountUtils().CreateAccount(fromAccountType, symbol + " Payable", element);
                    toAccount = new AccountUtils().CreateAccount(AccountType.Find("Settled Cash"), toTags, element);
                    break;
                case "credit":
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

            double fxrate = 1.0;

            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(env.EODFxRates[element.SettleCurrency].Rate);
            }

            var moneyUSD = element.LocalNetNotional * fxrate;

            var debit = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.From,
                Quantity = element.Quantity,
                When = env.ValueDate,
                FxCurrency = element.TradeCurrency,
                FxRate = fxrate,
                CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                Value = moneyUSD * -1,
                Event = "journal",
                Symbol = element.Symbol,
                Fund = element.Fund,
            };

            var credit = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.To,
                Quantity = element.Quantity,
                When = env.ValueDate,
                FxCurrency = element.TradeCurrency,
                FxRate = fxrate,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD),
                Value = moneyUSD * -1,
                Event = "journal",
                Symbol = element.Symbol,
                Fund = element.Fund,
            };

            env.Journals.Add(debit);
            env.Journals.Add(credit);

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
