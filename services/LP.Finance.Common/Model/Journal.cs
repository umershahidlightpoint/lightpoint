using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    public class Journal : IDbAction, IDbModel
    {
        // Default Constructor
        public Journal()
        {
            GeneratedBy = "system";
        }

        public Journal(Transaction element) : this()
        {
            Source = element.LpOrderId;
            FxCurrency = element.SettleCurrency;
            Symbol = element.Symbol;
            SecurityId = element.SecurityId;
            Quantity = element.Quantity;
            Fund = element.Fund;
        }

        public Journal(Journal source)
        {
            // Clone the Journal, this is to make Journal creation easier, and then have the developer just override the changes
            GeneratedBy = source.GeneratedBy;
            Source = source.Source;
            When = source.When;
            FxCurrency = source.FxCurrency;
            Symbol = source.Symbol;
            SecurityId = source.SecurityId;
            Quantity = source.Quantity;
            Event = source.Event;
            FxRate = source.FxRate;
            Fund = source.Fund;
            StartPrice = source.StartPrice;
            EndPrice = source.EndPrice;
        }

        public Journal(Transaction element, Account account, string journalEvent, DateTime valueDate) : this(element)
        {
            When = valueDate;
            Account = account;
            Event = journalEvent;
        }

        public Journal(Account account, string journalEvent, DateTime valueDate) : this()
        {
            When = valueDate;
            Account = account;
            Event = journalEvent;
        }

        public int Id { get; set; }
        public Account Account { get; set; }
        public double Value { get; set; }

        public double StartPrice { get; set; }
        public double EndPrice { get; set; }

        public double FxRate { get; set; }
        public string FxCurrency { get; set; }

        public String Fund { get; set; }
        public String Source { get; set; }

        /// <summary>
        /// What event generated this Journal Entry, Trade Date, Settlement Date, Dividend, Daily Event, etc
        /// </summary>
        public String Event { get; set; }
        public DateTime When { get; set; }

        public double Quantity { get; set; }

        public string Symbol { get; set; }
        public int SecurityId { get; set; }
        public string CreditDebit { get; set; }
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
                            (source, account_id, value, [when], generated_by, fund, fx_currency, fxrate, quantity, symbol) 
                            values 
                            (@source, @account_id, @value, @when, @generated_by, @fund, @fx_currency, @fxrate, @quantity, @symbol)";
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
                    new SqlParameter("symbol", Symbol),
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
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 id, source, account_id, value, [when], generated_by, fund, fx_currency, fxrate, quantity, symbol, event, start_price, end_price, credit_debit, security_id FROM Journal", localconnection))
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
            try
            {
                row["value"] = this.Value;
            } catch ( Exception ex )
            {
                row["value"] = 0;
            }
            row["when"] = this.When;
            row["generated_by"] = this.GeneratedBy;
            row["fund"] = this.Fund;
            row["fx_currency"] = this.FxCurrency;
            row["fxrate"] = this.FxRate;
            row["symbol"] = this.Symbol;
            row["quantity"] = this.Quantity;
            row["event"] = this.Event;
            row["start_price"] = this.StartPrice;
            row["end_price"] = this.EndPrice;
            row["credit_debit"] = this.CreditDebit;
            row["security_id"] = this.SecurityId;
        }
    }

}
