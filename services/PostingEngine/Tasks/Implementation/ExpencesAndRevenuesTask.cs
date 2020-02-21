using LP.Finance.Common;
using LP.Finance.Common.Models;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace PostingEngine.Tasks
{
    public class ExpencesAndRevenuesTask : IPostingTask
    {
        public bool Run(PostingEngineEnvironment env)
        {
            var dates = "select minDate = min([when]), maxDate = max([when]) from vwJournal";

            env.CallBack?.Invoke("ExpencesAndRevenues Calculation Started");

            var table = new DataTable();

            // read the table structure from the database
            using (var adapter = new SqlDataAdapter(dates, new SqlConnection(env.ConnectionString)))
            {
                adapter.Fill(table);
                adapter.Dispose();
            };

            var valueDate = Convert.ToDateTime(table.Rows[0]["minDate"]);
            var endDate = Convert.ToDateTime(table.Rows[0]["maxDate"]);

            using (var cc = new SqlConnection(env.ConnectionString))
            {
                cc.Open();

                SetupEnvironment.Setup(cc);

                cc.Close();
            }

            var journals = new List<Journal>();

            var connection = new SqlConnection(env.ConnectionString);
            connection.Open();
            var transaction = connection.BeginTransaction();

            var sqlHelper = new SqlHelper(env.ConnectionString);

            var rowsCompleted = 1;
            var numberOfDays = (endDate - valueDate).Days;
            while (valueDate <= endDate)
            {
                if ( valueDate.Year == 2020)
                {

                }
                if (!valueDate.IsBusinessDate())
                {
                    valueDate = valueDate.AddDays(1);
                    rowsCompleted++;
                    continue;
                }

                try
                {
                    var sqlParams = new SqlParameter[]
                    {
                        new SqlParameter("@startDate", new DateTime(valueDate.Year, 1, 1)),
                        new SqlParameter("@businessDate", valueDate),
                        new SqlParameter("@prevbusinessDate", valueDate.PrevBusinessDate()),
                    };

                    var dataTable = sqlHelper.GetDataTables("DayOverDayIncome", CommandType.StoredProcedure, sqlParams.ToArray());

                    foreach (DataRow row in dataTable[0].Rows)
                    {
                        int offset = 0;
                        var expencesAndRevenues = new
                        {
                            Fund = Convert.ToString(row[offset++]),
                            Credit = Convert.ToDecimal(row[offset++]),
                            Debit = Convert.ToDecimal(row[offset++]),
                            Balance = Convert.ToDecimal(row[offset++]),
                        };

                        var accountType = $"Net Income Current Year";

                        if (AccountType.Find(AccountCategory.AC_EQUITY, accountType, false) == null)
                        {
                            // Need to create the Account Type
                            var createdAccountType = AccountType.FindOrCreate(AccountCategory.AC_EQUITY, accountType);
                            new AccountUtils().Save(env, createdAccountType);
                        }

                        var balance = Convert.ToDouble(expencesAndRevenues.Balance);

                        var account = new AccountUtils().GetAccount(env, accountType, new string[] { env.BaseCurrency }.ToList());

                        var debit = new Journal(account, "expences-revenues", valueDate)
                        {
                            Source = "calculated-data",
                            Fund = expencesAndRevenues.Fund,
                            Quantity = balance,

                            FxCurrency = env.BaseCurrency,
                            Symbol = env.BaseCurrency,
                            SecurityId = -1,
                            FxRate = 0,
                            StartPrice = 0,
                            EndPrice = 0,

                            // If this number is +ve then its actually a Debit and this is going into a Equity account which needs to be -ve and not +ve
                            Value = balance * -1,
                            CreditDebit = env.DebitOrCredit(account, balance * -1),
                        };

                        journals.AddRange(new List<Journal>(new[] { debit }));
                    }
                }
                catch (Exception ex)
                {
                    env.CallBack?.Invoke($"Exception on {valueDate.ToString("MM-dd-yyyy")}, {ex.Message}");
                }

                env.CallBack?.Invoke($"Completed ExpencesAndRevenues for {valueDate.ToString("MM-dd-yyyy")}", numberOfDays, rowsCompleted++);
                valueDate = valueDate.AddDays(1);
            }

            if (journals.Count() > 0)
            {
                env.CollectData(journals);
                journals.Clear();
            }

            transaction.Commit();
            connection.Close();

            return true;
        }
    }

}
