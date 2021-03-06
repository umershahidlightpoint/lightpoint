﻿using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace PostingEngine.PostingRules
{
    public class FakeJournals : IPostingRule
    {
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            return;
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            var accrual = env.FindAccruals(element.AccrualId);
            var allocations = env.FindAllocations(element.AccrualId);
            var allocation = allocations.Where(i => !i.Symbol.Equals(element.Symbol)).FirstOrDefault();

            if (element.Status.Equals("Cancelled"))
            {
                env.AddMessage($"Entry has been cancelled {element.LpOrderId} :: {element.Side}");
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
            var listOfFromTags = new List<Tag>
            {
                Tag.Find("CustodianCode"),
                Tag.Find("Symbol")
            };

            var listOfToTags = new List<Tag>
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
                        fromAccount = new AccountUtils().CreateAccount(AccountType.Find("Settled Cash"), listOfToTags, element);
                        toAccount = new AccountUtils().CreateAccount(AccountType.Find("DIVIDENDS RECEIVABLE"), listOfFromTags, element);
                    }
                    else // Default Action
                    {
                        fromAccount = new AccountUtils().CreateAccount(AccountType.Find("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )"), listOfToTags, element);
                        toAccount = new AccountUtils().CreateAccount(AccountType.Find("SHORT POSITIONS AT COST"), listOfFromTags, element);
                    }
                    break;
            }

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        private AccountToFrom GetFromToAccount(Transaction element)
        {
            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account
            var au = new AccountUtils();

            switch (element.Side.ToLowerInvariant())
            {
                case "debit":
                    {
                        if (element.Symbol.Equals("ZZ_INVESTOR_WITHDRAWALS"))
                        {
                            var fromTags = new List<Tag>
                            {
                                Tag.Find("CustodianCode")
                            };

                            var toTags = new List<Tag>
                            {
                                Tag.Find("CustodianCode")
                            };

                            fromAccount = au.CreateAccount(AccountType.Find("CONTRIBUTED CAPITAL"), fromTags, element);
                            toAccount = au.CreateAccount(AccountType.Find("Settled Cash"), toTags, element);
                        }
                        else if (element.Symbol.Equals("ZZ_CASH_DIVIDENDS"))
                        {
                            var fromTags = new List<Tag>
                            {
                                Tag.Find("CustodianCode")
                            };

                            var toTags = new List<Tag>
                            {
                                Tag.Find("CustodianCode")
                            };

                            fromAccount = au.CreateAccount(AccountType.Find("DIVIDENDS RECEIVABLE"), fromTags, element);
                            toAccount = au.CreateAccount(AccountType.Find("DIVIDEND INCOME"), toTags, element);
                        }
                        else
                        {
                            var symbol = element.Symbol;
                            symbol = _codeMap.ContainsKey(symbol) ? _codeMap[symbol] : symbol;

                            var paidAccount = AccountType.Find("Expenses Paid");
                            var payableAccount = AccountType.Find("ACCRUED EXPENSES");

                            fromAccount = new AccountUtils().CreateAccount(paidAccount, symbol, element);
                            toAccount = new AccountUtils().CreateAccount(payableAccount, symbol + " Payable", element);
                        }
                        break;
                    }
                case "credit":
                    // Contribution
                    if (element.Symbol.Equals("ZZ_INVESTOR_CONTRIBUTIONS"))
                    {
                        var fromTags = new List<Tag>
                        {
                            Tag.Find("CustodianCode")
                        };

                        var toTags = new List<Tag>
                        {
                            Tag.Find("CustodianCode")
                        };

                        fromAccount = new AccountUtils().CreateAccount(AccountType.Find("Settled Cash"), fromTags, element);
                        toAccount = new AccountUtils().CreateAccount(AccountType.Find("CONTRIBUTED CAPITAL"), toTags, element);
                    }
                    else if (element.Symbol.Equals("ZZ_CASH_DIVIDENDS"))
                    {
                        var fromTags = new List<Tag>
                        {
                            Tag.Find("CustodianCode")
                        };

                        var toTags = new List<Tag>
                        {
                            Tag.Find("CustodianCode")
                        };

                        fromAccount = new AccountUtils().CreateAccount(AccountType.Find("DIVIDENDS RECEIVABLE"), fromTags, element);
                        toAccount = new AccountUtils().CreateAccount(AccountType.Find("DIVIDEND INCOME"), toTags, element);
                    }
                    else // Default Action
                    {
                        var symbol = element.Symbol;
                        symbol = _codeMap.ContainsKey(symbol) ? _codeMap[symbol] : symbol;

                        var paidAccount = AccountType.Find("Expenses Paid");
                        var payableAccount = AccountType.Find("ACCRUED EXPENSES");

                        fromAccount = new AccountUtils().CreateAccount(paidAccount, symbol, element);
                        toAccount = new AccountUtils().CreateAccount(payableAccount, symbol + " Payable", element);
                    }
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
            var accrual = env.FindAccruals(element.AccrualId);
            var allocations = env.FindAllocations(element.AccrualId);
            var allocation = allocations.Where(i => !i.Symbol.Equals(element.Symbol)).FirstOrDefault();

            //Console.WriteLine(element.Symbol);

            if (element.Symbol.Equals("ZZ_INVESTOR_CONTRIBUTIONS"))
            {

            }

            if ( element.Status.Equals("Cancelled"))
            {
                env.AddMessage($"Entry has been cancelled {element.LpOrderId} :: {element.Side}");
                return;
            }

            // Need to consider both
            if ( element.TradeDate.Date != element.SettleDate.Date)
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

            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            var moneyUSD = element.LocalNetNotional * fxrate;

            if (element.LocalNetNotional != 0.0)
            {
                var symbol = allocation != null ? allocation.Symbol : element.ParentSymbol;
                var securityId = allocation != null ? allocation.SecurityId : element.SecurityId;

                if (symbol == null)
                    symbol = element.Symbol;

                var debit = new Journal(element)
                {
                    Symbol = symbol,
                    SecurityId = securityId,

                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                    Value = moneyUSD,
                    Event = Event.JOURNAL,
                    Fund = env.GetFund(element),
                };

                var credit = new Journal(element)
                {
                    Symbol = symbol,
                    SecurityId = securityId,

                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD),
                    Value = moneyUSD,
                    Event = Event.JOURNAL,
                    Fund = env.GetFund(element),
                };

                env.Journals.Add(debit);
                env.Journals.Add(credit);
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
                env.AddMessage($"trade does not tie back to a valid accrual {element.AccrualId}");
            }
            return validAccrual ;
        }

        internal static Dictionary<string, string> _codeMap = new Dictionary<string, string>() {
            { "ZZ_AUDIT_FEE", "Audit Fee" },
            { "ZZ_MANAGEMENT_FEES", "Management Fees" },
            { "ZZ_ACCOUNTING_FEES", "Acounting Fees" },
            { "ZZ_ADMINISTRATIVE_FEES", "Administritive Fees" },
            { "ZZ_CUSTODY_FEES", "Custody Fees" },
            { "ZZ_LEGAL_FEES", "Legal Fees" },
            { "ZZ_STOCK_BORROW_FEES", "Stock Borrow Fees" },
            { "ZZ_BANK_SERVICE_FEES", "Bank Service Fees" },
            { "ZZ_INVESTOR_CONTRIBUTIONS", "Investor Contributions" },
            { "ZZ_FINANCING_EXPENSE", "Finance Expense" },
            { "ZZ_DIRECTORS_FEE", "Directors Fees" },
            { "ZZ_DNO_INSURANCE", "DNO Insurance" },
            { "ZZ_TAX_FEE", "Tax Fees" },
            { "ZZ_AML_FEES", "AML Fees" },
            { "ZZ_ORGANIZATION_COSTS", "Organization Costs" },
            { "ZZ_OPERATING_FEE", "Operating Fees" },
            { "ZZ_RESEARCH_COSTS", "Research Costs" },
            { "ZZ_INSURANCE_FEES", "Insurance Fees" },
        };
    }
}






