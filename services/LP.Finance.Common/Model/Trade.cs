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
    public class Trade : IDbModel
    {
        public string LPOrderId { get; set; }
        public string AccrualId { get; set; }
        public string Action { get; set; }
        public string Symbol { get; set; }
        public string Side { get; set; }
        public double Quantity { get; set; }
        public string TimeInForce { get; set; }
        public string OrderType { get; set; }
        public string SecurityType { get; set; }
        public string BloombergCode { get; set; }
        public string EzeTicker { get; set; }
        public string SecurityCode { get; set; }
        public string CustodianCode { get; set; }
        public string ExecutionBroker { get; set; }
        public string TradeId { get; set; }
        public int SecurityId { get; set; }
        public string Fund { get; set; }
        public string PMCode { get; set; }
        public string PortfolioCode { get; set; }
        public string Trader { get; set; }
        public string TradeCurrency { get; set; }
        public string TradePrice { get; set; }
        public DateTime TradeDate { get; set; }
        public string SettleCurrency { get; set; }
        public double SettlePrice { get; set; }
        public DateTime SettleDate { get; set; }
        public string TradeType { get; set; }
        public string TransactionCategory { get; set; }
        public string TransactionType { get; set; }
        public string ParentOrderId { get; set; }
        public string ParentSymbol { get; set; }
        public string Status { get; set; }
        public double NetMoney { get; set; }
        public double Commission { get; set; }
        public double Fees { get; set; }
        public double SettleNetMoney { get; set; }
        public double NetPrice { get; set; }
        public double SettleNetPrice { get; set; }
        public string OrderSource { get; set; }
        public DateTime UpdatedOn { get; set; }
        public double LocalNetNotional { get; set; }
        public bool IsManual { get; set; }


        public void PopulateRow(DataRow row)
        {
            row["LPOrderId"] = string.IsNullOrEmpty(this.LPOrderId) ? DBNull.Value : (object)this.LPOrderId;
            row["AccrualId"] = string.IsNullOrEmpty(this.AccrualId) ? DBNull.Value : (object)this.AccrualId;
            row["Action"] = string.IsNullOrEmpty(this.Action) ? DBNull.Value : (object)this.Action;
            row["Symbol"] = this.Symbol;
            row["Side"] = this.Side;
            row["Quantity"] = this.Quantity;
            row["TimeInForce"] = string.IsNullOrEmpty(this.TimeInForce) ? DBNull.Value : (object)this.TimeInForce;
            row["OrderType"] = this.OrderType;
            row["SecurityType"] = this.SecurityType;
            row["BloombergCode"] = this.BloombergCode;
            row["EzeTicker"] = string.IsNullOrEmpty(this.EzeTicker) ? DBNull.Value : (object)this.EzeTicker;
            row["SecurityCode"] = string.IsNullOrEmpty(this.SecurityCode) ? DBNull.Value : (object)this.SecurityCode;
            row["CustodianCode"] = this.CustodianCode;
            row["ExecutionBroker"] = this.ExecutionBroker;
            row["TradeId"] = string.IsNullOrEmpty(this.TradeId) ? DBNull.Value : (object)this.TradeId;
            row["SecurityId"] = this.SecurityId;
            row["Fund"] = this.Fund;
            row["PMCode"] = this.PMCode;
            row["PortfolioCode"] = this.PortfolioCode;
            row["Trader"] = this.Trader;
            row["TradeCurrency"] = this.TradeCurrency;
            row["TradePrice"] = this.TradePrice;
            row["TradeDate"] = this.TradeDate;
            row["SettleCurrency"] = this.SettleCurrency;
            row["SettlePrice"] = this.SettlePrice;
            row["SettleDate"] = this.SettleDate;
            row["TradeType"] = this.TradeType;
            row["TransactionCategory"] = this.TransactionCategory;
            row["TransactionType"] = string.IsNullOrEmpty(this.TransactionType) ? DBNull.Value : (object)this.TransactionType;
            row["ParentOrderId"] = string.IsNullOrEmpty(this.ParentOrderId) ? DBNull.Value : (object)this.ParentOrderId;
            row["ParentSymbol"] = this.ParentSymbol;
            row["Status"] = this.Status;
            row["NetMoney"] = this.NetMoney;
            row["Commission"] = this.Commission;
            row["Fees"] = this.Fees;
            row["SettleNetMoney"] = this.SettleNetMoney;
            row["NetPrice"] = this.NetPrice;
            row["SettleNetPrice"] = this.SettleNetPrice;
            row["OrderSource"] = this.OrderSource;
            row["UpdatedOn"] = this.UpdatedOn;
            row["LocalNetNotional"] = this.LocalNetNotional;
            row["IsManual"] = this.IsManual;

        }


        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString);
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
                      ,[IsManual]
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
