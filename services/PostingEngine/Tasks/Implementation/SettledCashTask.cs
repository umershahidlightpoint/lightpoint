﻿using LP.Finance.Common;
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
    public class SettledCashTask : IPostingTask
    {
        public bool Run(PostingEngineEnvironment env)
        {
            //DeleteJournals("settled-cash-fx");

            var dates = "select minDate = min([when]), maxDate = max([when]) from Journal";

            var sql = $@"select Symbol, fx_currency, source, fund, sum((credit- debit)/coalesce(fxrate,1)) as balance, security_id from vwJournal 
                        where AccountType = 'Settled Cash' and event = 'settlement'
                        and [when] < @busDate
                        and [event] not in ('journal')
						and fx_currency not in ('USD')
                        group by Symbol, fx_currency, source, fund, security_id";

            env.CallBack?.Invoke("SettledCash Calculation Started");

            using (var connection = new SqlConnection(env.ConnectionString))
            {
                connection.Open();

                SetupEnvironment.Setup(connection);

                var transaction = connection.BeginTransaction();

                var table = new DataTable();

                // read the table structure from the database
                using (var adapter = new SqlDataAdapter(dates, env.ConnectionString))
                {
                    adapter.Fill(table);
                };

                var valueDate = Convert.ToDateTime(table.Rows[0]["minDate"]);
                var endDate = Convert.ToDateTime(table.Rows[0]["maxDate"]);

                var rowsCompleted = 1;
                var numberOfDays = (endDate - valueDate).Days;
                while (valueDate <= endDate)
                {
                    if (!valueDate.IsBusinessDate())
                    {
                        valueDate = valueDate.AddDays(1);
                        continue;
                    }
                    env.ValueDate = valueDate;
                    env.PreviousValueDate = valueDate.PrevBusinessDate();

                    try
                    {
                        var sqlParams = new SqlParameter[]
                        {
                            new SqlParameter("busDate", valueDate),
                        };

                        var con = new SqlConnection(env.ConnectionString);
                        con.Open();
                        var command = new SqlCommand(sql, con);
                        //command.Transaction = transaction;
                        command.Parameters.AddRange(sqlParams);
                        var reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                        while (reader.Read())
                        {
                            var settledCash = new
                            {
                                Symbol = reader.GetFieldValue<string>(0),
                                Currency = reader.GetFieldValue<string>(1),
                                Source = reader.GetFieldValue<string>(2),
                                Fund = reader.GetFieldValue<string>(3),
                                Balance = reader.GetFieldValue<decimal>(4),
                                SecurityId = reader.GetFieldValue<int>(5),
                                //Quantity = reader.GetFieldValue <decimal>(6)
                            };

                            if (settledCash.Currency.Equals(env.BaseCurrency))
                                continue;

                            // Now Generate the correct set of entries

                            if (settledCash.Symbol.Equals("RBD"))
                            {

                            }

                            //if (settledCash.Quantity == 0)
                            //    continue;

                            var prevFx = Convert.ToDouble(FxRates.Find(env, env.PreviousValueDate, settledCash.Currency).Rate);
                            var eodFx = Convert.ToDouble(FxRates.Find(env, env.ValueDate, settledCash.Currency).Rate);

                            var local = Convert.ToDouble(settledCash.Balance);

                            var changeDelta = eodFx - prevFx;
                            var change = changeDelta * local * -1;

                            var fromTo = new AccountUtils().GetAccounts(env, "Settled Cash", "fx gain or loss on settled balance", new string[] { settledCash.Currency }.ToList());

                            var debit = new Journal(fromTo.From, "settled-cash-fx", valueDate)
                            {
                                Source = settledCash.Source,
                                Fund = settledCash.Fund,
                                Quantity = local,

                                FxCurrency = settledCash.Currency,
                                Symbol = settledCash.Symbol,
                                SecurityId = settledCash.SecurityId,
                                FxRate = changeDelta,
                                StartPrice = prevFx,
                                EndPrice = eodFx,

                                Value = env.SignedValue(fromTo.From, fromTo.To, true, change),
                                CreditDebit = env.DebitOrCredit(fromTo.From, change),
                            };

                            var credit = new Journal(fromTo.To, "settled-cash-fx", valueDate)
                            {
                                Source = settledCash.Source,
                                Fund = settledCash.Fund,
                                Quantity = local,

                                FxCurrency = settledCash.Currency,
                                Symbol = settledCash.Symbol,
                                SecurityId = settledCash.SecurityId,
                                FxRate = changeDelta,
                                StartPrice = prevFx,
                                EndPrice = eodFx,

                                Value = env.SignedValue(fromTo.From, fromTo.To, false, change),
                                CreditDebit = env.DebitOrCredit(fromTo.To, change),
                            };

                            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
                        }
                        reader.Close();
                        con.Close();
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

                transaction.Commit();
                connection.Close();
            }
            return true;
        }
    }
}
