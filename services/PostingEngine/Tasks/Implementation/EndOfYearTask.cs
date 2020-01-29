using LP.Finance.Common.Models;
using PostingEngine.PostingRules.Utilities;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.Tasks
{
    /// <summary>
    /// Grab all of the Items to create contra journal entries for each of the line items
    /// </summary>
    public class EndOfYearTask : IPostingTask
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

                var balance = Convert.ToDouble(yearEndResult.Debit - yearEndResult.Credit);

                var accountType = $"[{yearEndResult.AccountCategory}]{yearEndResult.AccountType}";

                if (AccountType.Find(AccountCategory.AC_EQUITY, accountType, false) == null)
                {
                    // Need to create the Account Type
                    var createdAccountType = AccountType.FindOrCreate(AccountCategory.AC_EQUITY, accountType);
                    new AccountUtils().Save(env, createdAccountType);
                    //createdAccountType.Save(env.ConnectionString);
                }

                var debitAccount = new AccountUtils().GetAccount(env, yearEndResult.AccountType, new string[] { env.BaseCurrency }.ToList());

                var creditAccount = new AccountUtils().GetAccount(env, accountType, new string[] { env.BaseCurrency }.ToList());

                var debit = new Journal(debitAccount, "year-end", valueDate)
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

                    Value = yearEndResult.AccountCategory.Equals("Expenses") ? balance * -1 : balance,
                    CreditDebit = env.DebitOrCredit(debitAccount, balance),
                };

                var credit = new Journal(creditAccount, "year-end", valueDate)
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

                journals.AddRange(new List<Journal>(new[] { credit, debit }));
            }

            if (journals.Count() > 0)
            {
                env.CollectData(journals);
                journals.Clear();
            }

            return true;
        }
    }
}
