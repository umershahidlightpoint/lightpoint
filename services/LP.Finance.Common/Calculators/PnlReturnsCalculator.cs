using LP.Finance.Common.Model;
using LP.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Reflection;

namespace LP.Finance.Common.Calculators
{

    public static class Helper
    {
        public static T ToObject<T>(this DataRow dataRow) where T : new()
        {
            T item = new T();

            foreach (DataColumn column in dataRow.Table.Columns)
            {
                var property = GetProperty(typeof(T), column.ColumnName);

                if (property != null && dataRow[column] != DBNull.Value && dataRow[column].ToString() != "NULL")
                {
                    property.SetValue(item, ChangeType(dataRow[column], property.PropertyType), null);
                }
            }

            return item;
        }

        private static PropertyInfo GetProperty(Type type, string attributeName)
        {
            var property = type.GetProperty(attributeName);

            if (property != null)
            {
                return property;
            }

            return type.GetProperties()
                 .Where(p => p.IsDefined(typeof(DisplayAttribute), false) && p.GetCustomAttributes(typeof(DisplayAttribute), false).Cast<DisplayAttribute>().Single().Name == attributeName)
                 .FirstOrDefault();
        }

        public static object ChangeType(object value, Type type)
        {
            if (type.IsGenericType && type.GetGenericTypeDefinition().Equals(typeof(Nullable<>)))
            {
                if (value == null)
                {
                    return null;
                }

                return Convert.ChangeType(value, Nullable.GetUnderlyingType(type));
            }

            return Convert.ChangeType(value, type);
        }
    }

    public class PnlReturn
    {
        public bool ExistingRecord { get; set; }
        public DateTime AsOf { get; set; }
	    public decimal? DayPnl { get; set; }

        public string Fund { get; set; }

        public decimal? SodNav { get; set; }
        public decimal? EodNav { get; set; }

        public decimal? Withdrawls { get; set; }
        public decimal? Contributions { get; set; }
        public decimal? DayPnlPer { get; set; }
        public decimal? WtdPnlPer { get; set; }
        public decimal? MtdPnlPer { get; set; }
        public decimal? QtdPnlPer { get; set; }
        public decimal? YtdPnlPer { get; set; }
        public decimal? ItdPnlPer { get; set; }
        public decimal? WtdPnl { get; set; }
        public decimal? MtdPnl { get; set; }
        public decimal? QtdPnl { get; set; }
        public decimal? YtdPnl { get; set; }
        public decimal? ItdPnl { get; set; }

        public static List<PnlReturn> GetList(string connectionString, DateTime? from, DateTime? to)
        {
            var businessDateFrom = System.DateTime.Now.PrevBusinessDate();
            var businessDateTo = System.DateTime.Now.PrevBusinessDate();

            if (from.HasValue)
            {
                businessDateFrom = from.Value.Date;
            }

            if (to.HasValue)
            {
                businessDateTo = to.Value.Date;
            }

            var sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParams = new List<SqlParameter>();
            sqlParams.Add(new SqlParameter("@From", businessDateFrom));
            sqlParams.Add(new SqlParameter("@Now", businessDateTo));
            var dataTable = sqlHelper.GetDataTable("HistoricPerformance", CommandType.StoredProcedure, sqlParams.ToArray());
            var list = new List<PnlReturn>();

            foreach (DataRow row in dataTable.Rows)
            {
                list.Add(Helper.ToObject<PnlReturn>(row));
            }

            return list;
        }

    }

    public class PnlReturnsCalculator
    {
        private void InitializeQuarterDictionary(Dictionary<int, int> quarterCount)
        {
            quarterCount.Add(1, 0);
            quarterCount.Add(4, 0);
            quarterCount.Add(7, 0);
            quarterCount.Add(10, 0);
        }

