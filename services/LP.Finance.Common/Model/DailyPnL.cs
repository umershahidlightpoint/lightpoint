using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using LP.Shared.Sql;

namespace LP.Finance.Common.Model
{
    public class DailyPnL : IDbModel
    {
        public DailyPnL(DataRow row)
        {
            this.Id = Convert.ToInt32(row["id"]);
            this.CreatedBy = row["created_by"].ToString();
            this.CreatedDate = Convert.ToDateTime(row["created_date"]);
            this.LastUpdatedBy = row["last_updated_by"].ToString();
            if (row["last_updated_date"] != DBNull.Value)
                this.LastUpdatedDate = Convert.ToDateTime(row["last_updated_date"]);

            this.BusinessDate = Convert.ToDateTime(row["business_date"]);
            this.PortFolio = row["portfolio"].ToString();
            this.Fund = row["fund"].ToString();
            this.TradePnL = Convert.ToDecimal(row["trade_pnl"]);
            this.Day = Convert.ToDecimal(row["day"]);
            this.DailyPercentageReturn = Convert.ToDecimal(row["daily_percentage_return"]);
            this.LongPnL = Convert.ToDecimal(row["long_pnl"]);
            this.LongPercentageChange = Convert.ToDecimal(row["long_percentage_change"]);
            this.ShortPnL = Convert.ToDecimal(row["short_pnl"]);
            this.ShortPercentageChange = Convert.ToDecimal(row["short_percentage_change"]);
            this.LongExposure = Convert.ToDecimal(row["long_exposure"]);
            this.ShortExposure = Convert.ToDecimal(row["short_exposure"]);
            this.GrossExposure = Convert.ToDecimal(row["gross_exposure"]);
            this.NetExposure = Convert.ToDecimal(row["net_exposure"]);
            this.SixMdBetaNetExposure = Convert.ToDecimal(row["six_md_beta_net_exposure"]);
            this.TwoYwBetaNetExposure = Convert.ToDecimal(row["two_yw_beta_net_exposure"]);
            this.SixMdBetaShortExposure = Convert.ToDecimal(row["six_md_beta_short_exposure"]);
            this.NavMarket = Convert.ToDecimal(row["nav_market"]);
            this.DividendUSD = Convert.ToDecimal(row["dividend_usd"]);
            this.CommUSD = Convert.ToDecimal(row["comm_usd"]);
            this.FeeTaxesUSD = Convert.ToDecimal(row["fee_taxes_usd"]);


            this.FinancingUSD = Convert.ToDecimal(row["financing_usd"]);
            this.OtherUSD = Convert.ToDecimal(row["other_usd"]);
            this.PnLPercentage = Convert.ToDecimal(row["pnl_percentage"]);
            this.MTDPercentageReturn = Convert.ToDecimal(row["mtd_percentage_return"]);
            this.QTDPercentageReturn = Convert.ToDecimal(row["qtd_percentage_return"]);
            this.YTDPercentageReturn = Convert.ToDecimal(row["ytd_percentage_return"]);
            this.ITDPercentageReturn = Convert.ToDecimal(row["itd_percentage_return"]);

            this.MTDPnL = Convert.ToDecimal(row["mtd_pnl"]);
            this.QTDPnL = Convert.ToDecimal(row["qtd_pnl"]);
            this.YTDPnL = Convert.ToDecimal(row["ytd_pnl"]);
            this.ITDPnL = Convert.ToDecimal(row["itd_pnl"]);

        }

        public DailyPnL()
        {
        }

        public DailyPnL(DateTime businessDate, string portfolio, string fund, decimal tradePnL, decimal day, decimal dailyPercentageReturn)
        {
            this.BusinessDate = businessDate;
            this.PortFolio = portfolio;
            this.Fund = fund;
            this.TradePnL = tradePnL;
            this.Day = day;
            this.DailyPercentageReturn = dailyPercentageReturn;
        }

