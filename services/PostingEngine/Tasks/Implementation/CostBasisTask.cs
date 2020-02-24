using LP.Finance.Common;
using LP.Finance.Common.Models;
using System;
using System.Data;
using System.Data.SqlClient;

namespace PostingEngine.Tasks
{
    class CostBasisTask : IPostingTask
    {
        private string Module = "Cost Basis";
        public bool Run(PostingEngineEnvironment env)
        {
            env.CallBack?.Invoke($"{Module} Calculation Started");

            var dates = "select minDate = min([when]), maxDate = max([when]) from vwJournal";
            var table = new DataTable();

            using (var connection = new SqlConnection(env.ConnectionString + ";Application Name=PE:CostBasis"))
            {
                connection.Open();

                // read the table structure from the database
                using (var adapter = new SqlDataAdapter(dates, connection))
                {
                    adapter.Fill(table);
                };

                var valueDate = Convert.ToDateTime(table.Rows[0]["minDate"]);
                var endDate = Convert.ToDateTime(table.Rows[0]["maxDate"]);

                var rowsCompleted = 1;
                var numberOfDays = (endDate - valueDate).Days;
                while (valueDate <= endDate)
                {
                    if (!valueDate.IsBusinessDate())
                    {
                        valueDate = valueDate.AddDays(1);
                        rowsCompleted++;
                        continue;
                    }

                    try
                    {
                        // Transaction in the store proc here
                        CostBasisDto.Calculate(connection, valueDate);
                    }
                    catch (Exception ex)
                    {
                        env.CallBack?.Invoke($"{Module} Exception on {valueDate.ToString("MM-dd-yyyy")}, {ex.Message}");
                    }

                    env.CallBack?.Invoke($"Completed {Module} for {valueDate.ToString("MM-dd-yyyy")}", numberOfDays, rowsCompleted++);
                    valueDate = valueDate.AddDays(1);
                }

                connection.Close();
            }

            env.CallBack?.Invoke($"{Module} Calculation Finished");

            return true;
        }
    }

}
