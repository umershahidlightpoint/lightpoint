using LP.Finance.Common.Model;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common
{
    public class ServerSideRowModelHelper
    {
        public static Tuple<string, string, List<SqlParameter>> BuildSql(ServerRowModel obj, string from, bool fetchWhere = false)
        {
            List<SqlParameter> sqlParams = new List<SqlParameter>();
            Tuple<string, string, int> whereSql = CreateWhereSql(obj, sqlParams);
            if (fetchWhere)
            {
                return new Tuple<string, string, List<SqlParameter>>(whereSql.Item1, "", sqlParams);
            }
            else
            {
                string selectSql = CreateSelectSql(obj, from);
                string fromSql = $" FROM [{from}] ";
                string limitSql = CreateLimitSql(obj, sqlParams);
                string orderBySql = CreateOrderBySql(obj);
                string groupBySql = CreateGroupBySql(obj);
                string havingSql = CreateHavingSql(obj, sqlParams, whereSql.Item3);
                string message = !string.IsNullOrWhiteSpace(whereSql.Item2) ? whereSql.Item2 : null;
                string query = "select * from (" + selectSql + fromSql + whereSql.Item1 + groupBySql + havingSql + ") t " + orderBySql + limitSql;
                return new Tuple<string, string, List<SqlParameter>>(query, message, sqlParams);
            }
        }

        private static string CreateHavingSql(ServerRowModel obj, List<SqlParameter> sqlParams, int index)
        {
            StringBuilder query = new StringBuilder("");
            bool isGrouping = IsDoingGrouping(obj.rowGroupCols, obj.groupKeys);
            if (isGrouping)
            {
                var externalFiltersHavingClause = ExtractExternalFilters(obj, ref sqlParams, index, true);
                if (externalFiltersHavingClause.Count > 0)
                {
                    query.Append(" having ");
                    return query.Append($"{string.Join(" and ", externalFiltersHavingClause.Select(x => x))}").ToString();
                }
                else
                {
                    return "";
                }
            }
            else
            {
                return "";
            }

        }

        private static bool IsDoingGrouping(List<RowGroupCols> rowGroupCols, List<string> groupKeys)
        {
            // we are not doing grouping if at the lowest level. we are at the lowest level
            // if we are grouping by more columns than we have keys for (that means the user
            // has not expanded a lowest level group, OR we are not grouping at all).
            return rowGroupCols.Count > groupKeys.Count;
        }

        public static bool isDoingGroupingByRootNodeOrNoGrouping(List<RowGroupCols> rowGroupCols, List<string> groupKeys)
        {
            return ((rowGroupCols.Count > 0 && groupKeys.Count == 0) || rowGroupCols.Count == 0);
        }


        private static string CreateGroupBySql(ServerRowModel obj)
        {
            if (IsDoingGrouping(obj.rowGroupCols, obj.groupKeys))
            {
                List<string> colsToGroupBy = new List<string>();
                int count = obj.groupKeys.Count == 0 ? 0 : obj.groupKeys.Count;
                var rowGroupCol = obj.rowGroupCols[count];
                colsToGroupBy.Add($"[{rowGroupCol.field}]");
                StringBuilder query = new StringBuilder(" group by ");
                query.Append(string.Join(",", colsToGroupBy.Select(x => x)) + " ");
                return query.ToString();
            }
            else
            {
                // select all columns
                return "";
            }
        }

        private static string CreateOrderBySql(ServerRowModel obj)
        {
            var grouping = IsDoingGrouping(obj.rowGroupCols, obj.groupKeys);
            List<string> sortParts = new List<string>();
            bool groupSortsPresent = false;
            int count = obj.groupKeys.Count == 0 ? 0 : obj.groupKeys.Count;
            if ((obj.sortModel.Count == obj.rowGroupCols.Count && obj.rowGroupCols.Count > 0 &&
                 obj.groupKeys.Count == 0))
            {
                //when the complete group is clicked for sorting. just sort by the root level node initially. Rest of the sorting will be applied as the user drills down.
                // do nothing
            }
            else if (obj.sortModel.Count > 0)
            {
                var modifiedRowGroupCols = obj.rowGroupCols.Select(x => x.id).ToList();
                if (obj.groupKeys.Count == 0)
                {
                    modifiedRowGroupCols.RemoveRange(0, modifiedRowGroupCols.Count);
                }
                else
                {
                    //modifiedRowGroupCols.RemoveRange(0, count);
                    modifiedRowGroupCols = modifiedRowGroupCols.Skip(count).Take(1).ToList();
                }

                foreach (var item in obj.sortModel)
                {
                    if (grouping && modifiedRowGroupCols.IndexOf(item.colId) < 0)
                    {
                        //ignore because these groupings are not focused right now
                    }
                    else
                    {
                        if (!SortByAbsoluteValue(obj.absoluteSorting, item.colId))
                        {
                            sortParts.Add($"[{item.colId}] {item.sort}");
                        }
                        else
                        {
                            sortParts.Add($"ABS([{item.colId}]) {item.sort}");
                        }
                        groupSortsPresent = true;
                    }
                }
            }

            if ((grouping && obj.sortModel.Count == 0) || (!groupSortsPresent && grouping))
            {
                var rowGroupCol = obj.rowGroupCols[count];
                var direction = obj.sortModel.Where(x => x.colId == rowGroupCol.field).FirstOrDefault();

                //check if sorting is being performed on an aggreagte column
                if (obj.sortModel.Count > 0)
                {
                    foreach (var item in obj.sortModel)
                    {
                        if (obj.valueCols.Any(x => x.field == item.colId))
                        {
                            if (!SortByAbsoluteValue(obj.absoluteSorting, item.colId))
                            {
                                sortParts.Add($"[{item.colId}] {item.sort}");
                            }
                            else
                            {
                                sortParts.Add($"ABS([{item.colId}]) {item.sort}");
                            }
                        }
                    }
                }

                if (sortParts.Count == 0)
                {
                    if (direction != null)
                    {
                        sortParts.Add($"[{rowGroupCol.field}] {direction.sort}");
                    }
                    else
                    {
                        sortParts.Add($"[{rowGroupCol.field}]");
                    }
                }
            }

            if (sortParts.Count > 0)
            {
                return " order by " + string.Join(",", sortParts.Select(x => x));
            }
            else
            {
                return " order by [when] desc";
            }
        }

        private static string CreateLimitSql(ServerRowModel obj, List<SqlParameter> sqlParams)
        {
            sqlParams.Add(new SqlParameter("pageNumber", obj.pageNumber));
            sqlParams.Add(new SqlParameter("pageSize", obj.pageSize));
            return " OFFSET(@pageNumber -1) * @pageSize ROWS FETCH NEXT @pageSize  ROWS ONLY";
        }

        private static Tuple<string, string, int> CreateWhereSql(ServerRowModel obj, List<SqlParameter> sqlParams)
        {
            List<string> whereParts = new List<string>();
            int index = 0;
            StringBuilder message = new StringBuilder();
            List<string> duplicateFilterList = new List<string>();
            StringBuilder query = new StringBuilder("");
            if (obj.groupKeys.Count > 0)
            {
                foreach (var item in obj.groupKeys)
                {
                    string colName = obj.rowGroupCols[index].id;
                    sqlParams.Add(new SqlParameter($"{colName}{index}", item));
                    whereParts.Add($" [{colName}] = @{colName}{index} ");
                    index++;
                }
            }

            var filterDict = (IDictionary<string, dynamic>)(obj.filterModel);
            var externalFilterDict = (IDictionary<string, dynamic>)(obj.externalFilterModel);
            var externalFilters = ExtractExternalFilters(obj, ref sqlParams, index);
            if (filterDict != null)
            {
                foreach (var col in filterDict)
                {
                    string columnName = col.Key;
                    var value = (IDictionary<string, object>)(col.Value);
                    List<string> filterModelWhereList = new List<string>();
                    //only extract in grid filters which are not present in external filters. External filters have precedence over internal.
                    if (!externalFilterDict.Keys.Contains(columnName, StringComparer.CurrentCultureIgnoreCase))
                    {
                        index = ExtractInGridFilters(sqlParams, whereParts, index, columnName, value, filterModelWhereList);
                    }
                    else
                    {
                        duplicateFilterList.Add(columnName);
                    }
                }
            }

            if (duplicateFilterList.Count > 0 && obj.pageNumber == 1)
            {
                message.Append($"External filter(s) already present for {string.Join(" and ", duplicateFilterList.Select(x => x))}");
            }

            if (whereParts.Count > 0)
            {
                whereParts.AddRange(externalFilters);
                query.Append(" where " + string.Join(" and ", whereParts.Where(x => !string.IsNullOrEmpty(x)).Select(x => x)));
                return new Tuple<string, string, int>(query.ToString(), message.ToString(), index);
            }

            if (externalFilters.Count > 0)
            {
                query.Append(" where " + string.Join(" and ", externalFilters.Select(x => x)));
                return new Tuple<string, string, int>(query.ToString(), message.ToString(), index);
            }

            return new Tuple<string, string, int>(" ", message.ToString(), index);
        }

        private static int ExtractInGridFilters(List<SqlParameter> sqlParams, List<string> whereParts, int index,
            string columnName, IDictionary<string, object> value, List<string> filterModelWhereList)
        {
            switch ((string)value["filterType"])
            {
                case "set":
                    index = ExtractSetFilters(sqlParams, whereParts, index, columnName, value, filterModelWhereList);
                    break;
                case "date":
                    index = ExtractDateFilter(sqlParams, whereParts, index, columnName, value);
                    break;
                case "text":
                    index = ExtractTextFilter(sqlParams, whereParts, index, columnName, value);
                    break;
                case "number":
                    index = ExtractNumberFilter(sqlParams, whereParts, index, columnName, value);
                    break;
            }

            return index;
        }

        private static int ExtractTextFilter(List<SqlParameter> sqlParams, List<string> whereParts, int index,
            string columnName, IDictionary<string, object> value)
        {
            if (value.ContainsKey("condition1") && value.ContainsKey("condition2"))
            {
                var condition1 = (IDictionary<string, dynamic>)value["condition1"];
                var condition2 = (IDictionary<string, dynamic>)value["condition2"];

                whereParts.Add("(");
                index = ExtractSingleTextFilter(sqlParams, whereParts, index, columnName, condition1, true);
                whereParts[whereParts.Count - 1] += $" {(string)value["operator"]} ";
                index = ExtractSingleTextFilter(sqlParams, whereParts, index, columnName, condition2, true);
                whereParts[whereParts.Count - 1] += ")";
            }
            else
            {
                index = ExtractSingleTextFilter(sqlParams, whereParts, index, columnName, value, false);
            }

            return index;
        }

        private static int ExtractSingleTextFilter(List<SqlParameter> sqlParams, List<string> whereParts, int index,
            string columnName,
            IDictionary<string, dynamic> condition, bool multipleConditions)
        {
            sqlParams.Add(new SqlParameter($"{columnName}{index}", condition["filter"]));
            if (multipleConditions)
            {
                whereParts[whereParts.Count - 1] +=
                    $"[{columnName}] {GetOperator((string)condition["type"])} {GetValue((string)condition["type"], $"{columnName}{index}")}";
            }
            else
            {
                whereParts.Add(
                    $"[{columnName}] {GetOperator((string)condition["type"])} {GetValue((string)condition["type"], $"{columnName}{index}")}");
            }

            index++;

            return index;
        }

        private static int ExtractDateFilter(List<SqlParameter> sqlParams, List<string> whereParts, int index,
            string columnName, IDictionary<string, object> value)
        {
            if (value.ContainsKey("condition1") && value.ContainsKey("condition2"))
            {
                var condition1 = (IDictionary<string, dynamic>)value["condition1"];
                var condition2 = (IDictionary<string, dynamic>)value["condition2"];
                whereParts.Add("(");
                index = ExtractDateFilterSingle(sqlParams, whereParts, index, columnName, condition1, true);
                whereParts[whereParts.Count - 1] += $" {(string)value["operator"]} ";
                index = ExtractDateFilterSingle(sqlParams, whereParts, index, columnName, condition2, true);
                whereParts[whereParts.Count - 1] += ")";
            }
            else
            {
                index = ExtractDateFilterSingle(sqlParams, whereParts, index, columnName, value, false);
            }

            return index;
        }

        private static int ExtractDateFilterSingle(List<SqlParameter> sqlParams, List<string> whereParts, int index,
            string columnName, IDictionary<string, object> value, bool multipleConditions)
        {
            if ((string)value["type"] == "equals" || (string)value["type"] == "lessThan" ||
                (string)value["type"] == "greaterThan" || (string)value["type"] == "notEqual")
            {
                sqlParams.Add(new SqlParameter($"{columnName}{index}", (object)value["dateFrom"]));
                if (!multipleConditions)
                {
                    whereParts.Add($"[{columnName}] {GetOperator((string)value["type"])} @{columnName}{index}");
                }
                else
                {
                    whereParts[whereParts.Count - 1] +=
                        $"[{columnName}] {GetOperator((string)value["type"])} @{columnName}{index}";
                }

                index++;
            }
            else if ((string)value["type"] == "inRange")
            {
                sqlParams.Add(new SqlParameter($"{columnName}{index}", (object)value["dateFrom"]));
                if (!multipleConditions)
                {
                    whereParts.Add($"([{columnName}] >= @{columnName}{index} AND ");
                }
                else
                {
                    whereParts[whereParts.Count - 1] += $"([{columnName}] >= @{columnName}{index} AND ";
                }

                index++;
                sqlParams.Add(new SqlParameter($"{columnName}{index}", (object)value["dateTo"]));
                whereParts[whereParts.Count - 1] += $"[{columnName}] <= @{columnName}{index})";
                index++;
            }

            return index;
        }

        private static string GetOperator(string type)
        {
            string symbol = "";
            switch (type)
            {
                case "equals":
                    symbol = "=";
                    break;
                case "lessThan":
                    symbol = "<";
                    break;
                case "lessThanOrEqual":
                    symbol = "<=";
                    break;
                case "greaterThan":
                    symbol = ">";
                    break;
                case "greaterThanOrEqual":
                    symbol = ">=";
                    break;
                case "notEqual":
                    symbol = "!=";
                    break;
                case "contains":
                case "startsWith":
                case "endsWith":
                    symbol = "LIKE";
                    break;
                case "notContains":
                    symbol = "NOT LIKE";
                    break;
            }

            return symbol;
        }

        private static string GetValue(string type, string filter)
        {
            string value = "";
            switch (type)
            {
                case "contains":
                case "notContains":
                    value = $"'%'+@{filter}+'%'";
                    break;
                case "equals":
                case "notEqual":
                    value = $"@{filter}";
                    break;
                case "startsWith":
                    value = $"@{filter}+'%'";
                    break;
                case "endsWith":
                    value = $"'%'+@{filter}";
                    break;
            }

            return value;
        }

        private static int ExtractSetFilters(List<SqlParameter> sqlParams, List<string> whereParts, int index,
            string columnName, IDictionary<string, object> value, List<string> filterModelWhereList)
        {
            List<object> values = (List<object>)value["values"];
            foreach (var item in values)
            {
                sqlParams.Add(new SqlParameter($"{columnName}{index}", item));
                filterModelWhereList.Add($"@{columnName}{index}");
                index++;
            }

            if (filterModelWhereList.Count > 0)
            {
                string concat = string.Join(",", filterModelWhereList.Select(x => x));
                whereParts.Add($"[{columnName}] IN ({concat})");
            }

            return index;
        }


        private static int ExtractNumberFilter(List<SqlParameter> sqlParams, List<string> whereParts, int index,
            string columnName, IDictionary<string, object> value)
        {
            if (value.ContainsKey("condition1") && value.ContainsKey("condition2"))
            {
                var condition1 = (IDictionary<string, dynamic>)value["condition1"];
                var condition2 = (IDictionary<string, dynamic>)value["condition2"];
                whereParts.Add("(");
                index = ExtractNumberFilterSingle(sqlParams, whereParts, index, columnName, condition1, true);
                whereParts[whereParts.Count - 1] += $" {(string)value["operator"]} ";
                index = ExtractNumberFilterSingle(sqlParams, whereParts, index, columnName, condition2, true);
                whereParts[whereParts.Count - 1] += ")";
            }
            else
            {
                index = ExtractNumberFilterSingle(sqlParams, whereParts, index, columnName, value, false);
            }

            return index;
        }

        private static int ExtractNumberFilterSingle(List<SqlParameter> sqlParams, List<string> whereParts, int index,
            string columnName, IDictionary<string, object> value, bool multipleConditions)
        {
            if ((string)value["type"] == "equals" || (string)value["type"] == "notEqual" ||
                (string)value["type"] == "lessThan" || (string)value["type"] == "greaterThan"
                || (string)value["type"] == "lessThanOrEqual" || (string)value["type"] == "greaterThanOrEqual")
            {
                sqlParams.Add(new SqlParameter($"{columnName}{index}", (object)value["filter"]));
                if (!multipleConditions)
                {
                    whereParts.Add($"[{columnName}] {GetOperator((string)value["type"])} @{columnName}{index}");
                }
                else
                {
                    whereParts[whereParts.Count - 1] +=
                        $"[{columnName}] {GetOperator((string)value["type"])} @{columnName}{index}";
                }

                index++;
            }
            else if ((string)value["type"] == "inRange")
            {
                sqlParams.Add(new SqlParameter($"{columnName}{index}", (object)value["filter"]));
                if (!multipleConditions)
                {
                    whereParts.Add($"([{columnName}] >= @{columnName}{index} AND ");
                }
                else
                {
                    whereParts[whereParts.Count - 1] += $"([{columnName}] >= @{columnName}{index} AND ";
                }

                index++;
                sqlParams.Add(new SqlParameter($"{columnName}{index}", (object)value["filterTo"]));
                whereParts[whereParts.Count - 1] += $"[{columnName}] <= @{columnName}{index})";
                index++;
            }

            return index;
        }

        private static List<string> ExtractExternalFilters(ServerRowModel obj, ref List<SqlParameter> sqlParams,
            int index = 0, bool havingClause = false)
        {
            List<string> whereParts = new List<string>();

            var filterDictionary = (IDictionary<string, dynamic>)(obj.externalFilterModel);
            if (filterDictionary != null)
            {
                foreach (var col in filterDictionary)
                {
                    var filterObject = (IDictionary<string, object>)(col.Value);
                    var columnName = col.Key;
                    if (!havingClause && !obj.havingColumns.Any(x => x == columnName))
                    {
                        whereParts = ExtractExternalFiltersForWhereOrHaving(sqlParams, ref index, whereParts, filterObject, columnName);
                    }
                    else if (havingClause && obj.havingColumns.Any(x => x == columnName))
                    {
                        whereParts = ExtractExternalFiltersForWhereOrHaving(sqlParams, ref index, whereParts, filterObject, columnName);

                    }
                }
            }

            return whereParts;
        }

        private static List<string> ExtractExternalFiltersForWhereOrHaving(List<SqlParameter> sqlParams, ref int index, List<string> whereParts, IDictionary<string, object> filterObject, string columnName)
        {
            string filterValue;
            switch (filterObject["filterType"])
            {
                case "set":
                    filterValue = (string)filterObject["values"];
                    sqlParams.Add(new SqlParameter($"{columnName}{index}", filterValue));
                    whereParts.Add($"[{columnName}] = @{columnName}{index}");
                    index++;
                    break;
                case "text":
                    filterValue = (string)filterObject["values"];
                    sqlParams.Add(new SqlParameter($"{columnName}{index}", filterValue));
                    whereParts.Add($"[{columnName}] LIKE '%'+@{columnName}{index}+'%'");
                    index++;
                    break;
                case "date":
                    var dateFrom = (string)filterObject["dateFrom"];
                    var dateTo = (string)filterObject["dateTo"];
                    sqlParams.Add(new SqlParameter($"dateFrom{index}", dateFrom));
                    sqlParams.Add(new SqlParameter($"dateTo{index}", dateTo));
                    whereParts.Add($"[{columnName}] >= @dateFrom{index} and [{columnName}] <= @dateTo{index}");
                    index++;
                    break;
                case "number":
                    sqlParams.Add(new SqlParameter($"{columnName}{index}", (object)filterObject["values"]));
                    if (columnName.Equals("balance"))
                    {
                        whereParts.Add($" sum(abs(debit)) - sum(abs(credit)) {GetOperator((string)filterObject["type"])} @{columnName}{index}");

                    }
                    else
                    {
                        whereParts.Add($"[{columnName}] {GetOperator((string)filterObject["type"])} @{columnName}{index}");

                    }
                    index++;
                    break;
            }

            return whereParts;
        }

        private static string CreateSelectSql(ServerRowModel obj, string from)
        {
            var grouping = IsDoingGrouping(obj.rowGroupCols, obj.groupKeys);
            StringBuilder query = new StringBuilder("select ");
            if (grouping)
            {
                int count = obj.groupKeys.Count == 0 ? 0 : obj.groupKeys.Count;
                var rowGroupCol = obj.rowGroupCols[count];
                query.Append($"[{rowGroupCol.field}],");
                var aggCols = GetAggregateColumns(obj);
                query.Append(string.Join(",", aggCols.Select(x => x)));
                return query.ToString();
            }
            else
            {
                if (obj.valueCols.Any(x => x.field == "debit") && obj.valueCols.Any(x => x.field == "credit") &&
                    obj.valueCols.Any(x => x.field == "balance"))
                {
                    return "select (abs(debit)) - (abs(credit)) as balance, * ";
                }
                else
                {
                    return "select * ";
                }
            }
        }

        private static List<string> GetAggregateColumns(ServerRowModel obj)
        {
            List<string> aggregateCols = new List<string>();
            if (obj.valueCols.Count > 0)
            {
                aggregateCols.Add("count(*) as groupCount");
                foreach (var col in obj.valueCols)
                {
                    if (!string.IsNullOrEmpty(col.aggFunc))
                    {
                        if (col.field.Equals("balance"))
                        {
                            if (obj.valueCols.Any(x => x.field == "debit") && obj.valueCols.Any(x => x.field == "credit"))
                            {
                                aggregateCols.Add($"{col.aggFunc}(abs(debit)) - {col.aggFunc}(abs(credit)) as {col.field}");
                            }
                        }
                        else
                        {
                            aggregateCols.Add($"{col.aggFunc}({col.field}) as {col.field}");
                        }
                    }
                }
            }

            return aggregateCols;
        }

        public static int GetRowCount(ServerRowModel request, DataTable results)
        {
            if (results.Rows.Count == 0)
            {
                return 0;
            }

            int currentLastRow = request.startRow + results.Rows.Count;
            if (currentLastRow < request.endRow)
            {
                return currentLastRow;
            }
            else
            {
                return -1;
            }
        }

        private static bool SortByAbsoluteValue(List<string> absoluteCols, string colId)
        {
            return absoluteCols.Any(x => x.Equals(colId));
        }
    }
}
