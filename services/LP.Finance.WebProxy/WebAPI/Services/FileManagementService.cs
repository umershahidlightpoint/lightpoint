using LP.FileProcessing;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
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

            DateTime businessDate = dto.businessDate.HasValue ? dto.businessDate.Value : DateTime.UtcNow;
            string convertedBusinessDate = businessDate.ToString("yyyy-MM-dd");

            // filenames
            string activityFileName = convertedBusinessDate + "_activity";
            string positionFileName = convertedBusinessDate + "_position";

            var activityPath = currentDir + "SilverData" + Path.DirectorySeparatorChar + $"{activityFileName}.txt";
            var positionPath = currentDir + "SilverData" + Path.DirectorySeparatorChar + $"{positionFileName}.txt";

            //header and trailer
            var activityHeader = GetHeader("HDR", "SMGActivity", convertedBusinessDate);
            var activityTrailer = GetTrailer("TRL", "SMGActivity", convertedBusinessDate);
            var positionHeader = GetHeader("HDR", "SMGOpenLotPosition", convertedBusinessDate);
            var positionTrailer = GetTrailer("TRL", "SMGOpenLotPosition ", convertedBusinessDate);

            var activityStatistics = fileProcessor.GenerateFile(tradeList, activityHeader, activityTrailer,
                activityPath, "Activity_json", "LpOrderId", out Dictionary<object,dynamic> failedActivityRecords);
            var positionStatistics = fileProcessor.GenerateFile(positionList, positionHeader, positionTrailer,
                positionPath, "Position_json", "IntraDayPositionId", out Dictionary<object, dynamic> failedPositionRecords);

            var failedActivityList = MapFailedRecords(failedActivityRecords, businessDate, activityFileName);
            var failedPositionList = MapFailedRecords(failedPositionRecords, businessDate, positionFileName);


            List<FileInputDto> fileList = new List<FileInputDto>();
            fileList.Add(new FileInputDto(activityPath, activityFileName, activityStatistics, "LightPoint", "Upload", failedActivityList,
                businessDate));
            fileList.Add(new FileInputDto(positionPath, positionFileName, positionStatistics, "LightPoint", "Upload", failedPositionList,
                businessDate));

            InsertFailedRecords(fileList);
            InsertActivityAndPositionFilesForSilver(fileList);
            return Utils.Wrap(true);
        }

        private List<FileException> MapFailedRecords(Dictionary<object, dynamic> failedRecords, DateTime businessDate, string fileName)
        {
            var records = failedRecords.Select(x => new FileException
            {
                record = JsonConvert.SerializeObject(x.Value),
                reference = Convert.ToString(x.Key),
                businessDate =  businessDate,
                fileName = fileName
            }).ToList();

            return records;
        }

        private object GetHeader(string headerIndicator, string fileName, string businessDate)
        {
            return new
            {
                HeaderIndicator = headerIndicator,
                FileName = fileName,
                BusinessDate = businessDate
            };
        }

        private object GetTrailer(string footerIndicator, string fileName, string businessDate)
        {
            return new
            {
                FooterIndicator = footerIndicator,
                FileName = fileName,
                BusinessDate = businessDate,
                RecordCount = 0
            };
        }

        private void InsertFailedRecords(List<FileInputDto> files)
        {
            try
            {
                using (var connection = new SqlConnection(connectionString))
                {
                    connection.Open();
                    var transaction = connection.BeginTransaction();
                    List<FileException> exceptionList = new List<FileException>();
                    foreach (var file in files)
                    {
                        exceptionList.AddRange(file.failedRecords);
                    }

                    new SQLBulkHelper().Insert("file_exception", exceptionList.ToArray(), connection, transaction);
                    transaction.Commit();
                }
            }
            catch (Exception e)
            {
                
            }
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

                    sqlHelper.Insert(query, CommandType.Text, fileParams.ToArray(), out int fileId);

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