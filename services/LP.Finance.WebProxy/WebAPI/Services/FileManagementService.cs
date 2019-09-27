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
using System.Net.Http;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class FileManagementService : IFileManagementService
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);
        private static readonly string tradesURL = "http://localhost:9091/api/trade/data?period=";
        private static readonly string positionsURL = "http://localhost:9091/api/positions?period=2019-09-24";
        private readonly FileProcessor fileProcessor = new FileProcessor();

        public object GetFiles(string name)
        {
            var query =
                $@"select f.id, f.name, f.path,f.source,f.[statistics], fa.file_action_id, fa.file_id, fa.action, fa.action_start_date, fa.action_end_date from [file] f
                        left join[file_action] fa on f.id = fa.file_id order by fa.Action_Start_Date desc";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            return Utils.GridWrap(json);
        }

        public object ImportFilesFromSilver()
        {
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
            var extractPath = currentDir + Path.DirectorySeparatorChar + "FileFormats" + Path.DirectorySeparatorChar + "Transaction_Extract.txt";
            //var recordBody = fileHelper.ImportFile(extractPath, "Transaction");
            //return recordBody;
            return null;

        }
        public object GenerateActivityAndPositionFilesForSilver()
        {
            var trades = GetTransactions(tradesURL + "ALL");
            var positions = GetTransactions(positionsURL);

            Task.WaitAll(new Task[] {trades, positions});

            var tradeList = JsonConvert.DeserializeObject<Transaction[]>(trades.Result);
            var positionList = JsonConvert.DeserializeObject<Position[]>(positions.Result);

            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
            System.IO.Directory.CreateDirectory(currentDir + Path.DirectorySeparatorChar + "SilverData");

            string activityFileName = "activity_" + Convert.ToString(DateTime.UtcNow);
            var newFileName = activityFileName.Replace("/", "_");
            newFileName = newFileName.Replace(":", "-");

            string positionFileName = "position_" + Convert.ToString(DateTime.UtcNow);
            var newPositionFile = positionFileName.Replace("/", "_");
            newPositionFile = newPositionFile.Replace(":", "-");

            var activityPath = currentDir + "SilverData" + Path.DirectorySeparatorChar + $"{newFileName}.csv";
            var positionPath = currentDir + "SilverData" + Path.DirectorySeparatorChar + $"{newPositionFile}.csv";

            var activityHeader = GetHeader("HDR", "SMGActivity");
            var activityTrailer = GetTrailer("TRL", "SMGActivity");
            var positionHeader = GetHeader("HDR", "SMGOpenLotPosition");
            var positionTrailer = GetTrailer("TRL", "SMGOpenLotPosition ");

            var activityStatistics = fileProcessor.GenerateFile(tradeList, activityHeader, activityTrailer,
                activityPath, "Activity_json");
            var positionStatistics = fileProcessor.GenerateFile(positionList, positionHeader, positionTrailer,
                positionPath, "Position_json");

            // InsertActivityAndPositionFilesForSilver(newFileName, activityPath, activityStatistics, "LightPoint");
            return Utils.Wrap(true);
        }

        private object GetHeader(string headerIndicator, string fileName)
        {
            return new
            {
                HeaderIndicator = headerIndicator,
                FileName = fileName,
                BusinessDate = DateTime.UtcNow
            };
        }

        private object GetTrailer(string footerIndicator, string fileName)
        {
            return new
            {
                FooterIndicator = footerIndicator,
                FileName = fileName,
                BusinessDate = DateTime.UtcNow,
                RecordCount = 0
            };
        }

        private void InsertActivityAndPositionFilesForSilver(string filename, string path, int statistics,
            string source)
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

        public object UploadFiles()
        {
            // The File Path to be Uploaded
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
            var path = currentDir + "SilverData" + Path.DirectorySeparatorChar + $"ActivityXML.xml";

            var status = fileProcessor.UploadFile(path);

            return Utils.Wrap(status);
        }

        public object DownloadFiles()
        {
            // The Path where File is Downloaded
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
            var path = currentDir + "SilverData" + Path.DirectorySeparatorChar + $"Downloaded.xml";

            var status = fileProcessor.DownloadFile(path);

            return Utils.Wrap(status);
        }
    }
}