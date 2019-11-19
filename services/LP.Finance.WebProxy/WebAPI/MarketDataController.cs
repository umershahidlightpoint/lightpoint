using LP.Finance.Common.Model;
using LP.Finance.WebProxy.WebAPI.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using GraphQL;
using GraphQL.Types;
using LP.Finance.WebProxy.GraphQLEntities;
using System.Net.Http;
using LP.Finance.Common;
using System;
using System.Configuration;
using SqlDAL.Core;
using LP.FileProcessing;
using Newtonsoft.Json;
using LP.FileProcessing.MetaData;
using LP.Finance.Common.Dtos;
using System.Data;
using System.Net;

namespace LP.Finance.WebProxy.WebAPI
{
    public interface IMarketDataService
    {
        Task<object> Upload(HttpRequestMessage requestMessage);
        object GetPrices();
        object SetPrices(List<object> obj);
    }

    internal class MarketDataService : IMarketDataService
    {
        private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper SqlHelper = new SqlHelper(ConnectionString);
        private readonly FileProcessor _fileProcessor = new FileProcessor();
        private readonly FileManagementService _fileManagementService = new FileManagementService();

        public object GetPrices()
        {
            try
            {
                var query = $@"SELECT id as Id,
                                business_date as BusinessDate,
                                security_id as SecurityId, 
                                symbol as Symbol, 
                                event as Event,
                                price as Price,
                                last_updated_by as LastUpdatedBy,
                                last_updated_on as LastUpdatedOn FROM [dbo].[market_prices] ORDER BY business_date ASC";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<MarketDataPrice>>(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "Market Prices fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching Market Prices");
            }
        }

        public object SetPrices(List<object> obj)
        {
            throw new System.NotImplementedException();
        }

        public async Task<object> Upload(HttpRequestMessage requestMessage)
        {
            try
            {
                var uploadedResult = await Utils.SaveFileToServerAsync(requestMessage, "MarketDataPrices");
                if (!uploadedResult.Item1)
                    return Utils.Wrap(false);

                var path = uploadedResult.Item2;
                var filename = uploadedResult.Item3;
                var recordBody = _fileProcessor.ImportFile(path, "MarketDataPrices", "PerformanceFormats", ',');

                var records = JsonConvert.SerializeObject(recordBody.Item1);
                var performanceRecords = JsonConvert.DeserializeObject<List<MarketDataPrice>>(records);

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
                    new FileInputDto(path, filename, performanceRecords.Count, "MarketDataPrices",
                        "Upload",
                        failedPerformanceList,
                        DateTime.Now)
                };

                _fileManagementService.InsertActivityAndPositionFilesForSilver(fileList);
                /*
                var dailyPerformanceResult = new DailyPnlCalculator().CalculateDailyPerformance(performanceRecords);
                var dailyPerformance = dailyPerformanceResult.GetType().GetProperty("payload")
                    ?.GetValue(dailyPerformanceResult, null);
                */
                foreach(var i in performanceRecords) { i.Event = "upload";
                    i.LastUpdatedOn = DateTime.Now;
                    i.LastUpdatedBy = "webservice"; }

                bool insertinto = InsertData(performanceRecords);
                if (insertinto)
                {
                    return Utils.Wrap(true, performanceRecords, null);
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

                var monthlyPerformanceQuery = $@"DELETE FROM [market_prices] where event = 'upload'";

                sqlHelper.Delete(monthlyPerformanceQuery, CommandType.Text);

                new SQLBulkHelper().Insert("market_prices", obj.ToArray(), sqlHelper.GetConnection(),
                    sqlHelper.GetTransaction());

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



    [RoutePrefix("api/marketdata")]
    public class MarketDataController : ApiController
    {
        private IMarketDataService controller = new MarketDataService();

        [HttpGet, Route("prices")]
        public object GetPrices()
        {
            return controller.GetPrices();
        }

        [HttpPut, Route("prices")]
        public object SetPrices(List<object> obj)
        {
            return controller.SetPrices(obj);
        }

        [HttpPost, Route("prices/upload")]
        public async Task<object> Upload()
        {
            return await controller.Upload(Request);
        }

    }
}