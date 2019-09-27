using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Models
{
    public class Journal : IDbAction, IDbModel
    {
        public int Id { get; set; }
        public Account Account { get; set; }
        public double Value { get; set; }

        public double FxRate { get; set; }
        public string FxCurrency { get; set; }

        public String Fund { get; set; }
        public String Source { get; set; }
        public DateTime When { get; set; }

        public double Quantity { get; set; }

        public string GeneratedBy { get; set; }

        // Get a list of Journal Entries for this trade
        public static KeyValuePair<string, SqlParameter[]> List(string orderId)
        {
            var sql = @"select * from journal where source=@source";

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
                var sql = @"insert into journal 
                            (source, account_id, value, [when], generated_by, fund, fx_currency, fxrate, quantity) 
                            values 
                            (@source, @account_id, @value, @when, @generated_by, @fund, @fx_currency, @fxrate, @quantity)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("fund", Fund),
                    new SqlParameter("source", Source),
                    new SqlParameter("account_id", Account.Id),
                    new SqlParameter("value", Value),
                    new SqlParameter("when", When),
                    new SqlParameter("fx_currency", FxCurrency),
                    new SqlParameter("fxrate", FxRate),
                    new SqlParameter("quantity", Quantity),
                    new SqlParameter("generated_by", GeneratedBy),
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
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 id, source, account_id, value, [when], generated_by, fund, fx_currency, fxrate, quantity FROM Journal", localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;

        }
        public void PopulateRow(DataRow row)
        {
            //row.ItemArray = new[] { };

            row["source"] = this.Source;
            row["account_id"] = this.Account.Id;
            row["value"] = this.Value;
            row["when"] = this.When;
            row["generated_by"] = this.GeneratedBy;
            row["fund"] = this.Fund;
            row["fx_currency"] = this.FxCurrency;
            row["fxrate"] = this.FxRate;
            row["quantity"] = this.Quantity;
        }
    }

}
