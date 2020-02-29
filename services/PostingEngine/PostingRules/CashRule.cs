using LP.Finance.Common.Models;
using PostingEngine.Extensions;
using PostingEngine.MarketData;
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
            if ( element.TradeDate.Date.Equals(element.SettleDate.Date) && element.SecurityType.ToLowerInvariant().Equals("cash"))
            {
                CommonRules.GenerateSettlementDateJournals(env, element);
                return;
            }

            return;
        }

        AccountType _settledCash;
        AccountType _paidAccount;
        AccountType _payableAccount;

        private void SetupAccounts()
        {
            _settledCash = AccountType.Find("Settled Cash");
            _paidAccount = AccountType.Find("Expenses Paid");
            _payableAccount = AccountType.Find("ACCRUED EXPENSES");

        }

        private AccountToFrom GetFromToAccount(PostingEngineEnvironment env,Transaction element)
        {
            SetupAccounts();

            Account toAccount = null; // Crediting Account

            var symbol = element.Symbol;
            symbol = env.CodeMap(symbol);

            var toTags = new List<Tag>
                {
                    Tag.Find("CustodianCode")
                };

            var fromAccount = new AccountUtils().CreateAccount(_payableAccount, symbol + " Payable", element);

            switch (element.Side.ToLowerInvariant())
            {
                case "debit":
                    toAccount = new AccountUtils().CreateAccount(_settledCash, toTags, element);
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
            var accountToFrom = GetFromToAccount(env, element);

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
                fxrate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, element.SettleCurrency).Rate);
            }

            var moneyLocal = Math.Abs(element.LocalNetNotional);

            if ( element.IsDebit())
            {
                moneyLocal *= -1;
            }
            else
            {

            }

            var debit = new Journal (element)
            {
                Symbol = element.Symbol,
                Account = accountToFrom.From,
                When = env.ValueDate,
                FxRate = fxrate,
                CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyLocal),
                JournalValue = env.SignedValueWithFx(accountToFrom.From, accountToFrom.To, true, moneyLocal, fxrate),
                //Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, moneyLocal),
                Event = "prepaid-expense",
                Fund = env.GetFund(element),
            };

            var credit = new Journal(debit)
            {
                Account = accountToFrom.To,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyLocal),
                //Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, moneyLocal),
                JournalValue = env.SignedValueWithFx(accountToFrom.From, accountToFrom.To, true, moneyLocal, fxrate),
            };

            env.Journals.Add(debit);
            env.Journals.Add(credit);

        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            if (element.AccrualId == null)
            {
                // We have just cash here so what do we do ?
                CommonRules.GenerateTradeDateJournals(env, element);
                return;
            }

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
