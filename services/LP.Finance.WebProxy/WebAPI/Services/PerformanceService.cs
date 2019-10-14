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
            var query = $@"select id,entry_date,fund,portfolio,monthly_end_nav,performance,mtd,ytd_net_performance,qtd_net_perc,ytd_net_perc,itd_net_perc from monthly_performance";
            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);
            return Utils.GridWrap(json);
        }

        public object AddMonthlyPerformance(List<MonthlyPerformance> obj)
        {
            var sorted = obj.OrderBy(x => x.Performance_Date).ToList();
            var initialPerformance = sorted.FirstOrDefault();
            //Get prior date as reference point.
            var priorPerformanceDate = initialPerformance.Performance_Date.AddMonths(-1);

            var query = $@"select id,entry_date,fund,portfolio,monthly_end_nav,performance,mtd,ytd_net_performance,qtd_net_perc,ytd_net_perc,itd_net_perc,estimated from monthly_performance where entry_date = @entryDate";
            List<SqlParameter> priorPerformanceParams = new List<SqlParameter>()
                {
                   new SqlParameter("entryDate", priorPerformanceDate)
                };
            var priorPerformanceData = sqlHelper.GetDataTable(query, CommandType.Text, priorPerformanceParams.ToArray());
            if(priorPerformanceData.Rows.Count > 0)
            {
                //Reference point exists.
            }
            else
            {
                //Reference point does not exist.
            }

            foreach (var item in obj)
            {
                if (item.MonthEndNav.HasValue)
                {

                }
                if (item.MTD.HasValue)
                {

                    //For QTD, determine the month offset of this quarter. If it is the beginning of the quarter for e.g (April for Q2), value will remain the same. Otherwise, calculated value will depend on the previous result.
                    CalculateQTD();

                    //For YTD, determine the month offset of this year. If it is the beginning of the year for e.g. (January), value will remain the same. Otherwise, calculated value will depend on the previous result.
                    CalculateYTD();

                    //For ITD, value will always be calculated based on the previous result.
                    CalculateITD();
                }
                if (item.Performance.HasValue)
                {
                    //For YTD, determine the month offset of this year. If it is the beginning of the year for e.g. (January), value will remain the same. Otherwise, calculated value will depend on the previous result.
                    CalculateYTDPerformance();
                }

            }

            return new { };
        }

        public decimal CalculateYTDPerformance()
        {
            throw new NotImplementedException();
        }

        public decimal CalculateQTD()
        {
            throw new NotImplementedException();

        }

        public decimal CalculateYTD()
        {
            throw new NotImplementedException();

        }

        public decimal CalculateITD()
        {
            throw new NotImplementedException();

        }
    }
}
