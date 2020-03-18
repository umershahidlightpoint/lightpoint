using LP.Finance.Common.Model;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using PostingEngine.Utilities;

namespace PostingEngine.PostingRules
{
    public class FakeJournals : IPostingRule
    {
        AccountType _settledCash;
        AccountType _paidAccount;
        AccountType _payableAccount;

        private void SetupAccounts()
        {
            _settledCash = AccountType.Find("Settled Cash");
            _paidAccount = AccountType.Find("Expenses Paid");
            _payableAccount = AccountType.Find("ACCRUED EXPENSES");

        }

        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            return;
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            SetupAccounts();

            var accrual = env.FindAccruals(element.AccrualId);
            var allocations = env.FindAllocations(element.AccrualId);
            var allocation = allocations.Where(i => !i.Symbol.Equals(element.Symbol)).FirstOrDefault();

            if (element.Status.Equals("Cancelled"))
            {
                env.AddMessage("Info", $"Entry has been cancelled {element.LpOrderId} :: {element.Side}");
                return;
            }

            // If they are the same we need to do nothing
            if (element.TradeDate.Date == element.SettleDate.Date)
            {
                //env.AddMessage($"Journal needs to be checked {element.LpOrderId}, {element.TradeDate}, {element.SettleDate}");
                return;
            }

            var accountToFrom = GetSettlementFromToAccount(element);

            if (accountToFrom.To == null)
            {
                env.AddMessage("Error", $"Settlement Date : Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            double fxrate = 1.0;

            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, element.SettleCurrency).Rate);
            }

            var moneyUSD = element.LocalNetNotional * fxrate;

            if (element.LocalNetNotional != 0.0)
            {
                var symbol = allocation != null ? allocation.Symbol : element.ParentSymbol;
                var securityId = allocation != null ? allocation.SecurityId : element.SecurityId;

                if (symbol == null)
                    symbol = element.Symbol;

                var debit = new Journal(accountToFrom.From, "journal", env.ValueDate)
                {
                    Symbol = symbol,
                    SecurityId = allocation != null ? allocation.SecurityId : element.SecurityId,

                    Source = element.LpOrderId,
                    Quantity = element.Quantity,
                    FxCurrency = element.SettleCurrency,
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                    Value = moneyUSD,
                    Fund = env.GetFund(element),
                };

                var credit = new Journal(accountToFrom.To, "journal", env.ValueDate)
                {
                    Symbol = symbol,
                    SecurityId = allocation != null ? allocation.SecurityId : element.SecurityId,

                    Source = element.LpOrderId,
                    Quantity = element.Quantity,
                    FxCurrency = element.SettleCurrency,
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD * -1),
                    Value = moneyUSD * -1,
                    Fund = env.GetFund(element),
                };

