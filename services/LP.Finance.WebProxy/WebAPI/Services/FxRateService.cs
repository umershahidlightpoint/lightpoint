using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using LP.FileProcessing;
using LP.FileProcessing.MetaData;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class FxRateService : IFxRateService
    {
        private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper SqlHelper = new SqlHelper(ConnectionString);
        private readonly FileProcessor _fileProcessor = new FileProcessor();
        private readonly FileManagementService _fileManagementService = new FileManagementService();
        public object AuditTrail(int id)
        {
            throw new NotImplementedException();
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
                                last_updated_on as LastUpdatedOn FROM [dbo].[market_prices] ORDER BY business_date ASC";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<FxRate>>(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "FxRates fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching Fx Rates");
            }
        }

        public object SetFxRates(List<FxRateInputDto> obj)
        {
            throw new NotImplementedException();
        }

        public async Task<object> Upload(HttpRequestMessage requestMessage)
        {
            try
            {
                var uploadedResult = await Utils.SaveFileToServerAsync(requestMessage, "FxRates");
                if (!uploadedResult.Item1)
                    return Utils.Wrap(false);

                var path = uploadedResult.Item2;
                var filename = uploadedResult.Item3;
                var recordBody = _fileProcessor.ImportFile(path, "FxRates", "PerformanceFormats", ',');

                var records = JsonConvert.SerializeObject(recordBody.Item1);
                var fxRates = JsonConvert.DeserializeObject<List<MarketDataPrice>>(records);

                var failedRecords = new Dictionary<object, Row>();
                var key = 0;
                foreach (var item in recordBody.Item2)
                {
                    failedRecords.Add(key++, item);
                }

                var failedPerformanceList =
                    _fileManagementService.MapFailedRecords(failedRecords, DateTime.Now, uploadedResult.Item3);

                List<FileInputDto> fileList = new List<FileInputDto>
                {
                    new FileInputDto(path, filename, fxRates.Count, "FxRates",
                        "Upload",
                        failedPerformanceList,
                        DateTime.Now)
                };

                _fileManagementService.InsertActivityAndPositionFilesForSilver(fileList);
                
                foreach (var i in fxRates)
                {
                    i.Event = "upload";
                    i.LastUpdatedOn = DateTime.Now;
                    i.LastUpdatedBy = "webservice";
                }

                bool insertinto = InsertData(fxRates);
                if (insertinto)
                {
                    return Utils.Wrap(true, fxRates, null);
                }
                else
                {
                    return Utils.Wrap(false);
                }
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false);
            }
        }

        private bool InsertData(List<MarketDataPrice> obj)
        {
            SqlHelper sqlHelper = new SqlHelper(ConnectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var monthlyPerformanceQuery = $@" DELETE FROM [fx_rates_history] where event = 'upload'
                                                  DELETE FROM [fx_rates] where event = 'upload'";

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
