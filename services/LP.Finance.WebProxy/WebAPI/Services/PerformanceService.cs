using LP.Finance.Common;
using Newtonsoft.Json;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
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
    }
}
