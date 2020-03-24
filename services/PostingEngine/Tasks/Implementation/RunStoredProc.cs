using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.Tasks.Implementation
{

    class RunStoredProcTask : IPostingTask
    {
        internal string StoredProc { get; set; }
        internal string Module { get; set; }

        public bool Run(PostingEngineEnvironment env)
        {
            env.CallBack?.Invoke($"{Module} Calculation Started");

            var dates = "select minDate = min([when]), maxDate = max([when]) from vwJournal";
            var table = new DataTable();

            using (var connection = new SqlConnection(env.ConnectionString + $";Application Name=PE:{Module}"))
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
                        var busDate = valueDate.Date.ToString("MM-dd-yyyy");

                        using (var command = new SqlCommand(StoredProc, connection))
                        {
                            command.CommandTimeout = 120; // 2 Mins
                            command.CommandType = CommandType.StoredProcedure;
                            command.Parameters.Add("@Now", SqlDbType.VarChar).Value = busDate;
                            //command.Parameters.Add("@From", SqlDbType.VarChar).Value = busDate;
                            try
                            {
                                command.ExecuteNonQuery();
                            }
                            catch (Exception ex)
                            {
                                //Logger.Debug(ex, "RunStoredProc");
                                throw;
                            }
                        }
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
