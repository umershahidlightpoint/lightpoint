using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Newtonsoft.Json;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
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
                    map.Add("Quantity", "Quantity");
                    map.Add("Symbol", "Symbol");
                    StringBuilder dynamicMainSelect = new StringBuilder();
                    StringBuilder dynamicInnerSelect = new StringBuilder();
                    StringBuilder dynamicGrouping = new StringBuilder();
                    foreach (var item in groups)
                    {
                        dynamicMainSelect.Append("d.").Append(item.colId).Append(",");
                        dynamicInnerSelect.Append(map[item.colId]).Append(",");
                        dynamicGrouping.Append("d.").Append(item.colId).Append(",");
                    }

                    string mainSelect = dynamicMainSelect.ToString();
                    string innerSelect = dynamicInnerSelect.ToString();
                    string grouping = dynamicGrouping.ToString().TrimEnd(',');
                    var query = $@"select 
                        {mainSelect}
						sum(d.debit) as debitSum,
                        sum(d.credit) as creditSum
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
