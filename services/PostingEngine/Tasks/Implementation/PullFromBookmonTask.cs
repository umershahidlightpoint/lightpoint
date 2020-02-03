using System.Data.SqlClient;

namespace PostingEngine.Tasks
{
    public class PullFromBookmonTask : IPostingTask
    {
        public bool Run(PostingEngineEnvironment env)
        {
            env.CallBack?.Invoke("Pull From BookMon Calculation Started");

            using (var connection = new SqlConnection(env.ConnectionString))
            {
                connection.Open();
                var sql = @"
                        declare @minDate as Date
                        declare @maxDate as Date

                        select @minDate = min(busDate), @maxDate = max(busDate) from PositionMaster..IntraDayPositionSplit

                        exec FundAccounting..PullDailyActivity @minDate, @maxDate
                        exec FundAccounting..PullDailyMarketPrices @minDate, @maxDate
                        exec FundAccounting..PullDailyFxPrices @minDate, @maxDate
                        ";
                var command = new SqlCommand(sql, connection);
                command.CommandTimeout = 60; // 1 Mins, shoudl not take this long.

                command.ExecuteNonQuery();
                connection.Close();
            }

            return true;
        }
    }

}
