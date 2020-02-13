using LP.Finance.Common;
using LP.Finance.Common.Models;
using System;
using System.Data;
using System.Data.SqlClient;

namespace PostingEngine.Tasks
{
    class CleanupTask : IPostingTask
    {
        private readonly string Module = "Cleanup";
        public bool Run(PostingEngineEnvironment env)
        {
            env.CallBack?.Invoke($"{Module} Calculation Started");

            Tuple<DateTime, DateTime> datePeriod;

            switch (env.Period)
            {
                case "ITD":
                    datePeriod = DateTime.Now.ITD();
                    break;
                case "MTD":
                    datePeriod = DateTime.Now.MTD();
                    break;
                default:
                    datePeriod = DateTime.Now.Today();
                    break;
            }

            var startdate = datePeriod.Item1.ToString("MM-dd-yyyy") + " 00:00";
            var enddate = datePeriod.Item2.ToString("MM-dd-yyyy") + " 23:59";

            using (var connection = new SqlConnection(env.ConnectionString))
            {
                try
                {
                    var query =
                        $@"DECLARE @Deleted_Rows INT;
                        SET @Deleted_Rows = 1;
                        WHILE (@Deleted_Rows > 0)
                          BEGIN

                        delete top (10000) from journal 
                        where [when] between CONVERT(datetime, '{startdate}') and CONVERT(datetime, '{enddate}')
                        SET @Deleted_Rows = @@ROWCOUNT;
    
                        END";

                    var command = new SqlCommand(query, connection);
                    command.CommandTimeout = 90;
                    command.ExecuteNonQuery();

                    if (env.Period.Equals("ITD"))
                    {
                        // We need to preserve the Accounts, so once created we are good to go
                        //new SqlCommand("delete from account_tag", connection).ExecuteNonQuery();
                        //new SqlCommand("delete from account", connection).ExecuteNonQuery();

                        new SqlCommand("delete from journal_log", connection).ExecuteNonQuery();
                        new SqlCommand("delete from tax_lot", connection).ExecuteNonQuery();
                        new SqlCommand("delete from tax_lot_status", connection).ExecuteNonQuery();
                        new SqlCommand("delete from cost_basis", connection).ExecuteNonQuery();
                    }
                }
                catch (Exception ex)
                {
                    // env.CallBack?.Invoke("Unable to complete Cleanup", ex);
                    // We have to throw the exception here as if this fails we need to terminate ASAP
                    throw ex;
                }

                connection.Close();
            }

            env.CallBack?.Invoke($"{Module} Calculation Finished");

            return true;
        }
    }

}
