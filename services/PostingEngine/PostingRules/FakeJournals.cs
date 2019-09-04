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
                    {
                        var symbol = element.Symbol;
                        symbol = this._codeMap.ContainsKey(symbol) ? _codeMap[symbol] : symbol;

                        var paidAccount = accountTypes.Where(i => i.Name.Equals("Expenses Paid")).FirstOrDefault();
                        var payableAccount = accountTypes.Where(i => i.Name.Equals("ACCRUED EXPENSES")).FirstOrDefault();

                        fromAccount = new AccountUtils().CreateAccount(paidAccount, symbol + " Paid", element);
                        toAccount = new AccountUtils().CreateAccount(payableAccount, symbol + " Payable", element);

                        break;
                    }
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

        public bool IsValid(PostingEngineEnvironment env, Transaction element)
        {
            return env.IsValidAccrual(element.AccrualId);
        }

        private Dictionary<string, string> _codeMap = new Dictionary<string, string>() {
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






