﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Mappers;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class journalStats
    {
        public double totalDebit { get; set; }
        public double totalCredit { get; set; }
    }

    class JournalService : IJournalService
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);
        private readonly EntityMapper mapper = new EntityMapper();
        private static readonly string tradesURL = "/api/trade?period=ITD";
        private static readonly string allocationsURL = "/api/allocation?period=ITD";

        public object Data(string symbol, int pageNumber, int pageSize, string sortColumn = "id",
            string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol)
            {
                case "ALL":
                    result = AllData(pageNumber, pageSize, sortColumn, sortDirection, accountId, value);
                    Utils.SaveAsync(result, "journal_for_ui");
                    break;

                default:
                    result = Only(symbol);
                    break;
            }

            return result;
        }

        public object GetJournal(Guid source)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("source", source.ToString())
            };

            var query = $@"SELECT [id]
                        ,[account_id] 
                        ,[value]
                        ,[source]
                        ,[when]
                        ,[fx_currency]
                        ,[fxrate]
                        ,[fund]
                        ,[generated_by] 
                        FROM [journal]
                        WHERE [journal].[source] = @source";

            List<JournalOutputDto> journal = new List<JournalOutputDto>();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, sqlParameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    journal.Add(mapper.MapJournal(reader));
                }

                reader.Close();
                sqlConnection.Close();
            }

            var result = journal.GroupBy(journals => journals.Source)
                .Select(group => new JournalOutputDto
                {
                    Source = group.Key,
                    When = group.FirstOrDefault()?.When,
                    FxCurrency = group.FirstOrDefault()?.FxCurrency,
                    FxRate = group.FirstOrDefault()?.FxRate,
                    Fund = group.FirstOrDefault()?.Fund,
                    GeneratedBy = group.FirstOrDefault()?.GeneratedBy,
                    JournalAccounts = group.SelectMany(journalAccount => journalAccount.JournalAccounts).ToList()
                })
                .ToList();

            return Utils.Wrap(true, result, null);
        }

        public object AddJournal(JournalInputDto journal)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var source = Guid.NewGuid().ToString().ToLower();
                var when = DateTime.Now.ToString("MM-dd-yyyy");
                var fxCurrency = "USD";
                var fxRate = "1.000000000";
                var generatedBy = "user";

                List<SqlParameter> accountFromParameters = new List<SqlParameter>
                {
                    new SqlParameter("accountId", journal.AccountFrom),
                    new SqlParameter("value", (journal.Value * -1)),
                    new SqlParameter("source", source),
                    new SqlParameter("when", when),
                    new SqlParameter("fxCurrency", fxCurrency),
                    new SqlParameter("fxRate", fxRate),
                    new SqlParameter("fund", journal.Fund),
                    new SqlParameter("generatedBy", generatedBy)
                };

                List<SqlParameter> accountToParameters = new List<SqlParameter>
                {
                    new SqlParameter("accountId", journal.AccountTo),
                    new SqlParameter("value", journal.Value),
                    new SqlParameter("source", source),
                    new SqlParameter("when", when),
                    new SqlParameter("fxCurrency", fxCurrency),
                    new SqlParameter("fxRate", fxRate),
                    new SqlParameter("fund", journal.Fund),
                    new SqlParameter("generatedBy", generatedBy)
                };

                var query = $@"INSERT INTO [journal]
                                    ([account_id], [value], [source], [when], [fx_currency]
                                    ,[fxrate], [fund], [generated_by])
                                    VALUES
                                    (@accountId, @value, @source, @when, @fxCurrency
                                    ,@fxRate, @fund, @generatedBy)";

                sqlHelper.Insert(query, CommandType.Text, accountFromParameters.ToArray());
                sqlHelper.Insert(query, CommandType.Text, accountToParameters.ToArray());

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        public object UpdateJournal(Guid source, JournalInputDto journal)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            if (!IsModifiable(source))
            {
                return Utils.Wrap(false, "System Generated Journals are not Editable");
            }

            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var when = DateTime.Now.ToString("MM-dd-yyyy");

                List<SqlParameter> accountFromParameters = new List<SqlParameter>
                {
                    new SqlParameter("accountId", journal.AccountFrom),
                    new SqlParameter("value", (journal.Value * -1)),
                    new SqlParameter("when", when),
                    new SqlParameter("fund", journal.Fund),
                    new SqlParameter("source", source.ToString()),
                };

                List<SqlParameter> accountToParameters = new List<SqlParameter>
                {
                    new SqlParameter("accountId", journal.AccountTo),
                    new SqlParameter("value", journal.Value),
                    new SqlParameter("when", when),
                    new SqlParameter("fund", journal.Fund),
                    new SqlParameter("source", source.ToString()),
                };

                var accountFromQuery = $@"UPDATE [journal]
                            SET [account_id] = @accountId
                            ,[value] = @value
                            ,[when] = @when
                            ,[fund] = @fund
                            WHERE [journal].[source] = @source AND [journal].[value] < 0";

                var accountToQuery = $@"UPDATE [journal]
                            SET [account_id] = @accountId
                            ,[value] = @value
                            ,[when] = @when
                            ,[fund] = @fund
                            WHERE [journal].[source] = @source AND [journal].[value] > 0";

                sqlHelper.Update(accountFromQuery, CommandType.Text, accountFromParameters.ToArray());
                sqlHelper.Update(accountToQuery, CommandType.Text, accountToParameters.ToArray());

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        public object DeleteJournal(Guid source)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            if (!IsModifiable(source))
            {
                return Utils.Wrap(false, "System Generated Journals are not Editable");
            }

            try
            {
                sqlHelper.VerifyConnection();

                List<SqlParameter> journalParameters = new List<SqlParameter>
                {
                    new SqlParameter("source", source.ToString())
                };

                var journalQuery = $@"DELETE FROM [journal]
                                    WHERE [journal].[source] = @source";

                sqlHelper.Delete(journalQuery, CommandType.Text, journalParameters.ToArray());

                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        private bool IsModifiable(Guid source)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("source", source.ToString())
            };

            var query = $@"SELECT
                        CASE WHEN [journal].[generated_by] = 'user'
	                    THEN 'true'
	                    ELSE 'false'
	                    END AS 'is_modifiable'
                        FROM [journal]
	                    WHERE [journal].[source] = @source";

            var modifiable = sqlHelper.GetScalarValue(query, CommandType.Text, sqlParameters.ToArray());

            return Convert.ToBoolean(modifiable);
        }

        private object AllData(int pageNumber, int pageSize, string sortColum = "id", string sortDirection = "asc",
            int accountId = 0, int value = 0)
        {
            // Get the Data, We will Get the Results Later
            var transactionResults = Utils.GetWebApiData(allocationsURL);

            dynamic postingEngine = new PostingEngineService().GetProgress();

            if (postingEngine.IsRunning)
            {
                return Utils.Wrap(false, "Posting Engine is currently Running");
            }

            journalStats journalStats = new journalStats();
            bool whereAdded = false;

            var query = $@"select 
                        d.overall_count   , 
                        (sum(d.debit)  OVER()) as totalDebit,
                        (sum(d.credit)  OVER()) as totalCredit, 
                        d.debit,
                        d.credit, 
                        d.[id],
                        d.[account_id],
                        d.[fund],
                        d.AccountCategory,
                        d.AccountType,
                        d.accountName,
                        d.[value],
                        d.[source],
                        d.[when],
                        d.modifiable
                        from(
                            SELECT overall_count = COUNT(*) OVER(),
                                    (CASE WHEN value < 0 THEN value else 0 END  ) debit,
                                    (CASE WHEN value > 0 THEN value else 0 END  ) credit, 
                                    [journal].[id],
                                    [account_id],
                                    [fund],
                                    [account_category].[name] as AccountCategory,  
                                    [account_type].[name] as AccountType,  
                                    [account].[name] as accountName  ,
                                    [value],
                                    [source],
                                    [when],
                                    (CASE WHEN [journal].[generated_by] = 'user' THEN 'true' else 'false' END  ) modifiable
                                    FROM [journal] with(nolock) 
                        join account  on [journal]. [account_id] = account.id 
                        join [account_type] on  [account].account_type_id = [account_type].id
                        join [account_category] on  [account_type].account_category_id = [account_category].id ";

            List<SqlParameter> sqlParams = new List<SqlParameter>();
            sqlParams.Add(new SqlParameter("pageNumber", pageNumber));
            sqlParams.Add(new SqlParameter("pageSize", pageSize));

            if (accountId > 0 || value > 0)
            {
                query = query + "where";
            }

            if (accountId > 0)
            {
                query = query + "   account.id = @accountId";
                whereAdded = true;
                sqlParams.Add(new SqlParameter("accountId", accountId));
            }

            if (value > 0)
            {
                if (whereAdded)
                {
                    query = query + " and  [journal].[value] > @value";
                }
                else
                {
                    query = query + "  [journal].[value] > " + @value;
                }

                sqlParams.Add(new SqlParameter("@value", @value));
            }


            if (sortColum == "id" && sortDirection == "1")
            {
                query = query + "  ORDER BY  [journal].[id] asc ";
            }

            if (sortColum == "source" && sortDirection == "1")
            {
                query = query + "  ORDER BY  [journal].[source] asc ";
            }

            if (sortColum == "source" && sortDirection == "-1")
            {
                query = query + "  ORDER BY  [journal].[source] desc ";
            }

            if (sortColum == "when" && sortDirection == "1")
            {
                query = query + "  ORDER BY  [journal].[when] asc ";
            }

            if (sortColum == "when" && sortDirection == "-1")
            {
                query = query + "  ORDER BY  [journal].[when] desc ";
            }

            if (pageSize > 0)
            {
                query = query + "   OFFSET(@pageNumber -1) * @pageSize ROWS FETCH NEXT @pageSize  ROWS ONLY";
            }

            query = query + " ) as d ORDER BY  [d].[id] desc";

            Console.WriteLine("===");
            Console.WriteLine(query);
            Console.WriteLine("===");

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

            transactionResults.Wait();

            var res = JsonConvert.DeserializeObject<PayLoad>(transactionResults.Result);

            var elements = JsonConvert.DeserializeObject<Transaction[]>(res.payload);

            var properties = typeof(Transaction).GetProperties();
            foreach (var prop in properties)
            {
                dataTable.Columns.Add(prop.Name, prop.PropertyType);
            }

            // Get the Columns we Need to Generate the UI Grid
            var metaData = MetaData.ToMetaData(dataTable);

            var dictionary = elements.ToDictionary(i => i.TradeId, i => i);

            foreach (var element in dataTable.Rows)
            {
                var dataRow = element as DataRow;
                dataRow["debit"] = Math.Abs(Convert.ToDecimal(dataRow["debit"]));

                var source = dataRow["source"].ToString();

                // var found = elements.Where(e => e.TradeId == dataRow["source"].ToString()).FirstOrDefault();
                if (!dictionary.ContainsKey(source))
                    continue;

                var found = dictionary[source];

                if (found != null)
                {
                    // Copy Data to the Row
                    foreach (var prop in properties)
                    {
                        dataRow[prop.Name] = prop.GetValue(found);
                    }
                }
            }

            metaData.Total = dataTable.Rows.Count > 0 ? Convert.ToInt32(dataTable.Rows[0][0]) : 0;
            journalStats.totalCredit = dataTable.Rows.Count > 0 ? Convert.ToDouble(dataTable.Rows[0]["totalDebit"]) : 0;
            journalStats.totalDebit = dataTable.Rows.Count > 0
                ? Math.Abs(Convert.ToDouble(dataTable.Rows[0]["totalCredit"]))
                : 0;

            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            var returnResult = Utils.GridWrap(json, metaData, journalStats);

            return returnResult;
        }

        public object GetTrialBalanceReport(DateTime? from = null, DateTime? to = null, string fund = "")
        {
            dynamic postingEngine = new PostingEngineService().GetProgress();

            if (postingEngine.IsRunning)
            {
                return Utils.Wrap(false, "Posting Engine is currently Running");
            }

            bool whereAdded = false;

            var query = $@"select account.name as AccountName,  
                        summary.Debit, summary.Credit, 
                        (SUM(summary.Debit) over()) as DebitSum, 
                        (SUM(summary.Credit) over()) as CreditSum 
                        from ( 
                        select account_id, 
                        sum( (CASE WHEN value < 0 THEN value else 0 END  )) Debit,
                        sum( (CASE WHEN value > 0 THEN value else 0 END  )) Credit
				        from journal with(nolock) ";

            List<SqlParameter> sqlParams = new List<SqlParameter>();

            if (from.HasValue)
            {
                query = query + " where journal.[when] >= @from";
                whereAdded = true;
                sqlParams.Add(new SqlParameter("from", from));
            }

            if (to.HasValue)
            {
                if (whereAdded)
                {
                    query = query + " and journal.[when] <= @to";
                    sqlParams.Add(new SqlParameter("to", to));
                }
                else
                {
                    query = query + " where journal.[when] <= @to";
                    whereAdded = true;
                    sqlParams.Add(new SqlParameter("to", to));
                }
            }

            if (fund != "ALL")
            {
                if (whereAdded)
                {
                    query = query + " and journal.[fund] = @fund";
                    whereAdded = true;
                    sqlParams.Add(new SqlParameter("fund", fund));
                }
                else
                {
                    query = query + " where journal.[fund] = @fund";
                    whereAdded = true;
                    sqlParams.Add(new SqlParameter("fund", fund));
                }
            }

            query = query +
                    "  group by journal.account_id ) summary right join  account on summary.account_id= account.id ";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

            journalStats stats = new journalStats();
            List<TrialBalanceReportOutPutDto> trialBalanceReport = new List<TrialBalanceReportOutPutDto>();

            stats.totalDebit = dataTable.Rows[0]["DebitSum"] != DBNull.Value
                ? Math.Abs(Convert.ToDouble(dataTable.Rows[0]["DebitSum"]))
                : 0;
            stats.totalCredit = dataTable.Rows[0]["CreditSum"] != DBNull.Value
                ? Convert.ToDouble(dataTable.Rows[0]["CreditSum"])
                : 0;

            foreach (DataRow row in dataTable.Rows)
            {
                TrialBalanceReportOutPutDto trialBalance = new TrialBalanceReportOutPutDto();
                trialBalance.AccountName = (string) row["AccountName"];
                trialBalance.Credit =
                    row["Credit"] == DBNull.Value ? (decimal?) null : Convert.ToDecimal(row["Credit"]);
                trialBalance.Debit = row["Debit"] == DBNull.Value
                    ? (decimal?) null
                    : Math.Abs(Convert.ToDecimal(row["Debit"]));

                if (trialBalance.Credit.HasValue)
                {
                    trialBalance.CreditPercentage = stats.totalCredit > 0
                        ? Math.Abs((trialBalance.Credit.Value / Convert.ToInt64(stats.totalCredit)) * 100)
                        : 0;
                }

                if (trialBalance.Debit.HasValue)
                {
                    trialBalance.DebitPercentage = stats.totalDebit > 0
                        ? Math.Abs((trialBalance.Debit.Value / Convert.ToInt64(stats.totalCredit)) * 100)
                        : 0;
                }

                trialBalanceReport.Add(trialBalance);
            }

            dynamic reportObject = new System.Dynamic.ExpandoObject();

            reportObject.data = trialBalanceReport;
            reportObject.stats = stats;

            return reportObject;
        }

        public object GetAccountingTileData(DateTime? from , DateTime? to, string fund)
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();

                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, "Posting Engine is currently Running");
                }

                bool whereAdded = false;
                var query = $@"select fund,account.name as AccountName,  
                        summary.Debit, summary.Credit
                        from ( 
                        select fund,account_id, 
                        sum( (CASE WHEN value < 0 THEN value else 0 END  )) Debit,
                        sum( (CASE WHEN value > 0 THEN value else 0 END  )) Credit
				        from journal with(nolock)";

                List<SqlParameter> sqlParams = new List<SqlParameter>();

                if (from.HasValue)
                {
                    query = query + " where journal.[when] >= @from";
                    whereAdded = true;
                    sqlParams.Add(new SqlParameter("from", from));
                }

                if (to.HasValue)
                {
                    if (whereAdded)
                    {
                        query = query + " and journal.[when] <= @to";
                        sqlParams.Add(new SqlParameter("to", to));
                    }
                    else
                    {
                        query = query + " where journal.[when] <= @to";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("to", to));
                    }
                }

                if (fund != "ALL")
                {
                    if (whereAdded)
                    {
                        query = query + " and journal.[fund] = @fund";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("fund", fund));
                    }
                    else
                    {
                        query = query + " where journal.[fund] = @fund";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("fund", fund));
                    }
                }

                query = query + "  group by fund,journal.account_id ) summary right join  account on summary.account_id= account.id ";
                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

                List<TrialBalanceTileOutputDto> trialBalanceList = new List<TrialBalanceTileOutputDto>();

                foreach (DataRow row in dataTable.Rows)
                {
                    TrialBalanceTileOutputDto trialBalance = new TrialBalanceTileOutputDto();
                    AccountListTileOutputDto accountsList = new AccountListTileOutputDto();
                    trialBalance.FundName = (row["fund"] != DBNull.Value && (string)row["fund"] != "") ? (string)row["fund"] : "N/A";
                    trialBalance.FundCredit = row["Credit"] == DBNull.Value ? 0 : Convert.ToDecimal(row["Credit"]); ;
                    trialBalance.FundDebit = row["Debit"] == DBNull.Value ? 0 : Math.Abs(Convert.ToDecimal(row["Debit"]));
                    trialBalance.FundBalance = trialBalance.FundCredit.Value - trialBalance.FundDebit.Value;

                    accountsList.AccountName = (string)row["AccountName"];
                    accountsList.AccountCredit = row["Credit"] == DBNull.Value ? 0 : Convert.ToDecimal(row["Credit"]);
                    accountsList.AccountDebit = row["Debit"] == DBNull.Value ? 0 : Math.Abs(Convert.ToDecimal(row["Debit"]));
                    accountsList.AccountBalance = accountsList.AccountCredit.Value - accountsList.AccountDebit.Value;
                    trialBalance.Accounts = new List<AccountListTileOutputDto>();
                    trialBalance.Accounts.Add(accountsList);
                    trialBalanceList.Add(trialBalance);
                }

                var tileData = trialBalanceList.GroupBy(x => x.FundName).Select(y => new TrialBalanceTileOutputDto
                {
                    FundName = y.Key,
                    FundCredit = y.Sum(z => z.FundCredit),
                    FundDebit = y.Sum(z => z.FundDebit),
                    FundBalance = y.Sum(z => z.FundBalance),
                    Accounts = y.SelectMany(z => z.Accounts).ToList()
                }).ToList();

                dynamic tileObject = new System.Dynamic.ExpandoObject();
                tileObject.payload = tileData;
                tileObject.status = HttpStatusCode.OK;
                return tileObject;
            }
            catch(Exception ex)
            {
                return Utils.Wrap(false);
            }
        }

        private object Only(string orderId)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = date.ToString("MM-dd-yyyy") + " 09:00";
            var enddate = date.ToString("MM-dd-yyyy") + " 16:30";

            var query =
                $@"select LpOrderId, Action, Symbol, Side, Quantity, SecurityType, CustodianCode, ExecutionBroker, TradeId, Fund, PMCode, PortfolioCode, TradePrice, TradeDate, Trader, Status, Commission, Fees, NetMoney, UpdatedOn from Trade nolock
                        where LPOrderId='{orderId}'
                        order by UpdatedOn desc";

            using (var con = new SqlConnection(connectionString))
            {
                var sda = new SqlDataAdapter(query, con);
                var dataTable = new DataTable();

                con.Open();
                sda.Fill(dataTable);
                con.Close();

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                content = jsonResult;

                Console.WriteLine("Done");
            }

            dynamic json = JsonConvert.DeserializeObject(content);

            return json;
        }
    }
}