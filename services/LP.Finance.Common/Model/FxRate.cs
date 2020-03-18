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
    public class FxRate : IDbModel
    {
        public int Id { get; set; }
        public DateTime BusinessDate { get; set; }
        public string Currency { get; set; }
        public string Event { get; set; }
        public decimal Price { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime LastUpdatedOn { get; set; }

        public FxRate() { }

        public FxRate(DataRow row)
        {
            this.Id = Convert.ToInt32(row["id"]);
            this.BusinessDate = Convert.ToDateTime(row["business_date"]);
            this.Currency = Convert.ToString(row["currency"]);
            this.Event = Convert.ToString(row["event"]);
            this.Price = Convert.ToDecimal(row["price"]);

            this.LastUpdatedBy = row["last_updated_by"].ToString();
            if (row["last_updated_on"] != DBNull.Value)
                this.LastUpdatedOn = Convert.ToDateTime(row["last_updated_on"]);

        }

        public void PopulateRow(DataRow row)
        {
            row["business_date"] = this.BusinessDate;
            row["currency"] = this.Currency;
            row["event"] = this.Event;
            row["price"] = this.Price;
            row["last_updated_by"] = this.LastUpdatedBy;
            row["last_updated_on"] = this.LastUpdatedOn;
        }
        public static List<MarketDataPrice> GetList(string connectionString)
        {
            var query = "SELECT * FROM fx_rates";
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

        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString);
            localconnection.Open();
            var query = $"SELECT TOP 0 business_date, currency, event, price, last_updated_on, last_updated_by FROM fx_rates with(nolock)";

            using (var adapter = new SqlDataAdapter(query, localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

    }
}
