using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Model
{
    public class Trade : IDbModel
    {
        public string LPOrderId { get; set; }
        public string AccrualId { get; set; }
        public string Action { get; set; }
        public string Symbol { get; set; }
        public string Side { get; set; }
        public double? Quantity { get; set; }
        public string TimeInForce { get; set; }
        public string OrderType { get; set; }
        public string SecurityType { get; set; }
        public string BloombergCode { get; set; }
        public string EzeTicker { get; set; }
        public string SecurityCode { get; set; }
        public string CustodianCode { get; set; }
        public string ExecutionBroker { get; set; }
        public string TradeId { get; set; }
        public int? SecurityId { get; set; }
        public string Fund { get; set; }
        public string PMCode { get; set; }
        public string PortfolioCode { get; set; }
        public string Trader { get; set; }
        public string TradeCurrency { get; set; }
        public double? TradePrice { get; set; }
        public DateTime? TradeDate { get; set; }
        public string SettleCurrency { get; set; }
        public double? SettlePrice { get; set; }
        public DateTime? SettleDate { get; set; }
        public string TradeType { get; set; }
        public string TransactionCategory { get; set; }
        public string TransactionType { get; set; }
        public string ParentOrderId { get; set; }
        public string ParentSymbol { get; set; }
        public string Status { get; set; }
        public double? NetMoney { get; set; }
        public double? Commission { get; set; }
        public double? Fees { get; set; }
        public double? SettleNetMoney { get; set; }
        public double? NetPrice { get; set; }
        public double? SettleNetPrice { get; set; }
        public string OrderSource { get; set; }
        public DateTime? UpdatedOn { get; set; }
        public double? LocalNetNotional { get; set; }
        public bool IsUploadInValid { get; set; }
        public string UploadException { get; set; }



        public void PopulateRow(DataRow row)
        {
            row["LPOrderId"] = string.IsNullOrEmpty(this.LPOrderId) ? DBNull.Value : (object)this.LPOrderId;
            row["AccrualId"] = string.IsNullOrEmpty(this.AccrualId) ? DBNull.Value : (object)this.AccrualId;
            row["Action"] = string.IsNullOrEmpty(this.Action) ? DBNull.Value : (object)this.Action;
            row["Symbol"] = string.IsNullOrEmpty(this.Symbol) ? DBNull.Value : (object)this.Symbol;
            row["Side"] = string.IsNullOrEmpty(this.Side) ? DBNull.Value : (object)this.Side;
            row["Quantity"] = !this.Quantity.HasValue ? DBNull.Value : (object)this.Quantity;
            row["TimeInForce"] = string.IsNullOrEmpty(this.TimeInForce) ? DBNull.Value : (object)this.TimeInForce;
            row["OrderType"] = string.IsNullOrEmpty(this.OrderType) ? DBNull.Value : (object)this.OrderType;
            row["SecurityType"] = string.IsNullOrEmpty(this.SecurityType) ? DBNull.Value : (object)this.SecurityType;
            row["BloombergCode"] = string.IsNullOrEmpty(this.BloombergCode) ? DBNull.Value : (object)this.BloombergCode;
            row["EzeTicker"] = string.IsNullOrEmpty(this.EzeTicker) ? DBNull.Value : (object)this.EzeTicker;
            row["SecurityCode"] = string.IsNullOrEmpty(this.SecurityCode) ? DBNull.Value : (object)this.SecurityCode;
            row["CustodianCode"] = string.IsNullOrEmpty(this.CustodianCode) ? DBNull.Value : (object)this.CustodianCode;
            row["ExecutionBroker"] = string.IsNullOrEmpty(this.ExecutionBroker) ? DBNull.Value : (object)this.CustodianCode;
            row["TradeId"] = string.IsNullOrEmpty(this.TradeId) ? DBNull.Value : (object)this.TradeId;
            row["SecurityId"] = !this.SecurityId.HasValue ? DBNull.Value : (object)this.SecurityId;
            row["Fund"] = string.IsNullOrEmpty(this.Fund) ? DBNull.Value : (object)this.Fund;
            row["PMCode"] = string.IsNullOrEmpty(this.PMCode) ? DBNull.Value : (object)this.PMCode;
            row["PortfolioCode"] = string.IsNullOrEmpty(this.PortfolioCode) ? DBNull.Value : (object)this.PortfolioCode;
            row["Trader"] = string.IsNullOrEmpty(this.Trader) ? DBNull.Value : (object)this.Trader;
            row["TradeCurrency"] = string.IsNullOrEmpty(this.TradeCurrency) ? DBNull.Value : (object)this.TradeCurrency;
            row["TradePrice"] = !this.TradePrice.HasValue ? DBNull.Value : (object)this.TradePrice;
            row["TradeDate"] = !this.TradeDate.HasValue ? DBNull.Value : (object)this.TradeDate;
            row["SettleCurrency"] = string.IsNullOrEmpty(this.SettleCurrency) ? DBNull.Value : (object)this.SettleCurrency;
            row["SettlePrice"] = !this.SettlePrice.HasValue ? DBNull.Value : (object)this.SettlePrice;
            row["SettleDate"] = !this.SettleDate.HasValue ? DBNull.Value : (object)this.SettleDate;
            row["TradeType"] = string.IsNullOrEmpty(this.TradeType) ? DBNull.Value : (object)this.TradeType;
            row["TransactionCategory"] = string.IsNullOrEmpty(this.TransactionCategory) ? DBNull.Value : (object)this.TransactionCategory;
            row["TransactionType"] = string.IsNullOrEmpty(this.TransactionType) ? DBNull.Value : (object)this.TransactionType;
            row["ParentOrderId"] = string.IsNullOrEmpty(this.ParentOrderId) ? DBNull.Value : (object)this.ParentOrderId;
            row["ParentSymbol"] = string.IsNullOrEmpty(this.ParentSymbol) ? DBNull.Value : (object)this.ParentSymbol;
            row["Status"] = string.IsNullOrEmpty(this.Status) ? DBNull.Value : (object)this.Status;
            row["NetMoney"] = !this.NetMoney.HasValue ? DBNull.Value : (object)this.NetMoney;
            row["Commission"] = !this.Commission.HasValue ? DBNull.Value : (object)this.Commission;
            row["Fees"] = !this.Fees.HasValue ? DBNull.Value : (object)this.Fees;
            row["SettleNetMoney"] = !this.SettleNetMoney.HasValue ? DBNull.Value : (object)this.SettleNetMoney;
            row["NetPrice"] = !this.NetPrice.HasValue ? DBNull.Value : (object)this.NetPrice;
            row["SettleNetPrice"] = !this.SettleNetPrice.HasValue ? DBNull.Value : (object)this.SettleNetPrice;
            row["OrderSource"] = string.IsNullOrEmpty(this.OrderSource) ? DBNull.Value : (object)this.OrderSource;
            row["UpdatedOn"] = !this.UpdatedOn.HasValue ? DBNull.Value : (object)this.UpdatedOn;
            row["LocalNetNotional"] = !this.LocalNetNotional.HasValue ? DBNull.Value : (object)this.LocalNetNotional;
        }


        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString +";Password=ggtuser");
            localconnection.Open();
            var query = $@"SELECT [LPOrderId]
                      ,[AccrualId]
                      ,[Action]
                      ,[Symbol]
                      ,[Side]
                      ,[Quantity]
                      ,[TimeInForce]
                      ,[OrderType]
                      ,[SecurityType]
                      ,[BloombergCode]
                      ,[EzeTicker]
                      ,[SecurityCode]
                      ,[CustodianCode]
                      ,[ExecutionBroker]
                      ,[TradeId]
                      ,[SecurityId]
                      ,[Fund]
                      ,[PMCode]
                      ,[PortfolioCode]
                      ,[Trader]
                      ,[TradeCurrency]
                      ,[TradePrice]
                      ,[TradeDate]
                      ,[SettleCurrency]
                      ,[SettlePrice]
                      ,[SettleDate]
                      ,[TradeType]
                      ,[TransactionCategory]
                      ,[TransactionType]
                      ,[ParentOrderId]
                      ,[ParentSymbol]
                      ,[Status]
                      ,[NetMoney]
                      ,[Commission]
                      ,[Fees]
                      ,[SettleNetMoney]
                      ,[NetPrice]
                      ,[SettleNetPrice]
                      ,[OrderSource]
                      ,[UpdatedOn]
                      ,[LocalNetNotional]
                      ,[TradeTime]
                  FROM[dbo].[current_trade_state] with(nolock)";

            using (var adapter = new SqlDataAdapter(query, localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

    }
}
