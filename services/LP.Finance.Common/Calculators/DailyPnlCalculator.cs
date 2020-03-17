using LP.Finance.Common.Model;
using LP.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Calculators
{
    public class DailyPnlCalculator
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
        public object CalculateDailyPerformance(List<DailyPnL> performanceRecords)
        {
            var sorted = performanceRecords.OrderBy(x => x.BusinessDate).ThenBy(x => x.RowId).ToList();

            var groupedByPortfolio = sorted.GroupBy(x => x.PortFolio).Select(x => new
            {
                Portfolio = x.Key,
                YearlyData = x.ToList().GroupBy(y => y.BusinessDate.Year).Select(z => new
                {
                    Year = z.Key,
                    MonthlyData = z.ToList().GroupBy(w => w.BusinessDate.Month)
                })
            }).ToList();

            //var groupedByYear = sorted.GroupBy(x => x.PerformanceDate.Year).ToList();

            DailyPnL priorData = null;
            int monthIndex = 0;
            int totalMonthlyRecords = 0;
            DailyPnL priorDataYearlyPnl = priorData;
            DailyPnL priorDataQuarterlyPnl = priorData;
            DailyPnL priorDataInceptionPnl = priorData;

            DailyPnL priorDataForQuarter = priorData;
            DailyPnL priorDataForYear = priorData;
            DailyPnL priorDataForInception = priorData;

            Dictionary<int, int> quarterCount = new Dictionary<int, int>();
            InitializeQuarterDictionary(quarterCount);

            foreach (var portfolio in groupedByPortfolio)
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
                                    item.MTDPercentageReturn = CalculateDailyMTD(item, priorData);
                                    item.MTDPnL = CalculateDailyPnl(item.Day, priorData.MTDPnL);
                                }
                                else
                                {
                                    item.MTDPercentageReturn = item.DailyPercentageReturn;
                                    item.MTDPnL = item.Day;
                                }

                                if (priorDataForYear != null)
                                {
                                    item.YTDPercentageReturn = CalculateDailyYTD(item, priorDataForYear);
                                }
                                else
                                {
                                    item.YTDPercentageReturn = item.MTDPercentageReturn;
                                }

                                if (priorDataForInception != null)
                                {
                                    item.ITDPercentageReturn = CalculateDailyITD(item, priorDataForInception);
                                }
                                else
                                {
                                    item.ITDPercentageReturn = item.MTDPercentageReturn;
                                }

                                if (priorDataForQuarter != null)
                                {
                                    if (CheckForBeginningOfQuarter(item.BusinessDate))
                                    {
                                        item.QTDPercentageReturn = item.MTDPercentageReturn;
                                    }
                                    else
                                    {
                                        if (IfDatesLieInTheSameQuarter(priorDataForQuarter.BusinessDate, item.BusinessDate))
                                        {
                                            item.QTDPercentageReturn = CalculateDailyQTD(item, priorDataForQuarter);
                                        }
                                        else
                                        {
                                            item.QTDPercentageReturn = item.MTDPercentageReturn;
                                        }
                                    }
                                }
                                else
                                {
                                    item.QTDPercentageReturn = item.MTDPercentageReturn;
                                }


                                //Calculations for QTD,YTD,ITD values.

                                if (priorDataQuarterlyPnl != null)
                                {
                                    if (CheckForBeginningOfQuarter(item.BusinessDate))
                                    {
                                        item.QTDPnL = item.MTDPnL;
                                    }
                                    else
                                    {
                                        item.QTDPnL = CalculateDailyPnl(item.Day, priorDataQuarterlyPnl.QTDPnL);
                                    }
                                }
                                else
                                {
                                    item.QTDPnL = item.MTDPnL;
                                }

                                if (priorDataYearlyPnl != null)
                                {
                                    item.YTDPnL = CalculateDailyPnl(item.Day, priorDataYearlyPnl.YTDPnL);
                                }
                                else
                                {
                                    item.YTDPnL = item.MTDPnL;
                                }

                                if (priorDataInceptionPnl != null)
                                {
                                    item.ITDPnL = CalculateDailyPnl(item.Day, priorDataInceptionPnl.ITDPnL);
                                }
                                else
                                {
                                    item.ITDPnL = item.MTDPnL;
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

            return WebApi.Wrap(true, sorted, HttpStatusCode.OK, "Performance calculated successfully");
        }

        public decimal CalculateDailyITD(DailyPnL current, DailyPnL prior)
        {
            var convertedPriorYTD = prior.ITDPercentageReturn.Value + 1;
            var convertedCurrentMTD = current.MTDPercentageReturn.HasValue ? current.MTDPercentageReturn.Value + 1 : 1;
            //return (convertedPriorYTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateDailyMTD(DailyPnL current, DailyPnL prior)
        {
            var convertedPriorDaily = prior.MTDPercentageReturn.Value + 1;
            var convertedCurrentDaily = current.DailyPercentageReturn.HasValue ? current.DailyPercentageReturn.Value + 1 : 1;
            return Math.Round((convertedPriorDaily * convertedCurrentDaily) - 1, 16);
        }
        public decimal CalculateDailyPnl(decimal? current, decimal? prior)
        {
            var currentMeasure = current.HasValue ? current.Value : 0;
            var priorMeasure = prior.HasValue ? prior.Value : 0;
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
        public decimal CalculateDailyQTD(DailyPnL current, DailyPnL prior)
        {
            var convertedPriorQTD = prior.QTDPercentageReturn.Value + 1;
            var convertedCurrentMTD = current.MTDPercentageReturn.HasValue ? current.MTDPercentageReturn.Value + 1 : 1;
            //return (convertedPriorQTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorQTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateDailyYTD(DailyPnL current, DailyPnL prior)
        {
            var convertedPriorYTD = prior.YTDPercentageReturn.Value + 1;
            var convertedCurrentMTD = current.MTDPercentageReturn.HasValue ? current.MTDPercentageReturn.Value + 1 : 1;
            //return (convertedPriorYTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }
    }
}