        /// <summary>
        /// I already have a populated database, and as a result I should be able to have the system
        /// recalculate when I finish the EOD / SOD process
        /// </summary>
        /// <param name="performanceRecords"></param>
        /// <returns></returns>
        public List<PnlReturn> Calculate(List<PnlReturn> performanceRecords)
        {
            var sorted = performanceRecords.OrderBy(x => x.AsOf).ToList();

            var groupedBy = sorted.GroupBy(x => x.Fund).Select(x => new
            {
                Fund = x.Key,
                YearlyData = x.ToList().GroupBy(y => y.AsOf.Year).Select(z => new
                {
                    Year = z.Key,
                    MonthlyData = z.ToList().GroupBy(w => w.AsOf.Month)
                })
            }).ToList();

            //var groupedByYear = sorted.GroupBy(x => x.PerformanceDate.Year).ToList();

            PnlReturn priorData = null;
            int monthIndex = 0;
            int totalMonthlyRecords = 0;
            PnlReturn priorDataYearlyPnl = priorData;
            PnlReturn priorDataQuarterlyPnl = priorData;
            PnlReturn priorDataInceptionPnl = priorData;

            PnlReturn priorDataForQuarter = priorData;
            PnlReturn priorDataForYear = priorData;
            PnlReturn priorDataForInception = priorData;

            var quarterCount = new Dictionary<int, int>();
            InitializeQuarterDictionary(quarterCount);

            foreach (var portfolio in groupedBy)
            {
                foreach (var year in portfolio.YearlyData)
                {
                    foreach (var month in year.MonthlyData)
                    {
                        totalMonthlyRecords = month.Count() - 1;
                        monthIndex = 0;
                        foreach (var item in month)
                        {
                            if (!item.ExistingRecord)
                            {
                                if (priorData != null)
                                {
                                    item.MtdPnlPer = CalculateDailyMTD(item, priorData);
                                    item.MtdPnl = CalculateDailyPnl(item.DayPnl, priorData.MtdPnl);
                                }
                                else
                                {
                                    item.MtdPnlPer = item.DayPnlPer;
                                    item.MtdPnl = item.DayPnl;
                                }

                                if (priorDataForYear != null)
                                {
                                    item.YtdPnlPer = CalculateDailyYTD(item, priorDataForYear);
                                }
                                else
                                {
                                    item.YtdPnlPer = item.MtdPnlPer;
                                }

                                if (priorDataForInception != null)
                                {
                                    item.ItdPnlPer = CalculateDailyITD(item, priorDataForInception);
                                }
                                else
                                {
                                    item.ItdPnlPer = item.MtdPnlPer;
                                }

                                if (priorDataForQuarter != null)
                                {
                                    if (CheckForBeginningOfQuarter(item.AsOf))
                                    {
                                        item.QtdPnlPer = item.MtdPnlPer;
                                    }
                                    else
                                    {
                                        if (IfDatesLieInTheSameQuarter(priorDataForQuarter.AsOf, item.AsOf))
                                        {
                                            item.QtdPnlPer = CalculateDailyQTD(item, priorDataForQuarter);
                                        }
                                        else
                                        {
                                            item.QtdPnlPer = item.MtdPnlPer;
                                        }
                                    }
                                }
                                else
                                {
                                    item.QtdPnlPer = item.MtdPnlPer;
                                }


                                //Calculations for QTD,YTD,ITD values.

                                if (priorDataQuarterlyPnl != null)
                                {
                                    if (CheckForBeginningOfQuarter(item.AsOf))
                                    {
                                        item.QtdPnl = item.MtdPnl;
                                    }
                                    else
                                    {
                                        item.QtdPnl = CalculateDailyPnl(item.DayPnl, priorDataQuarterlyPnl.QtdPnl);
                                    }
                                }
                                else
                                {
                                    item.QtdPnl = item.MtdPnl;
                                }

                                if (priorDataYearlyPnl != null)
                                {
                                    item.YtdPnl = CalculateDailyPnl(item.DayPnl, priorDataYearlyPnl.YtdPnl);
                                }
                                else
                                {
                                    item.YtdPnl = item.MtdPnl;
                                }

                                if (priorDataInceptionPnl != null)
                                {
                                    item.ItdPnl = CalculateDailyPnl(item.DayPnl, priorDataInceptionPnl.ItdPnl);
                                }
                                else
                                {
                                    item.ItdPnl = item.MtdPnl;
                                }
                            }

                            priorData = item;
                            priorDataQuarterlyPnl = item;
                            priorDataYearlyPnl = item;
                            priorDataInceptionPnl = item;
                            //We have reached the end of the month. At this point, the calculated value of MTD represents MTD returns for that month. 
                            //We will use this value of MTD as reference for QTD,YTD,ITD percentage/returns calculation.
                            if (monthIndex == totalMonthlyRecords)
                            {
                                priorDataForYear = item;
                                priorDataForQuarter = item;
                                priorDataForInception = item;
                            }
                            
                            monthIndex++;
                        }

                        priorData = null;
                    }

                    priorDataForYear = null;
                    priorDataYearlyPnl = null;
                    priorDataQuarterlyPnl = null;
                    priorDataForQuarter = null;
                }

                priorDataForInception = null;
                priorDataForQuarter = null;
                priorDataInceptionPnl = null;
                priorDataQuarterlyPnl = null;
            }

            return sorted.OrderByDescending(i => i.AsOf).ToList();
        }

