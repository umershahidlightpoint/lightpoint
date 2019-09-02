using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    public class JournalLog : IDbAction, IDbModel
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

        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString);
            localconnection.Open();
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 action, action_on, rundate, log_key FROM Journal_log", localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

        public void PopulateRow(DataRow row)
        {
            row["action"] = this.Action;
            row["action_on"] = this.ActionOn;

            row["rundate"] = this.RunDate;
            row["log_key"] = this.Key;
        }
    }

}
