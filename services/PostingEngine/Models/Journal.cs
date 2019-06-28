using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1.Models
{

    public class Journal : IDbAction
    {
        public int Id { get; set; }

        public String Source { get; set; }
        public Account Account { get; set; }
        public DateTime When { get; set; }
        public double Value { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = "insert into journal (source, account_id, value, [when]) values (@source, @account_id, @value, @when)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("source", Source),
                    new SqlParameter("account_id", Account.Id),
                    new SqlParameter("value", Value),
                    new SqlParameter("when", When),
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