        public decimal CalculateDailyITD(PnlReturn current, PnlReturn prior)
        {
            var convertedPriorYTD = prior.ItdPnlPer.Value + 1;
            var convertedCurrentMTD = current.MtdPnlPer.HasValue ? current.MtdPnlPer.Value + 1 : 1;
            //return (convertedPriorYTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateDailyMTD(PnlReturn current, PnlReturn prior)
        {
            var convertedPriorDaily = prior.MtdPnlPer.Value + 1;
            var convertedCurrentDaily = current.DayPnlPer.HasValue ? current.DayPnlPer.Value + 1 : 1;
            return Math.Round((convertedPriorDaily * convertedCurrentDaily) - 1, 16);
        }
        public decimal CalculateDailyPnl(decimal? current, decimal? prior)
        {
            var currentMeasure = current ?? 0;
            var priorMeasure = prior ?? 0;
            return currentMeasure + priorMeasure;
        }

        private bool CheckForBeginningOfQuarter(DateTime date)
        {
            if (date.Month == 1 || date.Month == 4 || date.Month == 7 || date.Month == 10)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private bool IfDatesLieInTheSameQuarter(DateTime priorDate, DateTime currentDate)
        {
            int startOfQuarter = priorDate.Month;
            int endOfQuarter = GetRelevantQuarter(startOfQuarter) + 2;
            return (currentDate.Month >= startOfQuarter && currentDate.Month <= endOfQuarter);
        }

        private int GetRelevantQuarter(int month)
        {
            if (month == 1 || month == 2 || month == 3)
            {
                return 1;
            }
            else if (month == 4 || month == 5 || month == 6)
            {
                return 4;
            }
            else if (month == 7 || month == 8 || month == 9)
            {
                return 7;
            }
            else
            {
                return 10;
            }
        }
        public decimal CalculateDailyQTD(PnlReturn current, PnlReturn prior)
        {
            var convertedPriorQTD = prior.QtdPnlPer.Value + 1;
            var convertedCurrentMTD = current.MtdPnlPer.HasValue ? current.MtdPnlPer.Value + 1 : 1;
            return Math.Round((convertedPriorQTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateDailyYTD(PnlReturn current, PnlReturn prior)
        {
            var convertedPriorYTD = prior.YtdPnlPer.Value + 1;
            var convertedCurrentMTD = current.MtdPnlPer.HasValue ? current.MtdPnlPer.Value + 1 : 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }
    }
}
