using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Models
{
    public class TaxLotStatus : IDbAction, IDbModel
    {
        public int Id { get; set; }

        public string OpenId { get; set; }
        public string Symbol { get; set; }
        public DateTime BusinessDate { get; set; }
        public string Status { get; set; }
        public double Quantity { get; set; }


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
                            (open_id, status, quantity, symbol, business_date) 
                            values 
                            (@open_id, @status, @quantity, @symbol, @business_date)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("open_id", OpenId),
                    new SqlParameter("status", Status),
                    new SqlParameter("quantity", Quantity),
                    new SqlParameter("symbol", Symbol),
                    new SqlParameter("business_date", BusinessDate),
                    
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
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 open_id, status, quantity, symbol, business_date FROM tax_lot_status", localconnection))
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
            row["quantity"] = this.Quantity;
            row["business_date"] = this.BusinessDate;
        }
    }

}
