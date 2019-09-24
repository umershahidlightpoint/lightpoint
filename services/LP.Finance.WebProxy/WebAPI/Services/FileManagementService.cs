using LP.FileProcessing;
using LP.Finance.Common;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class FileManagementService : IFileManagementService
    {
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        public SqlHelper sqlHelper = new SqlHelper(connectionString);
        private static readonly string tradesURL = "http://localhost:9091/api/trade/data?period=";
        private Class1 fileHelper = new Class1();

        public object GetFiles(string name)
        {
            var query = $@"select f.id, f.name, f.path,f.source,f.[statistics], fa.file_action_id, fa.file_id, fa.action, fa.action_start_date, fa.action_end_date from [file] f
                        left join[file_action] fa on f.id = fa.file_id order by fa.Action_Start_Date desc";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);
            return Utils.GridWrap(json);
        }

        public object GenerateActivityAndPositionFilesForSilver()
        {
            var trades = GetTransactions(tradesURL + "ALL");
            Task.WaitAll(new Task[] { trades });
            var tradeList = JsonConvert.DeserializeObject<Transaction[]>(trades.Result);
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
            System.IO.Directory.CreateDirectory(currentDir + Path.DirectorySeparatorChar + "SilverData");
            string fileName = "activity_" + Convert.ToString(DateTime.UtcNow);
            var newFileName = fileName.Replace("/", "_");
            newFileName = newFileName.Replace(":", "-");
            var path = currentDir + "SilverData" + Path.DirectorySeparatorChar + $"{newFileName}.csv";
            
            var result = fileHelper.GenerateActivityFile(tradeList, path);
            int statistics = tradeList.Count();

            InsertActivityAndPositionFilesForSilver(newFileName, path, statistics, "LightPoint");
            return Utils.Wrap(true);
        }

        private void InsertActivityAndPositionFilesForSilver(string filename, string path, int statistics, string source)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();


                List<SqlParameter> activityFile = new List<SqlParameter>
                {
                    new SqlParameter("name", filename),
                    new SqlParameter("path", path),
                    new SqlParameter("source", source),
                    new SqlParameter("statistics", statistics),
                };

                
                var query = $@"INSERT INTO [file]
                               ([name]
                               ,[path]
                               ,[source]
                               ,[statistics])
                         VALUES
                               (@name,
                               @path,
                               @source,
                               @statistics)";

                sqlHelper.Insert(query, CommandType.Text, activityFile.ToArray());

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
            }
        }

        private static async Task<string> GetTransactions(string webURI)
        {
            Task<string> result = null;

            var client = new HttpClient();

            HttpResponseMessage response = await client.GetAsync(webURI);
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }
    }
}
