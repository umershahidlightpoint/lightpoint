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
using System.Threading.Tasks;

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
                var transactionResults = Utils.GetWebApiData(allocationsURL);

                dynamic postingEngine = new PostingEngineService().GetProgress();

                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                journalStats journalStats = new journalStats();
                bool whereAdded = false;
                int index = 0;

                // Depending on type
                var query = $@"select 
                        d.debit,
                        d.credit, 
                        abs(d.debit) - abs(d.credit) as balance,
                        d.[id],
                        d.[account_id],
                        d.[fund],
                        d.[symbol] as Symbol,
                        d.[security_id],
                        d.AccountCategory,
                        d.AccountType,
                        d.accountName,
                        d.accountDescription,
                        d.[value],
                        d.[source],
                        d.[when],
                        d.[event],
                        d.[start_price],
                        d.[end_price],
                        d.[fxrate],
                        d.modifiable
                        from(
                            SELECT
                                    (CASE 

										WHEN [account_category].[name] in ('Asset', 'Expenses') and value < 0  THEN ABS(value) 
                                        WHEN [account_category].[name] not in ('Asset', 'Expenses') and value > 0  THEN ABS(value) 
										Else 0
										END  ) credit,
                                    (CASE 
										WHEN [account_category].[name] in ('Asset','Expenses') and value > 0  THEN ABS(value) 
                                        WHEN [account_category].[name] not in ('Asset','Expenses') and value < 0  THEN ABS(value) 
										Else 0
										END  ) debit,
                                    [journal].[id],
                                    [account_id],
                                    [fund],
                                    [symbol],
                                    [security_id],
                                    [account_category].[name] as AccountCategory,  
                                    [account_type].[name] as AccountType,  
                                    [account].[name] as accountName,
                                    [account].[description] as accountDescription,
                                    [value],
                                    [source],
                                    [when],
                                    [event],
                                    [start_price],
                                    [end_price],
                                    [fxrate],
                                    (CASE WHEN [journal].[generated_by] = 'user' THEN 'true' else 'false' END  ) modifiable
                                    FROM [journal] with(nolock) 
                        join account with(nolock) on [journal]. [account_id] = account.id 
                        join [account_type] with(nolock) on  [account].account_type_id = [account_type].id
                        join [account_category] with(nolock) on  [account_type].account_category_id = [account_category].id";

                List<SqlParameter> sqlParams = new List<SqlParameter>();
                sqlParams.Add(new SqlParameter("pageNumber", obj.pageNumber));
                sqlParams.Add(new SqlParameter("pageSize", obj.pageSize));

                foreach(var item in obj.filters)
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
                        if(index == 0)
                        {
                            query = query + "(";
                        }
                        else
                        {
                            query = query + "or ";
                        }
                        if (item.column == "fund")
                        {
                            query = query + $" [journal].fund = @fund{index}";
                            sqlParams.Add(new SqlParameter($"fund{index}", value));
                        }
                        else if(item.column == "AccountCategory")
                        {
                            query = query + $"[account_category].name = @account_category{index}";
                            sqlParams.Add(new SqlParameter($"account_category{index}", value));
                        }
                        else if(item.column == "account")
                        {
                            query = query + $"[account].name = @account_name{index}";
                            sqlParams.Add(new SqlParameter($"account_name{index}", value));
                        }
                        else if(item.column == "account_type")
                        {
                            query = query + $"[account_type].name = @account_type{index}";
                            sqlParams.Add(new SqlParameter($"account_type{index}", value));
                        }
                        if(index == dataCount)
                        {
                            query = query + ")";
                        }
                        index++;
                        orAdded = true;
                    }
                }

                query = query + " ) as d ORDER BY  [d].[id] desc";

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

                journalStats.totalCredit = 0;
                journalStats.totalDebit = 0;

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                dynamic json = JsonConvert.DeserializeObject(jsonResult);

                var returnResult = Utils.Wrap(true, json, HttpStatusCode.OK, null, metaData, journalStats);

                return returnResult;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
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
                        dynamicMainSelect.Append("d.[").Append(item.colId).Append("],");
                        dynamicInnerSelect.Append(map[item.colId]).Append(",");
                        dynamicGrouping.Append("d.[").Append(item.colId).Append("],");
                    }

                    string mainSelect = dynamicMainSelect.ToString();
                    string innerSelect = dynamicInnerSelect.ToString();
                    string grouping = dynamicGrouping.ToString().TrimEnd(',');
                    var query = $@"select 
                        {mainSelect}
                        count(*) as groupCount,
						sum(d.debit) as debitSum,
                        sum(d.credit) as creditSum,
                        sum(abs(d.debit)) - sum(abs(d.credit)) as balance
                        from(
                            SELECT
                                    {innerSelect}
                                    (CASE
                                        WHEN[account_category].[name] in ('Asset', 'Expenses') and value < 0  THEN ABS(value)
                                        WHEN[account_category].[name] not in ('Asset', 'Expenses') and value > 0  THEN ABS(value)
                                        Else 0
                                        END) credit,
                                    (CASE
                                        WHEN[account_category].[name] in ('Asset', 'Expenses') and value > 0  THEN ABS(value)
                                        WHEN[account_category].[name] not in ('Asset', 'Expenses') and value < 0  THEN ABS(value)
                                        Else 0
                                        END) debit
                                    FROM[journal] with(nolock)
                        join account with(nolock) on[journal]. [account_id] = account.id
                        join[account_type] with(nolock) on[account].account_type_id = [account_type].id
                        join[account_category] with(nolock) on[account_type].account_category_id = [account_category].id ) as d group by {grouping}";

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
                    var result = Utils.Wrap(true, json, HttpStatusCode.OK, null, metaData);
                    return result;
                }
                else
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Grouping is not Present in this Layout");
                }
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError, "Something Bad Happened!");
            }
        }
    }
}
