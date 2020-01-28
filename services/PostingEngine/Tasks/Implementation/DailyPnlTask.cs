using LP.Finance.Common.Calculators;
using LP.Finance.Common.Model;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace PostingEngine.Tasks
{
    public class DailyPnlTask : IPostingTask
    {
        private string Module = "DailyPnlTask";

        private static bool UpdateDailyPnl(List<DailyPnL> records, string connectionString)
        {
            var query = $@"update unofficial_daily_pnl set 
                itd_pnl=@ITDPnL, 
                ytd_pnl=@YTDPnL, 
                qtd_pnl=@QTDPnL,
                mtd_pnl=@MTDPnL,
                last_updated_date = getDate(),
                last_updated_by = 'system',
                itd_percentage_return=@ITDPercentageReturn,
                qtd_percentage_return=@QTDPercentageReturn,
                ytd_percentage_return=@YTDPercentageReturn,
                mtd_percentage_return=@MTDPercentageReturn
                where id=@id";

            var connection = new SqlConnection(connectionString);
            connection.Open();
            var transaction = connection.BeginTransaction();
            foreach (var record in records)
            {
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("id", record.Id),

                    new SqlParameter("ITDPnL", record.ITDPnL),
                    new SqlParameter("YTDPnL", record.YTDPnL),
                    new SqlParameter("QTDPnL", record.QTDPnL),
                    new SqlParameter("MTDPnL", record.MTDPnL),

                    new SqlParameter("ITDPercentageReturn", record.ITDPercentageReturn),
                    new SqlParameter("YTDPercentageReturn", record.YTDPercentageReturn),
                    new SqlParameter("QTDPercentageReturn", record.QTDPercentageReturn),
                    new SqlParameter("MTDPercentageReturn", record.MTDPercentageReturn),
                };

                var command = new SqlCommand(query, connection);
                command.Transaction = transaction;
                command.Parameters.AddRange(sqlParams);
                command.ExecuteNonQuery();
            }
            transaction.Commit();
            connection.Close();

            return true;
        }

        public bool Run(PostingEngineEnvironment env)
        {
            env.CallBack?.Invoke($"{Module} Started");

            env.CallBack?.Invoke("Getting Daily Pnl Data");

            var performanceRecords = DailyPnL.GetList(env.ConnectionString);

            env.CallBack?.Invoke($"{Module} Running the calculation");

            var dailyPerformanceResult = new DailyPnlCalculator().CalculateDailyPerformance(performanceRecords);
            var dailyPerformance = dailyPerformanceResult.GetType().GetProperty("payload")
                ?.GetValue(dailyPerformanceResult, null);
            bool insertDailyPnl = UpdateDailyPnl((List<DailyPnL>)dailyPerformance, env.ConnectionString);

            env.CallBack?.Invoke($"{Module} Finished");

            return true;
        }
    }
}
