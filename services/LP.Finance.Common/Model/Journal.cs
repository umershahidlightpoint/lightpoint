using NLog;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace LP.Finance.Common.Models
{
    /// <summary>
    /// Helper functions for Journals
    /// </summary>
    public static class JournalExtensions
    {
        public static double Unrealized(this IEnumerable<Journal> journals, bool isDerivative = false)
        {
            var list = new string[]
            {
                "CHANGE IN UNREALIZED GAIN/(LOSS)",
            };

            var toSum = journals.Where(i => list.Contains(i.Account.Type.Name));
            return toSum.Sum(i => i.Debit - i.Credit);
        }


        public static double UnrealizedFxTranslation(this IEnumerable<Journal> journals, bool isDerivative = false)
        {
            var list = new string[]
            {
                "Mark to Market longs fx translation gain or loss",
                "Mark to Market shorts fx translation gain or loss"
            };

            var toSum = journals.Where(i => list.Contains(i.Account.Type.Name));
            return toSum.Sum(i => i.Debit - i.Credit);
        }

        public static double AssetDailyUnrealizedFx(this IEnumerable<Journal> journals, bool isDerivative = false)
        {
            var list = new string[]
            {
                "FX MARKET TO MARKET ON STOCK COST",
                "FX MARK TO MARKET ON STOCK COST (SHORTS)",
            };

            var toSum = journals.Where(i => list.Contains(i.Account.Type.Name));
            return toSum.Sum(i => i.Debit - i.Credit);
        }

        public static double RevenueDailyUnrealizedFx(this IEnumerable<Journal> journals, bool isDerivative = false)
        {
            var list = new string[]
            {
                "Change in unrealized due to fx on original Cost",
            };

            var toSum = journals.Where(i => list.Contains(i.Account.Type.Name));
            return toSum.Sum(i => i.Debit - i.Credit);
        }

        public static double AssetDailyUnrealizedDerivatives(this IEnumerable<Journal> journals)
        {
            var list = new string[]
            {
                "Mark to Market Derivatives Contracts at Fair Value (Assets)"
            };

            var toSum = journals.Where(i => list.Contains(i.Account.Type.Name));
            return toSum.Sum(i => i.Debit - i.Credit);
        }

        public static double LiabilitiesDailyUnrealizedDerivatives(this IEnumerable<Journal> journals, bool isDerivative = false)
        {
            var list = new string[]
            {
                "Mark to Market Derivatives Contracts at Fair Value (Liabilities)",
            };

            var toSum = journals.Where(i => list.Contains(i.Account.Type.Name));
            return toSum.Sum(i => i.Debit - i.Credit);
        }

    }

    /// <summary>
    /// Keeps track of both base(Reporting, i.e. USD) and local value
    /// </summary>
    public class JournalValue
    {
        public JournalValue(double localValue, double baseValue)
        {
            this.Local = localValue;
            this.Base = baseValue;
        }

        public double Local
        {
            get; private set;
        }
        public double Base
        {
            get; private set;
        }
    }
    public class Journal : IDbAction, IDbModel
    {
        private readonly List<int> _assetExpences = new List<int>
        {
            AccountCategory.AC_ASSET,
            AccountCategory.AC_EXPENCES
        };

        public double Credit {
            get
            {
                if (JournalValue != null && _assetExpences.Contains(Account.Type.Category.Id) && JournalValue.Base < 0)
                    return Math.Abs(JournalValue.Base);

                if (JournalValue != null &&  !_assetExpences.Contains(Account.Type.Category.Id) && JournalValue.Base > 0)
                    return Math.Abs(JournalValue.Base);

                if (_assetExpences.Contains(Account.Type.Category.Id) && Value < 0)
                    return Math.Abs(Value);

                if (!_assetExpences.Contains(Account.Type.Category.Id) && Value > 0)
                    return Math.Abs(Value);

                return 0;
            }
        }

        public double Debit
        {
            get
            {
                if (JournalValue != null && _assetExpences.Contains(Account.Type.Category.Id) && JournalValue.Base > 0)
                    return Math.Abs(JournalValue.Base);

                if (JournalValue != null && !_assetExpences.Contains(Account.Type.Category.Id) && JournalValue.Base < 0)
                    return Math.Abs(JournalValue.Base);

                if (_assetExpences.Contains(Account.Type.Category.Id) && Value > 0)
                    return Math.Abs(Value);

                if (!_assetExpences.Contains(Account.Type.Category.Id) && Value < 0)
                    return Math.Abs(Value);

                return 0;
            }
        }

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

        public JournalValue JournalValue { get; set; }

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
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 id, source, account_id, value, [when], generated_by, fund, fx_currency, fxrate, quantity, symbol, event, start_price, end_price, credit_debit, security_id, local_value FROM Journal", localconnection))
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
                if (this.JournalValue != null)
                {
                    row["value"] = this.JournalValue.Base;
                    row["local_value"] = this.JournalValue.Local;
                }
                else
                {
                    // This is now redundant as every Journal should now have a JournalValue
                    row["value"] = this.Value;
                    if (this.FxRate != 0)
                        row["local_value"] = this.Value / this.FxRate;
                    else
                        row["local_value"] = 0;
                }
            } 
            catch ( Exception ex )
            {
                row["value"] = 0;
                row["local_value"] = 0;
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
