using LP.Finance.Common;
using SqlDAL.Core;
using System.Configuration;
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

                        select @minDate = min(busDate), @maxDate = max(busDate) from PositionMaster..IntraDayPositionSplit with(nolock)

                        exec PullDailyActivity @minDate, @maxDate
                        exec PullDailyMarketPrices @minDate, @maxDate
                        ";

                var command = new SqlCommand(sql, connection)
                {
                    CommandTimeout = 120 // 1 Mins, shoudl not take this long.
                };

                env.CallBack?.Invoke("[Start] PullDailyActivity & PullDailyMarketPrices");

                command.ExecuteNonQuery();

                env.CallBack?.Invoke("[End] PullDailyActivity & PullDailyMarketPrices");

                sql = @"
                        declare @minDate as Date
                        declare @maxDate as Date

                        select @minDate = min(busDate), @maxDate = max(busDate) from PositionMaster..IntraDayPositionSplit with(nolock)

                        exec PullDailyFxPrices @minDate, @maxDate
                        ";
                command = new SqlCommand(sql, connection)
                {
                    CommandTimeout = 120 // 1 Mins, shoudl not take this long.
                };

                env.CallBack?.Invoke("[Start] PullDailyFxPrices");
                command.ExecuteNonQuery();
                env.CallBack?.Invoke("[End] PullDailyFxPrices");

                sql = @"truncate table current_trade_state";
                command = new SqlCommand(sql, connection)
                {
                    CommandTimeout = 60 // 1 Mins, shoudl not take this long.
                };

                command.ExecuteNonQuery();

                var source_ConnectionString = "Source_FinanceDB";

                var connectionString = ConfigurationManager.ConnectionStrings[source_ConnectionString].ToString();


                var dataTable = new SqlHelper(connectionString).GetDataTable("select * from vwCurrentStateTrades", System.Data.CommandType.Text);
                env.CallBack?.Invoke("[Start] Bulk Copy from vwCurrentStateTrades");

                var transaction = connection.BeginTransaction();
                new SQLBulkHelper().Insert("current_trade_state", dataTable, connection, transaction, false, false);
                transaction.Commit();

                env.CallBack?.Invoke("[End] Bulk Copy from vwCurrentStateTrades");

                var sqlHelper = new SqlHelper(connectionString);
                sqlHelper.CreateConnection();
                sqlHelper.GetConnection().Open();
                sqlHelper.SqlBeginTransaction();
                sqlHelper.Update("update current_trade_state set SecurityType = 'Common Stock' where SecurityType = 'REIT'", System.Data.CommandType.Text);
                sqlHelper.GetTransaction().Commit();
                sqlHelper.GetConnection().Close();

                sql = @"PullDividends";
                command = new SqlCommand(sql, connection)
                {
                    CommandTimeout = 120 // 1 Mins, shoudl not take this long.
                };

                env.CallBack?.Invoke("[Start] PullDividends");
                command.ExecuteNonQuery();
                env.CallBack?.Invoke("[End] PullDividends");

                connection.Close();
            }

            // Now lets populate the current_trade_state table from the Core system

            return true;
        }
    }

}
