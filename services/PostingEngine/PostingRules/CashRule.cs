﻿using LP.Finance.Common.Models;
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

        private AccountToFrom GetFromToAccount(Transaction element)
        {
            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account

            var symbol = element.Symbol;
            symbol = FakeJournals._codeMap.ContainsKey(symbol) ? FakeJournals._codeMap[symbol] : symbol;


            var fromAccountType = AccountType.Find("PREPAID EXPENSES");

            var toTags = new List<Tag>
                {
                    Tag.Find("CustodianCode")
                };

            switch (element.Side.ToLowerInvariant())
            {
                case "debit":
                    fromAccount = new AccountUtils().CreateAccount(AccountType.Find("Settled Cash"), toTags, element);
                    toAccount = new AccountUtils().CreateAccount(fromAccountType, symbol + " Paid", element);
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
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            var moneyUSD = element.LocalNetNotional * fxrate;

            var debit = new Journal (element)
            {
                Account = accountToFrom.From,
                When = env.ValueDate,
                FxRate = fxrate,
                CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, moneyUSD),
                Event = "prepaid-expense",
                Fund = env.GetFund(element),
            };

            var credit = new Journal(element)
            {
                Account = accountToFrom.To,
                When = env.ValueDate,
                FxRate = fxrate,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, moneyUSD),
                Event = "prepaid-expense",
                Fund = env.GetFund(element),
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
