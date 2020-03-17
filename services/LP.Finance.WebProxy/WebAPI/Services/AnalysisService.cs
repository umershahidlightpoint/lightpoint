using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class AnalysisService : IAnalysisService
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);
        private static readonly string allocationsURL = "/api/allocation?period=ITD";


        public object GetJournalDetails(JournalGridMain obj)
        {
            try
            {
                // Get the Data, We will Get the Results Later
                var transactionResults = Shared.WebApi.GetWebApiData(allocationsURL, ConfigurationManager.AppSettings[""]);

                dynamic postingEngine = new PostingEngineService().GetProgress();

                if (postingEngine.IsRunning)
                {
                    return Shared.WebApi.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                journalStats journalStats = new journalStats();
                bool whereAdded = false;
                int index = 0;
                var totalCountColumn = obj.pageNumber == 1 ? "d.overall_count," : "";
                var totalCountQuery = obj.pageNumber == 1 ? "overall_count = COUNT(*) OVER()," : "";

                var query = $@"select
                               {totalCountQuery}
                              debit,
                              credit, 
                              abs(debit) - abs(credit) as balance,
                              [id],
                              [account_id],
                              [fund],
                              [symbol] as Symbol,
                              [security_id],
                              AccountCategory,
                              AccountType,
                              accountName,
                              accountDescription,
                              [value],
                              [source],
                              [when],
                              [event],
                              [start_price],
                              [end_price],
                              [fxrate]
                              from vwJournal";

                List<SqlParameter> sqlParams = new List<SqlParameter>();
                sqlParams.Add(new SqlParameter("pageNumber", obj.pageNumber));
                sqlParams.Add(new SqlParameter("pageSize", obj.pageSize));

                foreach (var item in obj.filters)
                {
                    bool orAdded = false;
                    index = 0;
                    int dataCount = item.data.Count - 1;
                    if (!whereAdded)
                    {
                        query = query + " where";
                        whereAdded = true;
                    }
                    else
                    {
                        query = query + " and ";
                    }

                    foreach (var value in item.data)
                    {
                        if (index == 0)
                        {
                            query = query + "(";
                        }
                        else
                        {
                            query = query + "or ";
                        }

                        query = query + $"{item.column} = @{item.column}{index}";
                        sqlParams.Add(new SqlParameter($"{item.column}{index}", value));
                        if (index == dataCount)
                        {
                            query = query + ")";
                        }

                        index++;
                        orAdded = true;
                    }
                }

                query = query + " ORDER BY [id] desc";

                if (obj.pageSize > 0)
                {
                    query = query + " OFFSET(@pageNumber -1) * @pageSize ROWS FETCH NEXT @pageSize  ROWS ONLY";
                }


                Console.WriteLine("===");
                Console.WriteLine(query);
                Console.WriteLine("===");

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

                transactionResults.Wait();

                var res = JsonConvert.DeserializeObject<PayLoad>(transactionResults.Result);

                var elements = JsonConvert.DeserializeObject<Transaction[]>(res.payload);
                var dictionary = elements.ToDictionary(i => i.TradeId, i => i);

                foreach (var element in dataTable.Rows)
                {
                    var dataRow = element as DataRow;

                    dataRow["debit"] = Math.Abs(Convert.ToDecimal(dataRow["debit"]));
                }

                HelperFunctions.Join(dataTable, dictionary, "source");

                var metaData = MetaData.ToMetaData(dataTable);

                metaData.Total = dataTable.Rows.Count > 0 ? dataTable.Rows.Count : 0;
                metaData.TotalRecords = obj.pageNumber == 1 && dataTable.Rows.Count > 0 ? Convert.ToInt32(dataTable.Rows[0][0]) : 0;

                journalStats.totalCredit = 0;
                journalStats.totalDebit = 0;

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                dynamic json = JsonConvert.DeserializeObject(jsonResult);

                var returnResult = Shared.WebApi.Wrap(true, json, HttpStatusCode.OK, null, metaData, journalStats);

                return returnResult;
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
        }

        public object GetSummarizedJournal(List<GridLayoutDto> layout)
        {
            try
            {
                var groups = layout.Where(x => x.rowGroupIndex.HasValue).OrderBy(x => x.rowGroupIndex).ToList();
                if (groups.Count > 0)
                {
                    var map = new Dictionary<string, string>();
                    map.Add("fund", "fund");
                    map.Add("AccountCategory", "[account_category].[name] as AccountCategory");
                    map.Add("AccountType", "[account_type].[name] as AccountType");
                    map.Add("accountName", "[account].[name] as accountName");
                    map.Add("when", "[when]");
                    map.Add("Quantity", "Quantity");
                    map.Add("Symbol", "Symbol");
                    StringBuilder dynamicMainSelect = new StringBuilder();
                    StringBuilder dynamicInnerSelect = new StringBuilder();
                    StringBuilder dynamicGrouping = new StringBuilder();
                    foreach (var item in groups)
                    {
                        dynamicMainSelect.Append("[").Append(item.colId).Append("],");
                        dynamicInnerSelect.Append(map[item.colId]).Append(",");
                        dynamicGrouping.Append("[").Append(item.colId).Append("],");
                    }

                    string mainSelect = dynamicMainSelect.ToString();
                    string grouping = dynamicGrouping.ToString().TrimEnd(',');
                    
                    var query = $@"select 
                        {mainSelect}
                        count(*) as groupCount,
						sum(debit) as debitSum,
                        sum(credit) as creditSum,
                        sum(abs(debit)) - sum(abs(credit)) as balance
                        from vwJournal group by {grouping}";

                    Console.WriteLine(">>>>>");
                    Console.WriteLine(query);
                    Console.WriteLine(">>>>>");

                    var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
                    var metaData = MetaData.ToMetaData(dataTable);
                    foreach (var item in metaData.Columns)
                    {
                        var group = groups.Where(x => x.colId == item.field).FirstOrDefault();
                        if (group != null)
                        {
                            item.colId = item.field;
                            item.rowGroupIndex = group.rowGroupIndex;
                        }
                        else
                        {
                            item.aggFunc = "sum";
                        }
                    }

                    var jsonResult = JsonConvert.SerializeObject(dataTable);
                    dynamic json = JsonConvert.DeserializeObject(jsonResult);
                    var result = Shared.WebApi.Wrap(true, json, HttpStatusCode.OK, null, metaData);
                    return result;
                }
                else
                {
                    return Shared.WebApi.Wrap(false, null, HttpStatusCode.OK, "Grouping is not Present in this Layout");
                }
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError, "Something Bad Happened!");
            }
        }
    }
}