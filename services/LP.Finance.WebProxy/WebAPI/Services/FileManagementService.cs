using LP.FileProcessing;
using LP.FileProcessing.S3;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using Amazon.S3;
using LP.Finance.Common.IO;
using System.Net;
using LP.Shared.Cache;
using LP.Shared.FileMetaData;
using LP.Shared.Sql;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class FileManagementService : IFileManagementService
    {
        private static readonly string
            connectionString = "Persist Security Info=True;" +
                               ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private static readonly string tradesURL = "http://localhost:9091/api/trade/data?period=";
        private static readonly string positionsURL = "http://localhost:9091/api/positions?period=2019-09-24";

        public SqlHelper SqlHelper = new SqlHelper(connectionString);
        private readonly FileProcessor _fileProcessor = new FileProcessor();

        public object GetFiles(string name)
        {
            var query =
                $@"select f.id, f.name, f.path,f.source,f.[statistics], f.business_date,f.exceptions, fa.file_action_id, fa.file_id, fa.action, fa.action_start_date, fa.action_end_date from [file] f
                        inner join[file_action] fa on f.id = fa.file_id order by fa.Action_Start_Date desc";

            var dataTable = new SqlHelper(connectionString).GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);
            return Shared.WebApi.Wrap(true, json);
        }

        public object UploadFiles()
        {
            // The File Path to be Uploaded
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
            var path = currentDir + "SilverData" + Path.DirectorySeparatorChar + $"ActivityXML.xml";

            var S3Client = new AmazonS3Client();
            var s3Endpoint = new S3Endpoint(S3Client);

            var status = s3Endpoint.UploadFileToS3(path);

            return Shared.WebApi.Wrap(status);
        }

        public object DownloadFiles()
        {
            // The Path where File is Downloaded
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
            var path = currentDir + "SilverData" + Path.DirectorySeparatorChar + $"Downloaded.xml";

            var S3Client = new AmazonS3Client();
            var s3Endpoint = new S3Endpoint(S3Client);

            var status = s3Endpoint.DownloadFileFromS3(path);

            return Shared.WebApi.Wrap(status);
        }

        public object GetS3Files()
        {
            var S3Client = new AmazonS3Client();
            var s3Endpoint = new S3Endpoint(S3Client);

            var status = s3Endpoint.ListS3Files();

            return status.Count != 0 ? Shared.WebApi.Wrap(true, status) : Shared.WebApi.Wrap(false);
        }

        public object ImportFilesFromSilver()
        {
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
            var extractPath = currentDir + Path.DirectorySeparatorChar + "ExportFormats" + Path.DirectorySeparatorChar +
                              "Transaction_Extract.txt";
            var recordBody = new FileProcessor().ImportFile(extractPath, "Transaction", "ExportFormats", '|');
            return new
            {
                ImportedRecords = recordBody.Item1,
                FailedRecords = recordBody.Item2,
                Successful = recordBody.Item3
            };
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

            if (System.IO.File.Exists(activityPath))
            {
                string newFileName = currentDir + "SilverData" + Path.DirectorySeparatorChar + activityFileName +
                                     $"_{DateTime.UtcNow.Ticks}.txt";
                System.IO.File.Move(activityPath, newFileName);
            }

            if (System.IO.File.Exists(positionPath))
            {
                string newFileName = currentDir + "SilverData" + Path.DirectorySeparatorChar + positionFileName +
                                     $"_{DateTime.UtcNow.Ticks}.txt";
                System.IO.File.Move(positionPath, newFileName);
            }

            //header and trailer
            var activityHeader = GetHeader("HDR", "SMGActivity", convertedBusinessDate);
            var activityTrailer = GetTrailer("TRL", "SMGActivity", convertedBusinessDate);
            var positionHeader = GetHeader("HDR", "SMGOpenLotPosition", convertedBusinessDate);
            var positionTrailer = GetTrailer("TRL", "SMGOpenLotPosition ", convertedBusinessDate);

            var activityResult = new FileProcessor().ExportFile(tradeList, activityHeader, activityTrailer,
                activityPath, "Activity", "LpOrderId");
            var positionResult = new FileProcessor().ExportFile(positionList, positionHeader, positionTrailer,
                positionPath, "Position", "IntraDayPositionId");

            var failedActivityList = MapFailedRecords(activityResult.Item1, businessDate, activityFileName);
            var failedPositionList = MapFailedRecords(positionResult.Item1, businessDate, positionFileName);


            List<FileInputDto> fileList = new List<FileInputDto>();
            fileList.Add(new FileInputDto(activityPath, activityFileName, activityResult.Item2, "LightPoint", "Upload",
                failedActivityList,
                businessDate));
            fileList.Add(new FileInputDto(positionPath, positionFileName, positionResult.Item2, "LightPoint", "Upload",
                failedPositionList,
                businessDate));

            InsertActivityAndPositionFilesForSilver(fileList);
            return Shared.WebApi.Wrap(true);
        }

        public List<FileException> MapFailedRecords(Dictionary<object, Row> failedRecords, DateTime businessDate,
            string fileName)
        {
            var records = failedRecords.Select(x => new FileException
            {
                record = JsonConvert.SerializeObject(x.Value),
                reference = Convert.ToString(x.Key),
                businessDate = businessDate,
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

        public void InsertActivityAndPositionFilesForSilver(List<FileInputDto> files)
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
                        new SqlParameter("exceptions", file.failedRecords.Count > 0 ? true : false),
                    };

                    var query = $@"INSERT INTO [file]
                               ([name]
                               ,[path]
                               ,[source]
                               ,[statistics]
                                ,[business_date]
                                ,[exceptions])
                         VALUES
                               (@name,
                               @path,
                               @source,
                               @statistics,
                                @business_date,
                                @exceptions)
                               SELECT SCOPE_IDENTITY() AS 'Identity'";

                    sqlHelper.Insert(query, CommandType.Text, fileParams.ToArray(), out int fileId);
                    file.failedRecords.ForEach(x => x.fileId = fileId);
                    new SQLBulkHelper().Insert("file_exception", file.failedRecords.ToArray(),
                        sqlHelper.GetConnection(), sqlHelper.GetTransaction());

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
                return Shared.WebApi.Wrap(false);
            }

            return Shared.WebApi.Wrap(true);
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

        public object GetInvalidExportRecords()
        {
            var query =
                $@"select fe.file_exception_id, fe.file_id, f.[name],f.source,fe.business_date,reference, record from file_exception fe
                            inner join [file] f on fe.file_id = f.id
                            order by business_date desc";

            var dataTable = new SqlHelper(connectionString).GetDataTable(query, CommandType.Text);
            List<FileException> fileExceptions = new List<FileException>();
            foreach (DataRow row in dataTable.Rows)
            {
                FileException fEx = new FileException();
                fEx.businessDate = (DateTime) row["business_date"];
                fEx.fileId = row["file_id"] == DBNull.Value ? 0 : (int) row["file_id"];
                fEx.fileExceptionId = (int) row["file_exception_id"];
                fEx.reference = (string) row["reference"];
                fEx.fileName = (string) row["name"];
                fEx.record = (string) row["record"];
                fEx.source = (string) row["source"];
                fileExceptions.Add(fEx);
            }

            var groupedExceptions = fileExceptions.GroupBy(x => x.fileId).Select(x => new
            {
                FileId = x.Key,
                FileExceptionId = x.FirstOrDefault().fileExceptionId,
                BusinessDate = x.FirstOrDefault().businessDate,
                FileName = x.FirstOrDefault().fileName,
                Exceptions = x.Count(),
                Source = x.FirstOrDefault().source,
                ExceptionList = x.Select(y => new
                {
                    Reference = y.reference,
                    Record = y.record
                }).ToList()
            }).ToList();
            //var jsonResult = JsonConvert.SerializeObject(dataTable);
            //dynamic json = JsonConvert.DeserializeObject(jsonResult);
            return Shared.WebApi.Wrap(true, groupedExceptions);
        }

        public async Task<object> UploadTrade(HttpRequestMessage requestMessage)
        {
            try
            {
                FileManager _fileManager = new FileManager(connectionString);
                var uploadedResult = await Utils.SaveFileToServerAsync(requestMessage, "Trades");
                if (!uploadedResult.Item1)
                    return Shared.WebApi.Wrap(false);

                var path = uploadedResult.Item2;
                var filename = uploadedResult.Item3;

                var symbolCache = AppStartCache.GetCachedData("symbol");
                var currencyCache = AppStartCache.GetCachedData("currency");
                Dictionary<string, int> symbols;
                Dictionary<string, string> currency;

                if (symbolCache.Item1)
                {
                    symbols = (Dictionary<string, int>) symbolCache.Item2;
                }
                else
                {
                    symbols = GetSymbols();
                    AppStartCache.CacheData("symbol", symbols);
                }

                if (currencyCache.Item1)
                {
                    currency = (Dictionary<string, string>) currencyCache.Item2;
                }
                else
                {
                    currency = GetCurrencies();
                    AppStartCache.CacheData("currency", currency);
                }


                var recordBody = _fileProcessor.ImportFile(path, "Trade", "ImportFormats", ',', true);

                var records = JsonConvert.SerializeObject(recordBody.Item1);
                var trades = JsonConvert.DeserializeObject<List<Trade>>(records);

                foreach (var i in trades)
                {
                    var guid = Guid.NewGuid().ToString().ToLower();
                    i.TradeId = guid;
                    i.LPOrderId = guid;
                    i.ParentOrderId = guid;
                    i.Status = "Executed";
                    i.TradeType = "manual";

                    if (symbols.ContainsKey(i.SecurityCode))
                    {
                        i.SecurityId = symbols[i.SecurityCode];
                    }
                }

                var failedRecords = new Dictionary<object, Row>();
                var key = 0;
                var enableCommit = true;
                foreach (var item in recordBody.Item2)
                {
                    failedRecords.Add(key++, item);
                    var tradeElement = trades.ElementAt(item.RowNumber - 1);
                    tradeElement.IsUploadInValid = true;
                    tradeElement.UploadException = JsonConvert.SerializeObject(item);
                }

                if (failedRecords.Count > 0)
                {
                    enableCommit = false;
                }

                var failedTradeList =
                    _fileManager.MapFailedRecords(failedRecords, DateTime.Now, uploadedResult.Item3);

                List<FileInputDto> fileList = new List<FileInputDto>
                {
                    new FileInputDto(path, filename, trades.Count, "Trade",
                        "Upload",
                        failedTradeList,
                        DateTime.Now)
                };

                _fileManager.InsertActivityAndPositionFiles(fileList);
                var data = new
                {
                    EnableCommit = enableCommit,
                    Data = trades
                };
                return Shared.WebApi.Wrap(true, data, HttpStatusCode.OK);

                //bool insertinto = InsertData(trades.ToArray(), "current_trade_state");
                //if (insertinto)
                //{
                //    return Shared.WebApi.Wrap(true, trades, HttpStatusCode.OK);
                //}
                //else
                //{
                //    return Shared.WebApi.Wrap(false);
                //}
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Dictionary<string, int> GetSymbols()
        {
            var query = $@"select s.SecurityCode, s.SecurityId from ( select securitycode, securityid, 
                            ROW_NUMBER() OVER (PARTITION BY securitycode ORDER BY securityid) 
                            row_num from [SecurityMaster]..security ) s where s.row_num = 1";

            var dataTable = new SqlHelper(connectionString).GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            var symbols = JsonConvert.DeserializeObject<List<SymbolDto>>(jsonResult);
            var symbolDict = symbols.ToDictionary(x => x.SecurityCode, x => x.SecurityId);
            return symbolDict;
        }

        public Dictionary<string, string> GetCurrencies()
        {
            var query = $@"select currencycode as CurrencyCode from [SecurityMaster]..currency";
            var dataTable = new SqlHelper(connectionString).GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            var currency = JsonConvert.DeserializeObject<List<CurrencyDto>>(jsonResult);
            var currencyDict = currency.ToDictionary(x => x.CurrencyCode, x => x.CurrencyCode);
            return currencyDict;
        }

        private bool InsertData(IDbModel[] obj, string table)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                new SQLBulkHelper().Insert(table, obj, sqlHelper.GetConnection(),
                    sqlHelper.GetTransaction(), true);

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
                return true;
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                return false;
            }
        }

        private bool InsertData(Dictionary<string, IDbModel[]> bulkContainer)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                foreach (var item in bulkContainer)
                {
                    new SQLBulkHelper().Insert(item.Key, item.Value, sqlHelper.GetConnection(),
                        sqlHelper.GetTransaction(), true);
                }

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
                return true;
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                return false;
            }
        }

        public object CommitTrade(List<Trade> trades)
        {
            try
            {
                var tradeReason = trades.Select(x => new TradeReason
                {
                    CreatedBy = "user",
                    CreatedDate = DateTime.Now,
                    LPOrderId = x.LPOrderId,
                    Reason = x.Reason
                }).ToList();

                var bulkContainer = new Dictionary<string, IDbModel[]>();
                bulkContainer.Add("current_trade_state", trades.ToArray());
                bulkContainer.Add("trade_reason", tradeReason.ToArray());

                var insertSuccessful = InsertData(bulkContainer);
                if (insertSuccessful)
                {
                    return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK);
                }
                else
                {
                    return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}