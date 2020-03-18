using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LP.Shared.Sql;

namespace LP.Finance.Common.Model
{
    public class MarketDataPrice : IDbModel
    {
        public MarketDataPrice() { }

        public void PopulateRow(DataRow row)
        {
            row["business_date"] = this.BusinessDate;
            row["security_id"] = this.SecurityId;
            row["symbol"] = this.Symbol;
            row["event"] = this.Event;
            row["price"] = this.Price;
            row["last_updated_by"] = this.LastUpdatedBy;
            row["last_updated_on"] = this.LastUpdatedOn;
        }

        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString + ";Password=ggtuser");
            localconnection.Open();
            var query = $"SELECT TOP 0 business_date, security_id, symbol, event, price, last_updated_on, last_updated_by FROM market_prices with(nolock)";

            using (var adapter = new SqlDataAdapter(query, localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

        public static List<MarketDataPrice> GetList(string connectionString)
        {
            var query = "SELECT * FROM market_prices";
            var table = new DataTable();
            var connection = new SqlConnection(connectionString);
            connection.Open();

            using (var adapter = new SqlDataAdapter(query, connection))
            {
                adapter.Fill(table);
            };

            var list = new List<MarketDataPrice>();

            foreach (DataRow row in table.Rows)
            {
                list.Add(new MarketDataPrice(row));
            }

            return list;
        }

        public int Id { get; set; }
        public int SecurityId { get; set; }

        public DateTime BusinessDate { get; set; }
        public DateTime LastUpdatedOn { get; set; }
        public string LastUpdatedBy { get; set; }
        public string Symbol { get; set; }
        public string Event { get; set; }
        public decimal Price { get; set; }

        public MarketDataPrice(DataRow row)
        {
            this.Id = Convert.ToInt32(row["id"]);
            this.BusinessDate = Convert.ToDateTime(row["business_date"]);
            this.SecurityId = Convert.ToInt32(row["security_id"]);
            this.Symbol = Convert.ToString(row["symbol"]);
            this.Event = Convert.ToString(row["event"]);
            this.Price = Convert.ToDecimal(row["price"]);

            this.LastUpdatedBy = row["last_updated_by"].ToString();
            if (row["last_updated_on"] != DBNull.Value)
                this.LastUpdatedOn = Convert.ToDateTime(row["last_updated_on"]);

        }

    }
}
