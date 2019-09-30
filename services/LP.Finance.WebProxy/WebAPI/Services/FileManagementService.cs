using LP.FileProcessing;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
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
                $@"select f.id, f.name, f.path,f.source,f.[statistics], f.business_date, fa.file_action_id, fa.file_id, fa.action, fa.action_start_date, fa.action_end_date from [file] f
                        inner join[file_action] fa on f.id = fa.file_id order by fa.Action_Start_Date desc";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            return Utils.GridWrap(json);
        }

        public object ImportFilesFromSilver()
        {
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
            var extractPath = currentDir + Path.DirectorySeparatorChar + "FileFormats" + Path.DirectorySeparatorChar +
                              "Transaction_Extract.txt";
            // var recordBody = fileHelper.ImportFile(extractPath, "Transaction");
            // return recordBody;
            return null;
        }
        public object GenerateActivityAndPositionFilesForSilver(FileGenerationInputDto dto)
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

            List<FileInputDto> fileList = new List<FileInputDto>();
            fileList.Add(new FileInputDto(activityPath, newFileName, activityStatistics, "LightPoint", "Upload", dto.businessDate.HasValue ? dto.businessDate : DateTime.UtcNow));
            fileList.Add(new FileInputDto(positionPath, newPositionFile, positionStatistics, "LightPoint", "Upload", dto.businessDate.HasValue ? dto.businessDate : DateTime.UtcNow));

            InsertActivityAndPositionFilesForSilver(fileList);
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

        private void InsertActivityAndPositionFilesForSilver(List<FileInputDto> files)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                foreach (var file in files)
                {
                    List<SqlParameter> fileParams = new List<SqlParameter>
                    {
                        new SqlParameter("name", file.fileName),
                        new SqlParameter("path", file.path),
                        new SqlParameter("source", file.source),
                        new SqlParameter("statistics", file.statistics),
                        new SqlParameter("business_date", file.businessDate),
                    };

                    var query = $@"INSERT INTO [file]
                               ([name]
                               ,[path]
                               ,[source]
                               ,[statistics]
                                ,[business_date])
                         VALUES
                               (@name,
                               @path,
                               @source,
                               @statistics,
                                @business_date)
                               SELECT SCOPE_IDENTITY() AS 'Identity'";

                    sqlHelper.Insert(query, CommandType.Text, fileParams.ToArray(),out int fileId);

                    List<SqlParameter> fileActionParams = new List<SqlParameter>()
                    {
                        new SqlParameter("file_id", fileId),
                        new SqlParameter("action", file.action),
                        new SqlParameter("action_start_date", DateTime.UtcNow),
                        new SqlParameter("action_end_date", DateTime.UtcNow)
                    };


                    query = $@"INSERT INTO[dbo].[file_action]
                           ([file_id]
                           ,[action]
                           ,[action_start_date]
                           ,[action_end_date])
                         VALUES
                           (@file_id
                           ,@action
                           ,@action_start_date
                           ,@action_end_date)";

                    sqlHelper.Insert(query, CommandType.Text, fileActionParams.ToArray());

                }

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
            }
        }

        public object UpdateFileAction(FileActionInputDto input)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> fileActionParams = new List<SqlParameter>
            {
                new SqlParameter("file_id", input.fileId),
                new SqlParameter("action", input.action),
                new SqlParameter("action_start_date", DateTime.UtcNow),
                new SqlParameter("action_end_date", DateTime.UtcNow)
            };

            var query = $@"INSERT INTO[dbo].[file_action]
                           ([file_id]
                           ,[action]
                           ,[action_start_date]
                           ,[action_end_date])
                         VALUES
                           (@file_id
                           ,@action
                           ,@action_start_date
                           ,@action_end_date)";

            try
            {
                sqlHelper.VerifyConnection();

                sqlHelper.Insert(query, CommandType.Text, fileActionParams.ToArray());
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
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

        public object GetS3Files()
        {
            var status = fileProcessor.GetFiles();

            return status.Count != 0 ? Utils.Wrap(true, status, null) : Utils.Wrap(false);
        }
    }
}