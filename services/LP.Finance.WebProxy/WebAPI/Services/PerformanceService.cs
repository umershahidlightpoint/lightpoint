using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class PerformanceService: IPerformanceService
    {
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        public SqlHelper sqlHelper = new SqlHelper(connectionString);
        public object GetMonthlyPerformance()
        {
            var query = $@"select id,performance_date,fund,portfolio,monthly_end_nav,performance,mtd,ytd_net_performance,qtd_net_perc,ytd_net_perc,itd_net_perc from monthly_performance";
            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);
            return Utils.GridWrap(json);
        }

        public object AddMonthlyPerformance(List<MonthlyPerformance> obj)
        {
            var sorted = obj.OrderBy(x => x.PerformanceDate).ToList();
            var initialPerformance = sorted.FirstOrDefault();

            var groupedByYear = sorted.GroupBy(x => x.PerformanceDate.Year).ToList();

            //Get prior date as reference point.
            var priorPerformanceDate = initialPerformance.PerformanceDate.AddMonths(-1);

            var query = $@"select id,performance_date,fund,portfolio,monthly_end_nav,performance_date,mtd,ytd_net_performance,qtd_net_perc,ytd_net_perc,itd_net_perc from monthly_performance where performance_date = @entryDate";
            List<SqlParameter> priorPerformanceParams = new List<SqlParameter>()
                {
                   new SqlParameter("entryDate", priorPerformanceDate)
                };
            var priorPerformanceData = sqlHelper.GetDataTable(query, CommandType.Text, priorPerformanceParams.ToArray());

            var priorData = priorPerformanceData.AsEnumerable().Select(x => new MonthlyPerformance
            {
                Id = Convert.ToInt32(x["id"]),
                PerformanceDate = Convert.ToDateTime(x["performance_date"]),
                MonthEndNav = Convert.ToDecimal(x["monthly_end_nav"]),
                YTDNetPerformance = Convert.ToDecimal(x["ytd_net_performance"]),
                Performance = Convert.ToDecimal(x["performance"]),
                ITD = Convert.ToDecimal(x["itd_net_perc"]),
                QTD = Convert.ToDecimal(x["qtd_net_perc"]),
                YTD = Convert.ToDecimal(x["ytd_net_perc"]),
                MTD = Convert.ToDecimal(x["mtd"])
            }).FirstOrDefault();

            MonthlyPerformance priorDataForInception = priorData;

            foreach (var group in groupedByYear)
            {
                foreach (var item in group)
                {
                    if (item.MonthEndNav.HasValue)
                    {
                        if (priorData != null)
                        {

                        }
                    }
                    if (item.MTD.HasValue)
                    {
                        if(priorData != null)
                        {
                            if(item.PerformanceDate.Month == 1 || item.PerformanceDate.Month == 4 || item.PerformanceDate.Month == 7 || item.PerformanceDate.Month == 10)
                            {
                                item.QTD = item.MTD.HasValue ? item.MTD.Value : 0;
                                //Beginning of quarter, hence value will be the same as MTD.
                            }
                            else
                            {
                                //For QTD, determine the month offset of this quarter. If it is the beginning of the quarter for e.g (April for Q2), value will remain the same. Otherwise, calculated value will depend on the previous result.
                                item.QTD = CalculateQTD(item, priorData);
                            }
                        }
                        else
                        {
                            item.QTD = item.MTD.HasValue ? item.MTD.Value : 0;
                        }

                        if (priorData != null)
                        {
                            // As the data is grouped by year, so for the first iteration, value will remain the same. Otherwise, calculated value will depend on the previous result.
                            item.YTD = CalculateYTD(item,priorData);
                        }
                        else
                        {
                            item.YTD = item.MTD.HasValue ? item.MTD.Value : 0;
                        }
                        if (priorDataForInception != null)
                        {
                            //For ITD, value will always be calculated based on the previous result.
                            item.ITD = CalculateITD(item, priorDataForInception);
                        }
                        else
                        {
                            item.ITD = item.MTD.HasValue ? item.MTD.Value : 0;
                        }
                    }
                    if (item.Performance.HasValue)
                    {
                        if (priorData != null)
                        {
                            //For YTD, determine the month offset of this year. If it is the beginning of the year for e.g. (January), value will remain the same. Otherwise, calculated value will depend on the previous result.
                            item.YTDNetPerformance = CalculateYTDPerformance(item, priorData);
                        }
                        else
                        {
                            item.YTDNetPerformance = item.Performance.HasValue ? item.Performance.Value : 0;
                        }
                    }
                    priorData = item;
                    priorDataForInception = item;
                }

                priorData = null;
            }

            return groupedByYear.SelectMany(x=> x.Select(y=> y).ToList());
        }

        public decimal CalculateYTDPerformance(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var currentPerformance = current.Performance.HasValue ? current.Performance.Value : 0;
            var priorYTDNetPerformance = prior.YTDNetPerformance;
            return currentPerformance + priorYTDNetPerformance;
        }

        public decimal CalculateQTD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorQTD = prior.QTD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;
            return (convertedPriorQTD * convertedCurrentMTD) - 1;

        }

        public decimal CalculateYTD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorYTD = prior.YTD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;
            return (convertedPriorYTD * convertedCurrentMTD) - 1;
        }

        public decimal CalculateITD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorYTD = prior.ITD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;
            return (convertedPriorYTD * convertedCurrentMTD) - 1;
        }
    }
}
