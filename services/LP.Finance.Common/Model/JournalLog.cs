using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    public class JournalLog : IDbAction
    {
        // Identity
        public int Id { get; set; }
        public string Action { get; set; }
        public DateTime ActionOn { get; set; }
        public DateTime RunDate { get; set; }
        public Guid Key { get; set; }
        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = @"insert into journal_log 
                            (rundate, action, action_on,log_key) 
                            values 
                            (@rundate, @action, @action_on,@key)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("rundate", RunDate),
                    new SqlParameter("action", Action),
                    new SqlParameter("action_on", ActionOn),
                    new SqlParameter("key", Key),
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }

}
