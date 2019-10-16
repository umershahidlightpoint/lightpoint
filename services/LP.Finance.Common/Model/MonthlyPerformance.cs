using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Model
{
    public class MonthlyPerformance : IDbModel
    {
        public int Id { get; set; }
        public decimal? MonthEndNav { get; set; }
        public decimal? StartOfMonthEstimateNav { get; set; }
        public bool Estimated { get; set; }
        public decimal? Performance { get; set; }
        public decimal? MTD { get; set; }
        public string Fund { get; set; }
        public string PortFolio { get; set; }
        public DateTime PerformanceDate { get; set; }
        public decimal YTDNetPerformance { get; set; }
        public decimal QTD { get; set; }
        public decimal YTD { get; set; }
        public decimal ITD { get; set; }

        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString);
            localconnection.Open();
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 created_date, last_updated_date, created_by, performance_date, fund,portfolio, monthly_end_nav, performance, mtd, ytd_net_performance, qtd_net_perc, ytd_net_perc,  itd_net_perc, estimated FROM monthly_performance", localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

        public void PopulateRow(DataRow row)
        {
            row["created_date"] = DateTime.UtcNow;
            row["last_updated_date"] = DateTime.UtcNow;
            row["created_by"] = "John Smith";
            row["performance_date"] = this.PerformanceDate;
            row["fund"] = this.Fund;
            row["portfolio"] = this.PortFolio;
            row["monthly_end_nav"] = this.MonthEndNav;
            row["performance"] = this.Performance;
            row["mtd"] = this.MTD;
            row["ytd_net_performance"] = this.YTDNetPerformance;
            row["qtd_net_perc"] = this.QTD;
            row["ytd_net_perc"] = this.YTD;
            row["itd_net_perc"] = this.ITD;
            row["estimated"] = this.Estimated;
        }
    }


}
