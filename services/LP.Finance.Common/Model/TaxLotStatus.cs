using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using LP.Shared.Sql;

namespace LP.Finance.Common.Model
{
    public class TaxLotStatus : IDbAction, IDbModel
    {
        public static List<TaxLotStatus> All { get; private set; }

        private DateTime GeneratedOn { get; set; }

        public TaxLotStatus()
        {

        }

        private TaxLotStatus(SqlDataReader reader)
        {
            var offset = 0;

            this.Id = reader.GetFieldValue<int>(offset++);
            this.OpenId = reader.GetFieldValue<string>(offset++);
            this.Symbol = reader.GetFieldValue<string>(offset++);
            this.Side = reader.GetFieldValue<string>(offset++);
            this.Status = reader.GetFieldValue<string>(offset++);
            this.OriginalQuantity = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++));
            this.Quantity = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++));
            this.BusinessDate = reader.GetFieldValue<DateTime>(offset++);
            this.GeneratedOn = reader.GetFieldValue<DateTime>(offset++);
            this.TradeDate = reader.GetFieldValue<DateTime>(offset++);
            this.InvestmentAtCost = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++));
            this.FxRate = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++));
            this.Fund = reader.GetFieldValue<string>(offset++);
            this.TradePrice = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++));
        }

        public static TaxLotStatus[] Load(SqlConnection connection)
        {
            All = new List<TaxLotStatus>();

            var list = new List<TaxLotStatus>();

            var query = new SqlCommand("select * from tax_lot_status with(nolock)", connection);
            var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                try
                {
                    list.Add(new TaxLotStatus(reader));
                } catch ( Exception ex )
                {

                }
            }
            reader.Close();

            All.AddRange(list);

            return All.ToArray();
        }

        // Non Persisted
        public Transaction Trade { get; set; }

        // Persisted
        public int Id { get; set; }
        public string OpenId { get; set; }
        public string Fund { get; set; }
        public string Symbol { get; set; }
        public string Side { get; set; }
        public double InvestmentAtCost { get; set; }
        public DateTime TradeDate { get; set; }
        public DateTime BusinessDate { get; set; }
        public string Status { get; set; }
        public double Quantity { get; set; }
        public double OriginalQuantity { get; set; }
        public double FxRate { get; set; }
        public double TradePrice { get; set; }

        // Keeps track of the order of the Tax Lot's being relieved
        public int Order { get; set; }

        // Get a list of Journal Entries for this trade
        public static KeyValuePair<string, SqlParameter[]> List(string orderId)
        {
            var sql = @"select * from tax_lot_status where source=@source";

            var sqlParams = new SqlParameter[]
            {
                    new SqlParameter("source", orderId),
            };

            return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
        }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = @"insert into tax_lot_status 
                            (open_id, status, quantity, symbol, business_date, original_quantity) 
                            values 
                            (@open_id, @status, @quantity, @symbol, @business_date, @original_quantity)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("open_id", OpenId),
                    new SqlParameter("status", Status),
                    new SqlParameter("quantity", Quantity),
                    new SqlParameter("symbol", Symbol),
                    new SqlParameter("business_date", BusinessDate),
                    new SqlParameter("original_quantity", OriginalQuantity),

                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update
        {
            get
            {
                var sql = "update tax_lot_status set Quantity=@quantity, generated_on=GetDate() where id = @id";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("quantity", Quantity),
                    new SqlParameter("id", Id),
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();


        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString + ";Password=ggtuser");
            localconnection.Open();
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 open_id, status, side, quantity, symbol, business_date, original_quantity, trade_date, investment_at_cost, fx_rate, fund, trade_price FROM tax_lot_status", localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;

        }
        public void PopulateRow(DataRow row)
        {
            row["open_id"] = this.OpenId;
            row["symbol"] = this.Symbol;
            row["status"] = this.Status;
            row["side"] = this.Side;
            row["quantity"] = this.Quantity;
            row["original_quantity"] = this.OriginalQuantity;
            row["business_date"] = this.BusinessDate;
            row["trade_date"] = this.TradeDate;
            row["investment_at_cost"] = this.InvestmentAtCost;
            row["fx_rate"] = this.FxRate;
            row["fund"] = this.Fund;
            row["trade_price"] = this.TradePrice;
        }
    }

}