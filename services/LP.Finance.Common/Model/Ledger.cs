using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    class Ledger : IDbAction
    {
        public int Id { get; set; }
        public Account Account { get; set; }
        public double Value { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = @"insert into ledger 
                            (account_id, value) 
                            values 
                            (@account_id, @value)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("account_id", Account.Id),
                    new SqlParameter("value", Value),
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }
}
