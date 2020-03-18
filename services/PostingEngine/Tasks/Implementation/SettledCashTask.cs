using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using LP.Finance.Common;
using LP.Finance.Common.Model;
using PostingEngine.MarketData;
using PostingEngine.Utilities;

namespace PostingEngine.Tasks.Implementation
{
    public class SettledCashTask : IPostingTask
    {
        public bool Run(PostingEngineEnvironment env)
        {
            //DeleteJournals("settled-cash-fx");

            var dates = "select minDate = min([when]), maxDate = max([when]) from Journal";
            DateTime valueDate;
            DateTime endDate;

            using (var connection = new SqlConnection(env.ConnectionString))
            {
                connection.Open();

                SetupEnvironment.Setup(connection);

                var table = new DataTable();

                // read the table structure from the database
                using (var adapter = new SqlDataAdapter(dates, env.ConnectionString))
                {
                    adapter.Fill(table);
                };

                valueDate = Convert.ToDateTime(table.Rows[0]["minDate"]);
                endDate = Convert.ToDateTime(table.Rows[0]["maxDate"]);
            }

            env.CallBack?.Invoke("SettledCash Calculation Started");

            var rowsCompleted = 1;
            var numberOfDays = (endDate - valueDate).Days;

            var con = new SqlConnection(env.ConnectionString);
            con.Open();

            while (valueDate <= endDate)
                {
                    if (!valueDate.IsBusinessDate())
                    {
                        valueDate = valueDate.AddDays(1);
                        rowsCompleted++;
                        continue;
                    }

                    env.ValueDate = valueDate;
                    env.PreviousValueDate = valueDate.PrevBusinessDate();

                    try
                    {
                        var command = new SqlCommand("settledCash", con);
                        //command.Transaction = transaction;
                        command.CommandType = CommandType.StoredProcedure;
                        command.Parameters.AddRange(new SqlParameter[] {
                            new SqlParameter("busDate", valueDate),
                        });

                        var table = new DataTable();
                        using (var adapter = new SqlDataAdapter(command))
                        {
                            adapter.Fill(table);
                        };

                        for(var i =0; i<table.Rows.Count; i++)
                        {
                            var offset = 0;

                            var settledCash = new
                            {
                                Symbol = Convert.ToString(table.Rows[i][offset++]),
                                Currency = Convert.ToString(table.Rows[i][offset++]),
                                Source = Convert.ToString(table.Rows[i][offset++]),
                                Fund = Convert.ToString(table.Rows[i][offset++]),
                                Balance = Convert.ToDecimal(table.Rows[i][offset++]),
                                SecurityId = Convert.ToInt32(table.Rows[i][offset++]),
                            };

                            if (settledCash.Currency.Equals(env.BaseCurrency))
                                continue;

                            var prevFx = Convert.ToDouble(FxRates.Find(env, env.PreviousValueDate, settledCash.Currency).Rate);
                            var eodFx = Convert.ToDouble(FxRates.Find(env, env.ValueDate, settledCash.Currency).Rate);

                            var local = Convert.ToDouble(settledCash.Balance);

                            var changeDelta = eodFx - prevFx;
                            var change = changeDelta * local * -1;

                            var symbol = $"@CASH{settledCash.Currency}";
                            var security = env.Trades?.Where(j => j.Symbol.Equals(symbol)).FirstOrDefault();
                            var securityId = security != null ? security.SecurityId : -1;

                            var fromTo = new AccountUtils().GetAccounts(env, "Settled Cash", "fx gain or loss on settled balance", new string[] { settledCash.Currency }.ToList());

                            var debit = new Journal(fromTo.From, "settled-cash-fx", valueDate)
                            {
                                Source = symbol,
                                Fund = settledCash.Fund,
                                Quantity = local,

                                FxCurrency = settledCash.Currency,
                                Symbol = symbol,
                                SecurityId = securityId,
                                FxRate = changeDelta,
                                StartPrice = prevFx,
                                EndPrice = eodFx,

                                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, change),
                                CreditDebit = env.DebitOrCredit(fromTo.From, change),
                            };

                            var credit = new Journal(debit)
                            {
                                Account = fromTo.To,
                                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, change),
                                CreditDebit = env.DebitOrCredit(fromTo.To, change),
                            };

                            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
                        }
                    }
                    catch (Exception ex)
                    {
                        env.CallBack?.Invoke($"Exception on {valueDate.ToString("MM-dd-yyyy")}, {ex.Message}");
                    }

                    env.CallBack?.Invoke($"Completed SettledCashBalances for {valueDate.ToString("MM-dd-yyyy")}", numberOfDays, rowsCompleted++);
                    valueDate = valueDate.AddDays(1);
                }

                // Now lets save the journals
                if (env.Journals.Count() > 0)
                {
                    env.CollectData(env.Journals);
                }

            return true;
        }
    }
}
