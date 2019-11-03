using LP.Finance.Common.Models;
using System;
using System.Data;
using System.Data.SqlClient;

namespace LP.Finance.Common.Model
{
    public class DailyPnL : IDbModel
    {
        public int Id { get; set; }
        public int RowId { get; set; }
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
        public string CreatedDate { get; set; }
        public string LastUpdatedDate { get; set; }

        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString);
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
            row["created_by"] = "John Smith";
            row["created_date"] = DateTime.UtcNow;
            row["last_updated_by"] = "John Smith";
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
    }
}