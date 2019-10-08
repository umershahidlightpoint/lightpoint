﻿using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Models
{
    public class TaxLot : IDbAction, IDbModel
    {
        public string OpeningLotId { get; set; }
        public string ClosingLotId { get; set; }
        public DateTime BusinessDate { get; set; }
        public double Quantity { get; set; }
        public double TradePrice { get; set; }
        public double CostBasis { get; set; }


        // Get a list of Journal Entries for this trade
        public static KeyValuePair<string, SqlParameter[]> List(string orderId)
        {
            var sql = @"select * from tax_lot where source=@source";

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
                var sql = @"insert into tax_lot
                            (closing_lot_id, open_lot_id, quantity, business_date, cost_basis, trade_price) 
                            values 
                            (@closing_lot_id, @open_lot_id, @quantity, @business_date, @cost_basis, @trade_price)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("closing_lot_id", ClosingLotId),
                    new SqlParameter("open_lot_id", OpeningLotId),
                    new SqlParameter("quantity", Quantity),
                    new SqlParameter("business_date", BusinessDate),
                    new SqlParameter("cost_basis", CostBasis),
                    new SqlParameter("trade_price", TradePrice),
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update
        {
            get
            {
                var sql = "update journal set a=b, c=d where id = @id";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter()
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
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 cost_basis, trade_price, open_lot_id, closing_lot_id, quantity, buisness_date FROM tax_lot", localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;

        }
        public void PopulateRow(DataRow row)
        {
            row["trade_price"] = this.TradePrice;
            row["cost_basis"] = this.CostBasis;
            row["open_lot_id"] = this.OpeningLotId;
            row["closing_lot_id"] = this.ClosingLotId;
            row["quantity"] = this.Quantity;
            row["business_date"] = this.BusinessDate;
        }
    }

}