                env.Journals.Add(debit);
                env.Journals.Add(credit);
            }

            return;
        }

        private AccountToFrom GetSettlementFromToAccount(Transaction element)
        {
            var listOfTags = new List<Tag>
            {
                Tag.Find("CustodianCode"),
                Tag.Find("Symbol")
            };

            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account

            switch (element.Side.ToLowerInvariant())
            {
                case "credit":
                    // Contribution
                    if (element.Symbol.Equals("ZZ_CASH_DIVIDENDS"))
                    {
                        fromAccount = new AccountUtils().CreateAccount(_settledCash, listOfTags, element);
                        toAccount = new AccountUtils().CreateAccount(AccountType.Find("DIVIDENDS RECEIVABLE"), listOfTags, element);
                    }
                    else // Default Action
                    {
                        fromAccount = new AccountUtils().CreateAccount(AccountType.Find("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )"), listOfTags, element);
                        toAccount = new AccountUtils().CreateAccount(AccountType.Find("SHORT POSITIONS AT COST"), listOfTags, element);
                    }
                    break;
                case "debit":
                    break;

            }

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }


        private AccountToFrom GetFromToAccount(PostingEngineEnvironment env, Transaction element)
        {
            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account

            var au = new AccountUtils();

            var tags = new List<Tag>
                {
                    Tag.Find("CustodianCode")
                };

            switch (element.Side.ToLowerInvariant())
            {
                case "debit":
                    {
                        if (element.Symbol.Equals("ZZ_INVESTOR_WITHDRAWALS"))
                        {
                            fromAccount = au.CreateAccount(AccountType.Find("CONTRIBUTED CAPITAL"), tags, element);
                            toAccount = au.CreateAccount(_settledCash, tags, element);
                        }
                        else if (element.Symbol.Equals("ZZ_CASH_DIVIDENDS"))
                        {
                            fromAccount = au.CreateAccount(AccountType.Find("DIVIDENDS RECEIVABLE"), tags, element);
                            toAccount = au.CreateAccount(AccountType.Find("DIVIDEND INCOME"), tags, element);
                        }
                        else
                        {
                            var symbol = element.Symbol;
                            symbol = env.CodeMap(symbol);

                            fromAccount = new AccountUtils().CreateAccount(_paidAccount, symbol + " Paid", element);
                            toAccount = new AccountUtils().CreateAccount(_payableAccount, symbol + " Payable", element);
                        }
                        break;
                    }
                case "credit":
                    // Contribution
                    if (element.Symbol.Equals("ZZ_INVESTOR_CONTRIBUTIONS"))
                    {
                        fromAccount = new AccountUtils().CreateAccount(_settledCash, tags, element);
                        toAccount = new AccountUtils().CreateAccount(AccountType.Find("CONTRIBUTED CAPITAL"), tags, element);
                    }
                    else if (element.Symbol.Equals("ZZ_CASH_DIVIDENDS"))
                    {
                        fromAccount = new AccountUtils().CreateAccount(AccountType.Find("DIVIDENDS RECEIVABLE"), tags, element);
                        toAccount = new AccountUtils().CreateAccount(AccountType.Find("DIVIDEND INCOME"), tags, element);
                    }
                    else // Default Action
                    {
                        var symbol = env.CodeMap(element.Symbol);

                        fromAccount = new AccountUtils().CreateAccount(_paidAccount, symbol + " Paid", element);
                        toAccount = new AccountUtils().CreateAccount(_payableAccount, symbol + " Payable", element);
                    }
                    break;
            }

            new AccountUtils().SaveAccountDetails(env, fromAccount);
            new AccountUtils().SaveAccountDetails(env, toAccount);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            SetupAccounts();

            // Pre validation test
            if (element.Status.Equals("Cancelled"))
            {
                env.AddMessage("Warning", $"Entry has been cancelled {element.LpOrderId} :: {element.Side}");
                return;
            }

            // Need to consider both
            if (element.TradeDate.Date != element.SettleDate.Date)
            {
                env.AddMessage("Error", $"Journal needs to be checked {element.LpOrderId}::{element.TradeDate}::{element.SettleDate}");
                return;
            }

            var accrual = env.FindAccruals(element.AccrualId);
            var allocations = env.FindAllocations(element.AccrualId);
            var allocation = allocations.Where(i => !i.Symbol.Equals(element.Symbol)).FirstOrDefault();

            var accountToFrom = GetFromToAccount(env, element);

            if (accountToFrom.To == null)
            {
                env.AddMessage("Error", $"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            var fxrate = element.FxRate(env);

            var moneyUSD = element.LocalNetNotional * fxrate;

            if (moneyUSD != 0.0)
            {
                var symbol = allocation != null ? allocation.Symbol : element.ParentSymbol;
                var securityId = allocation != null ? allocation.SecurityId : element.SecurityId;

                if (String.IsNullOrEmpty(symbol))
                    symbol = element.Symbol;

                var debit = new Journal(element)
                {
                    Symbol = symbol,
                    SecurityId = securityId,

                    Account = accountToFrom.From,
                    CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                    Value = AccountCategory.SignedValue(accountToFrom.From, accountToFrom.To, true, moneyUSD),

                    When = env.ValueDate,
                    FxRate = fxrate,
                    Event = Event.JOURNAL,
                    Fund = env.GetFund(element),
                };

                var credit = new Journal(debit)
                {
                    Account = accountToFrom.To,
                    CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD),
                    Value = AccountCategory.SignedValue(accountToFrom.From, accountToFrom.To, false, moneyUSD),
                };

                env.Journals.AddRange(new[] { debit, credit });
            }

            return;
        }

        public bool IsValid(PostingEngineEnvironment env, Transaction element)
        {
            if (element.AccrualId == null)
                return true;

            var validAccrual = env.IsValidAccrual(element.AccrualId);

            if ( !validAccrual)
            {
                env.AddMessage("Error", $"trade does not tie back to a valid accrual {element.AccrualId}");
            }
            return validAccrual ;
        }
    }
}






