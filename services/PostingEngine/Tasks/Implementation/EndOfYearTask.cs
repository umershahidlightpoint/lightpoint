using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using LP.Finance.Common;
using LP.Finance.Common.Model;
using PostingEngine.Utilities;

namespace PostingEngine.Tasks.Implementation
{
    /// <summary>
    /// Grab all of the Items to create contra journal entries for each of the line items
    /// </summary>
    class EndOfYearTask : IPostingTask
    {
        public bool Run(PostingEngineEnvironment env)
        {
            var sqlHelper = new SqlHelper(env.ConnectionString);

            var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("@year", env.ValueDate.Year - 1),
                };

            var journals = new List<Journal>();

            var dataTable = sqlHelper.GetDataTables("EndOfYear", CommandType.StoredProcedure, sqlParams);

            var valueDate = env.ValueDate;
            var prevValueDate = env.PreviousValueDate;

            foreach (DataRow row in dataTable[0].Rows)
            {
                int offset = 0;
                var yearEndResult = new
                {
                    AccountCategory = Convert.ToString(row[offset++]),
                    AccountType = Convert.ToString(row[offset++]),
                    Fund = Convert.ToString(row[offset++]),
                    Debit = Convert.ToDecimal(row[offset++]),
                    Credit = Convert.ToDecimal(row[offset++]),
                };

                var credit = Convert.ToDouble(yearEndResult.Credit);
                var debit = Convert.ToDouble(yearEndResult.Debit);

                var balance = Convert.ToDouble(yearEndResult.Debit - yearEndResult.Credit);

                var netIncomePrev = $"Retained Earnings {(valueDate.Year - 1)}";
                var netIncomeCurrent = $"Net Income Current Year";

                if (AccountType.Find(AccountCategory.AC_EQUITY, netIncomePrev, false) == null)
                {
                    // Need to create the Account Type
                    var createdAccountType = AccountType.FindOrCreate(AccountCategory.AC_EQUITY, netIncomePrev);
                    new AccountUtils().Save(env, createdAccountType);
                }

                if (AccountType.Find(AccountCategory.AC_EQUITY, netIncomeCurrent, false) == null)
                {
                    // Need to create the Account Type
                    var createdAccountType = AccountType.FindOrCreate(AccountCategory.AC_EQUITY, netIncomeCurrent);
                    new AccountUtils().Save(env, createdAccountType);
                }

                var accountName = $"[{yearEndResult.AccountCategory}]{yearEndResult.AccountType}";

                journals.AddRange(ReverseCredit(env, valueDate, yearEndResult, yearEndResult.AccountType, netIncomePrev, accountName, credit));
                journals.AddRange(ReverseDebit(env, valueDate, yearEndResult, yearEndResult.AccountType, netIncomePrev, accountName, debit));
            }

            if (journals.Count() > 0)
            {
                env.CollectData(journals);
                journals.Clear();
            }

            return true;
        }

        private IEnumerable<Journal> ReverseCredit(PostingEngineEnvironment env, DateTime valueDate, dynamic yearEndResult, string fromAccount, string toAccount, string accountName, double balance)
        {
            var debitAccount = new AccountUtils().CreateAccount(fromAccount, accountName);
            var creditAccount = new AccountUtils().CreateAccount(toAccount, accountName);

            new AccountUtils().SaveAccountDetails(env, debitAccount);
            new AccountUtils().SaveAccountDetails(env, creditAccount);

            if ( yearEndResult.AccountCategory.Equals("Expenses"))
            {
                balance *= -1;
            }

            var debitJournal = new Journal(debitAccount, Event.YEAR_END, valueDate)
            {
                Source = "year-closeout",
                Fund = yearEndResult.Fund,
                Quantity = balance,

                FxCurrency = env.BaseCurrency,
                Symbol = env.BaseCurrency,
                SecurityId = -1,
                FxRate = 0,
                StartPrice = 0,
                EndPrice = 0,

                Value = balance * -1,
                CreditDebit = env.DebitOrCredit(debitAccount, balance),
            };

            var creditJournal = new Journal(creditAccount, Event.YEAR_END, valueDate)
            {
                Source = "year-closeout",
                Fund = yearEndResult.Fund,
                Quantity = balance,

                FxCurrency = env.BaseCurrency,
                Symbol = env.BaseCurrency,
                SecurityId = -1,
                FxRate = 0,
                StartPrice = 0,
                EndPrice = 0,

                Value = balance,
                CreditDebit = env.DebitOrCredit(creditAccount, balance),
            };

            return new Journal[] { creditJournal, debitJournal };
        }

        private IEnumerable<Journal> ReverseDebit(PostingEngineEnvironment env, DateTime valueDate, dynamic yearEndResult, string fromAccount, string toAccount, string accountName, double balance)
        {
            var debitAccount = new AccountUtils().CreateAccount(fromAccount, accountName);
            var creditAccount = new AccountUtils().CreateAccount(toAccount, accountName);

            new AccountUtils().SaveAccountDetails(env, debitAccount);
            new AccountUtils().SaveAccountDetails(env, creditAccount);

            if (yearEndResult.AccountCategory.Equals("Expenses"))
            {
                balance *= -1;
            }

            var debitJournal = new Journal(debitAccount, Event.YEAR_END, valueDate)
            {
                Source = "year-closeout",
                Fund = yearEndResult.Fund,
                Quantity = balance,

                FxCurrency = env.BaseCurrency,
                Symbol = env.BaseCurrency,
                SecurityId = -1,
                FxRate = 0,
                StartPrice = 0,
                EndPrice = 0,

                Value = balance,
                CreditDebit = env.DebitOrCredit(debitAccount, balance),
            };

            var creditJournal = new Journal(creditAccount, Event.YEAR_END, valueDate)
            {
                Source = "year-closeout",
                Fund = yearEndResult.Fund,
                Quantity = balance,

                FxCurrency = env.BaseCurrency,
                Symbol = env.BaseCurrency,
                SecurityId = -1,
                FxRate = 0,
                StartPrice = 0,
                EndPrice = 0,

                Value = balance * -1,
                CreditDebit = env.DebitOrCredit(creditAccount, balance),
            };

            return new Journal[] { creditJournal, debitJournal };
        }

    }
}
