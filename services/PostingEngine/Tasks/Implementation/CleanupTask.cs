using LP.Finance.Common;
using LP.Finance.Common.Models;
using System;
using System.Data;
using System.Data.SqlClient;

namespace PostingEngine.Tasks
{
    class CleanupTask : IPostingTask
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        private readonly string Module = "Cleanup";
        public bool Run(PostingEngineEnvironment env)
        {
            env.CallBack?.Invoke($"{Module} Started");

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

            using (var connection = new SqlConnection(env.ConnectionString + ";Application Name=PE:Cleanup"))
            {
                connection.Open();

                connection.InfoMessage += delegate (object sender, SqlInfoMessageEventArgs e)
                {
                    Logger.Info(e.Message);
                };

                try
                {
                    var query = "PrepareRun";

                    var command = new SqlCommand(query, connection)
                    {
                        CommandTimeout = 60 * 5, // Give it 5 mins for all of this
                        CommandType = CommandType.StoredProcedure
                    };

                    command.Parameters.Add(new SqlParameter("@startDate", startdate));
                    command.Parameters.Add(new SqlParameter("@endDate", enddate));
                    command.Parameters.Add(new SqlParameter("@period", env.Period));

                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    // env.CallBack?.Invoke("Unable to complete Cleanup", ex);
                    // We have to throw the exception here as if this fails we need to terminate ASAP
                    throw ex;
                }

                connection.Close();
            }

            env.CallBack?.Invoke($"{Module} Finished");

            return true;
        }
    }

}
