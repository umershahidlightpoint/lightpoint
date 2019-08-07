using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Models
{
    public class Journal : IDbAction
    {
        public int Id { get; set; }
        public Account Account { get; set; }
        public double Value { get; set; }

        public double FxRate { get; set; }
        public string FxCurrency { get; set; }

        public String Fund { get; set; }
        public String Source { get; set; }
        public DateTime When { get; set; }

        public string GeneratedBy { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = @"insert into journal 
                            (source, account_id, value, [when], generated_by, fund, fx_currency, fxrate) 
                            values 
                            (@source, @account_id, @value, @when, @generated_by, @fund, @fx_currency, @fxrate)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("fund", Fund),
                    new SqlParameter("source", Source),
                    new SqlParameter("account_id", Account.Id),
                    new SqlParameter("value", Value),
                    new SqlParameter("when", When),
                    new SqlParameter("fx_currency", FxCurrency),
                    new SqlParameter("fxrate", FxRate),
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
    }

}