        public int Id { get; set; }
        public int RowId { get; set; }
        public bool ExistingRecord { get; set; }
        public bool Modified { get; set; }
        public DateTime BusinessDate { get; set; }
        public string Fund { get; set; }
        public string PortFolio { get; set; }
        public decimal? TradePnL { get; set; }
        public decimal? Day { get; set; }
        public decimal? DailyPercentageReturn { get; set; }
        public decimal? LongPnL { get; set; }
        public decimal? LongPercentageChange { get; set; }
        public decimal? ShortPnL { get; set; }
        public decimal? ShortPercentageChange { get; set; }
        public decimal? LongExposure { get; set; }
        public decimal? ShortExposure { get; set; }
        public decimal? GrossExposure { get; set; }
        public decimal? NetExposure { get; set; }
        public decimal? SixMdBetaNetExposure { get; set; }
        public decimal? TwoYwBetaNetExposure { get; set; }
        public decimal? SixMdBetaShortExposure { get; set; }
        public decimal? NavMarket { get; set; }
        public decimal? DividendUSD { get; set; }
        public decimal? CommUSD { get; set; }
        public decimal? FeeTaxesUSD { get; set; }
        public decimal? FinancingUSD { get; set; }
        public decimal? OtherUSD { get; set; }
        public decimal? PnLPercentage { get; set; }
        public decimal? MTDPercentageReturn { get; set; }
        public decimal? QTDPercentageReturn { get; set; }
        public decimal? YTDPercentageReturn { get; set; }
        public decimal? ITDPercentageReturn { get; set; }
        public decimal? MTDPnL { get; set; }
        public decimal? QTDPnL { get; set; }
        public decimal? YTDPnL { get; set; }
        public decimal? ITDPnL { get; set; }
        public string CreatedBy { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime LastUpdatedDate { get; set; }

        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString + ";Password=ggtuser");
            localconnection.Open();
            //var query = $"SELECT TOP 0 created_by, created_date, last_updated_by, last_updated_date, business_date, portfolio, fund, trade_pnl,day, daily_percentage_return, long_pnl, long_percentage_change, short_pnl, short_percentage_change, long_exposure, short_exposure, gross_exposure, net_exposure, six_md_beta_net_exposure, two_yw_beta_net_exposure, six_md_beta_short_exposure, nav_market, dividend_usd, comm_usd, fee_taxes_usd, financing_usd, other_usd, pnl_percentage, mtd_percentage_return, qtd_percentage_return, ytd_percentage_return, itd_percentage_return, mtd_pnl, qtd_pnl, ytd_pnl, itd_pnl FROM unofficial_daily_pnl";
            var query = $"SELECT TOP 0 created_by, created_date, last_updated_by, last_updated_date, business_date, portfolio, fund , trade_pnl, day, daily_percentage_return, long_pnl, long_percentage_change, short_pnl, short_percentage_change, long_exposure, short_exposure, gross_exposure, net_exposure, six_md_beta_net_exposure, two_yw_beta_net_exposure, six_md_beta_short_exposure, nav_market, dividend_usd, comm_usd, fee_taxes_usd, financing_usd, other_usd, pnl_percentage, mtd_percentage_return, qtd_percentage_return, ytd_percentage_return, itd_percentage_return, mtd_pnl, qtd_pnl, ytd_pnl, itd_pnl FROM unofficial_daily_pnl";

            using (var adapter = new SqlDataAdapter(query, localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

        public void PopulateRow(DataRow row)
        {
            row["created_by"] = "system";
            row["created_date"] = DateTime.UtcNow;
            row["last_updated_by"] = "system";
            row["last_updated_date"] = DateTime.UtcNow;
            row["business_date"] = this.BusinessDate;
            row["portfolio"] = this.PortFolio;
            row["fund"] = this.Fund;
            row["trade_pnl"] = this.TradePnL;
            row["day"] = this.Day;
            row["daily_percentage_return"] = this.DailyPercentageReturn;
            row["long_pnl"] = this.LongPnL;
            row["long_percentage_change"] = this.LongPercentageChange;
            row["short_pnl"] = this.ShortPnL;
            row["short_percentage_change"] = this.ShortPercentageChange;
            row["long_exposure"] = this.LongExposure;
            row["short_exposure"] = this.ShortExposure;
            row["gross_exposure"] = this.GrossExposure;
            row["net_exposure"] = this.NetExposure;
            row["six_md_beta_net_exposure"] = this.SixMdBetaNetExposure;
            row["two_yw_beta_net_exposure"] = this.TwoYwBetaNetExposure;
            row["six_md_beta_short_exposure"] = this.SixMdBetaShortExposure;
            row["nav_market"] = this.NavMarket;
            row["dividend_usd"] = this.DividendUSD;
            row["comm_usd"] = this.CommUSD;
            row["fee_taxes_usd"] = this.FeeTaxesUSD;
            row["financing_usd"] = this.FinancingUSD;
            row["other_usd"] = this.OtherUSD;
            row["pnl_percentage"] = this.PnLPercentage;
            row["mtd_percentage_return"] = this.MTDPercentageReturn;
            row["qtd_percentage_return"] = this.QTDPercentageReturn;
            row["ytd_percentage_return"] = this.YTDPercentageReturn;
            row["itd_percentage_return"] = this.ITDPercentageReturn;
            row["mtd_pnl"] = this.MTDPnL;
            row["qtd_pnl"] = this.QTDPnL;
            row["ytd_pnl"] = this.YTDPnL;
            row["itd_pnl"] = this.ITDPnL;
        }

        public static List<DailyPnL> GetList(string connectionString)
        {
            var query = "SELECT id, created_by, created_date, last_updated_by, last_updated_date, business_date, portfolio, fund , trade_pnl, day, daily_percentage_return, long_pnl, long_percentage_change, short_pnl, short_percentage_change, long_exposure, short_exposure, gross_exposure, net_exposure, six_md_beta_net_exposure, two_yw_beta_net_exposure, six_md_beta_short_exposure, nav_market, dividend_usd, comm_usd, fee_taxes_usd, financing_usd, other_usd, pnl_percentage, mtd_percentage_return, qtd_percentage_return, ytd_percentage_return, itd_percentage_return, mtd_pnl, qtd_pnl, ytd_pnl, itd_pnl FROM unofficial_daily_pnl";
            var table = new DataTable();
            var connection = new SqlConnection(connectionString);
            connection.Open();

            using (var adapter = new SqlDataAdapter(query, connection))
            {
                adapter.Fill(table);
            };

            var list = new List<DailyPnL>();

            foreach( DataRow row in table.Rows)
            {
                list.Add(new DailyPnL(row));
            }

            return list;
        }
    }
}