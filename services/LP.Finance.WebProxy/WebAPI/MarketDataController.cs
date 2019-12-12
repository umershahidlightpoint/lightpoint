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
using System.Data.SqlClient;
using System.Linq;

namespace LP.Finance.WebProxy.WebAPI
{
    public interface IMarketDataService
    {
        Task<object> Upload(HttpRequestMessage requestMessage);
        object GetPrices();
        object SetPrices(List<MarketPriceInputDto> obj);
        object AuditTrail(int id);
        object GetSymbolPrice(string symbol);

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

        public object SetPrices(List<MarketPriceInputDto> obj)
        {
            List<List<SqlParameter>> listOfParameters = new List<List<SqlParameter>>();
            foreach (var item in obj)
            {
                List<SqlParameter> marketPriceParams = new List<SqlParameter>
                {
                    new SqlParameter("id", item.Id),
                    new SqlParameter("price", item.Price),
                    new SqlParameter("event", "modified"),
                    new SqlParameter("lastUpdatedBy", "John Smith"),
                    new SqlParameter("lastUpdatedOn", DateTime.UtcNow)
                };

                listOfParameters.Add(marketPriceParams);
            }

            SqlHelper sqlHelper = new SqlHelper(ConnectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var query = $@"UPDATE [dbo].[market_prices]
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

                return Utils.Wrap(true, null, HttpStatusCode.OK, "Prices updated successfully");
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();

                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while updating prices");
            }
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
                foreach (var i in performanceRecords)
                {
                    i.Event = "upload";
                    i.LastUpdatedOn = DateTime.Now;
                    i.LastUpdatedBy = "webservice";
                }

                bool insertinto = InsertData(performanceRecords);

                var dupesTemp = performanceRecords.GroupBy(x => new { x.BusinessDate, x.Symbol }).ToList();
                var dupes = dupesTemp.Where(x => x.Skip(1).Any()).ToList();
                if (dupes.Any())
                {
                    var items = dupes.SelectMany(x => x.Select(y => y)).ToList();
                    var metaData = MetaData.ToMetaData(items[0]);
                    foreach (var item in metaData.Columns)
                    {
                        Console.WriteLine(item);
                    }
                    return Utils.Wrap(true, items, HttpStatusCode.Forbidden, null, metaData.Columns);
                }

                if (insertinto)
                {
                    return Utils.Wrap(true, null, HttpStatusCode.OK);
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

                var monthlyPerformanceQuery = $@" DELETE FROM [market_prices_history]
                                                  DELETE FROM [market_prices]";

                sqlHelper.Delete(monthlyPerformanceQuery, CommandType.Text);

                new SQLBulkHelper().Insert("market_prices", obj.ToArray(), sqlHelper.GetConnection(),
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

        public object AuditTrail(int id)
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
                                last_updated_on as LastUpdatedOn FROM [dbo].[market_prices_history] history where market_price_id = {id}";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<MarketDataPrice>>(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "Market Prices Audit Trail fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching Market Prices Audit Trail");
            }
        }

        public object GetSymbolPrice(string symbol)
        {
            try
            {
                List<List<SqlParameter>> listOfParameters = new List<List<SqlParameter>>();

                List<SqlParameter> symbolPriceParamter = new List<SqlParameter>
                {
                    new SqlParameter("symbol",symbol)
                };

                listOfParameters.Add(symbolPriceParamter);

                var query = $@"SELECT id as Id,
                                business_date as BusinessDate,
                                security_id as SecurityId, 
                                symbol as Symbol, 
                                event as Event,
                                price as Price,
                                last_updated_by as LastUpdatedBy,
                                last_updated_on as LastUpdatedOn FROM [dbo].[market_prices_history] history where [symbol] = @symbol";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text, symbolPriceParamter.ToArray());

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<MarketDataPrice>>(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "Market Price for Particular Symbol fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError, "An error occured while fetching Market Prices of Particular Symbol");
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

        [HttpGet, Route("audit")]
        public object GetAuditTrail(int id)
        {
            return controller.AuditTrail(id);
        }

        [HttpPut, Route("prices")]
        public object SetPrices(List<MarketPriceInputDto> obj)
        {
            return controller.SetPrices(obj);
        }

        [HttpPost, Route("prices/upload")]
        public async Task<object> Upload()
        {
            return await controller.Upload(Request);
        }

        [HttpGet, Route("getSymbolPrices")]
        public object GetSymbolPrice(string symbol)
        {
            return controller.GetSymbolPrice(symbol);
        }

    }
}