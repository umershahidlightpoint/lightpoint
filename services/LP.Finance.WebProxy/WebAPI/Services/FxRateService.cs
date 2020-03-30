using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using LP.FileProcessing;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using LP.Finance.Common.IO;
using LP.Shared.FileMetaData;
using LP.Shared.Sql;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class FxRateService : IFxRateService
    {
        private static readonly string
            ConnectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper SqlHelper = new SqlHelper(ConnectionString);
        private readonly FileProcessor _fileProcessor = new FileProcessor();
        private readonly FileManager _fileManager = new FileManager(ConnectionString);

        public object AuditTrail(int id)
        {
            try
            {
                var query = $@"SELECT id as Id,
                                business_date as BusinessDate, 
                                event as Event,
                                price as Price,
                                currency as Currency,
                                last_updated_by as LastUpdatedBy,
                                last_updated_on as LastUpdatedOn FROM [dbo].[fx_rates_history] history where fx_rate_id = {id}";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<FxRate>>(jsonResult);

                return Shared.WebApi.Wrap(true, json, HttpStatusCode.OK, "FxRates Audit Trail fetched successfully");
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    $"An error occured while fetching FxRates Audit Trail:{ex.Message}");
            }
        }

        public object GetFxRates()
        {
            try
            {
                var query = $@"SELECT id as Id,
                                business_date as BusinessDate,
                                currency as Currency, 
                                event as Event,
                                price as Price,
                                last_updated_by as LastUpdatedBy,
                                last_updated_on as LastUpdatedOn FROM [dbo].[fx_rates] ORDER BY business_date ASC";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<FxRate>>(jsonResult);

                return Shared.WebApi.Wrap(true, json, HttpStatusCode.OK, "FxRates fetched successfully");
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    $"An error occured while fetching Fx Rates:{ex.Message}");
            }
        }

        public object SetFxRates(List<FxRateInputDto> obj)
        {
            List<List<SqlParameter>> listOfParameters = new List<List<SqlParameter>>();
            foreach (var item in obj)
            {
                List<SqlParameter> fxRateParams = new List<SqlParameter>
                {
                    new SqlParameter("id", item.Id),
                    new SqlParameter("price", item.Price),
                    new SqlParameter("event", "modified"),
                    new SqlParameter("lastUpdatedBy", "John Smith"),
                    new SqlParameter("lastUpdatedOn", DateTime.UtcNow)
                };

                listOfParameters.Add(fxRateParams);
            }

            SqlHelper sqlHelper = new SqlHelper(ConnectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var query = $@"UPDATE [dbo].[fx_rates]
                                                SET [price] = @price,
                                                [event] = @event,
                                                [last_updated_by] = @lastUpdatedBy,
                                                [last_updated_on] = @lastUpdatedOn
                                                where [id] = @id";

                foreach (var item in listOfParameters)
                {
                    sqlHelper.Update(query, CommandType.Text, item.ToArray());
                }

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();

                return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK, "Prices updated successfully");
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();

                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    $"An error occured while updating prices:{ex.Message}");
            }
        }


        public async Task<object> Upload(HttpRequestMessage requestMessage)
        {
            try
            {
                FileManager fileManager = new FileManager(ConnectionString);
                var uploadedResult = await Utils.SaveFileToServerAsync(requestMessage, "FxRates");
                if (!uploadedResult.Item1)
                    return Shared.WebApi.Wrap(false);

                var path = uploadedResult.Item2;
                var filename = uploadedResult.Item3;

                List<FxRate> fxRates;

                var recordBody = _fileProcessor.ImportFile(path, "FxRates", "ImportFormats", ',', true);

                var records = JsonConvert.SerializeObject(recordBody.Item1);

                try
                {
                    fxRates = JsonConvert.DeserializeObject<List<FxRate>>(records);
                }
                catch (Exception ex)
                {
                    foreach (var item in recordBody.Item2)
                    {
                        var fxRateElement = recordBody.Item1.ElementAt(item.RowNumber - 1);
                        fxRateElement.IsUploadInValid = true;
                        fxRateElement.UploadException = JsonConvert.SerializeObject(item);
                    }

                    var payload = new
                    {
                        EnableCommit = false,
                        Data = recordBody.Item1
                    };

                    return Shared.WebApi.Wrap(true, payload, HttpStatusCode.OK);
                }

                foreach (var i in fxRates)
                {
                    i.Event = "upload";
                    i.LastUpdatedOn = DateTime.Now;
                    i.LastUpdatedBy = "WebService";
                }

                var failedRecords = new Dictionary<object, Row>();
                var key = 0;
                var enableCommit = true;
                foreach (var item in recordBody.Item2)
                {
                    failedRecords.Add(key++, item);
                    var fxRateElement = fxRates.ElementAt(item.RowNumber - 1);
                    fxRateElement.IsUploadInValid = true;
                    fxRateElement.UploadException = JsonConvert.SerializeObject(item);
                }

                if (failedRecords.Count > 0)
                {
                    enableCommit = false;
                }

                var failedFxRateList =
                    fileManager.MapFailedRecords(failedRecords, DateTime.Now, uploadedResult.Item3);

                List<FileInputDto> fileList = new List<FileInputDto>
                {
                    new FileInputDto(path, filename, fxRates.Count, "FxRates",
                        "Upload",
                        failedFxRateList,
                        DateTime.Now)
                };

                fileManager.InsertFiles(fileList);

                var data = new
                {
                    EnableCommit = enableCommit,
                    Data = fxRates
                };

                return Shared.WebApi.Wrap(true, data, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    $"An error occured:{ex.Message}");
            }
        }

        public object CommitFxRate(List<FxRate> fxRates)
        {
            var insertionStatus = InsertData(fxRates);

            /*
            var duplicates = fxRates.GroupBy(x => new { x.BusinessDate, x.Currency }).ToList();
            var duplicateList = duplicates.Where(x => x.Skip(1).Any()).ToList();
            if (duplicateList.Any())
            {
                var items = duplicateList.SelectMany(x => x.Select(y => y)).ToList();
                var metaData = MetaData.ToMetaData(items[0]);
                foreach (var item in metaData.Columns)
                {
                    Console.WriteLine(item);
                }

                return Shared.WebApi.Wrap(true, items, HttpStatusCode.Forbidden, null, metaData.Columns);
            }
            */

            if (insertionStatus)
            {
                return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK);
            }

            return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError);
        }

        private bool InsertData(List<FxRate> obj)
        {
            SqlHelper sqlHelper = new SqlHelper(ConnectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var monthlyPerformanceQuery = $@" DELETE FROM [fx_rates_history]
                                                  DELETE FROM [fx_rates]";

                sqlHelper.Delete(monthlyPerformanceQuery, CommandType.Text);

                new SQLBulkHelper().Insert("fx_rates", obj.ToArray(), sqlHelper.GetConnection(),
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
    }
}