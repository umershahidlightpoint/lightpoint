using LP.Finance.Common.Model;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using System.Net.Http;
using LP.Finance.Common;
using System;
using System.Configuration;
using Newtonsoft.Json;
using LP.Finance.Common.Dtos;
using System.Data;
using System.Net;
using System.Data.SqlClient;
using System.Linq;
using LP.FileProcessing;
using LP.Finance.Common.IO;
using LP.Shared.FileMetaData;
using LP.Shared.Sql;

namespace LP.Finance.WebProxy.WebAPI
{
    public interface IMarketDataService
    {
        object GetPrices();
        object SetPrices(List<MarketPriceInputDto> obj);
        Task<object> Upload(HttpRequestMessage requestMessage);
        object CommitMarketPrice(List<MarketDataPrice> marketDataPrices);
        object AuditTrail(int id);
        object GetSymbolPrice(string symbol);
    }

    internal class MarketDataService : IMarketDataService
    {
        private static readonly string
            ConnectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

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

                var dataTable = new SqlHelper(ConnectionString).GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<MarketDataPrice>>(jsonResult);

                return Shared.WebApi.Wrap(true, json, HttpStatusCode.OK, "Market Prices fetched successfully");
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    $"An error occured while fetching Market Prices:{ex.Message}");
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
                var uploadedResult = await Utils.SaveFileToServerAsync(requestMessage, "MarketDataPrices");
                if (!uploadedResult.Item1)
                    return Shared.WebApi.Wrap(false);

                var path = uploadedResult.Item2;
                var filename = uploadedResult.Item3;

                List<MarketDataPrice> marketDataPrices;

                var recordBody = new FileProcessor().ImportFile(path, "MarketDataPrices", "ImportFormats", ',', true);

                var records = JsonConvert.SerializeObject(recordBody.Item1);

                try
                {
                    marketDataPrices = JsonConvert.DeserializeObject<List<MarketDataPrice>>(records);
                }
                catch (Exception ex)
                {
                    foreach (var item in recordBody.Item2)
                    {
                        var marketDataElement = recordBody.Item1.ElementAt(item.RowNumber - 1);
                        marketDataElement.IsUploadInValid = true;
                        marketDataElement.UploadException = JsonConvert.SerializeObject(item);
                    }

                    var payload = new
                    {
                        EnableCommit = false,
                        Data = recordBody.Item1
                    };

                    return Shared.WebApi.Wrap(true, payload, HttpStatusCode.OK);
                }

                foreach (var i in marketDataPrices)
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
                    var marketDataElement = marketDataPrices.ElementAt(item.RowNumber - 1);
                    marketDataElement.IsUploadInValid = true;
                    marketDataElement.UploadException = JsonConvert.SerializeObject(item);
                }

                if (failedRecords.Count > 0)
                {
                    enableCommit = false;
                }

                var failedMarketDataList =
                    fileManager.MapFailedRecords(failedRecords, DateTime.Now, uploadedResult.Item3);

                List<FileInputDto> fileList = new List<FileInputDto>
                {
                    new FileInputDto(path, filename, marketDataPrices.Count, "MarketDataPrices",
                        "Upload",
                        failedMarketDataList,
                        DateTime.Now)
                };

                fileManager.InsertFiles(fileList);

                var data = new
                {
                    EnableCommit = enableCommit,
                    Data = marketDataPrices
                };

                return Shared.WebApi.Wrap(true, data, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    $"An error occured:{ex.Message}");
            }
        }

        public object CommitMarketPrice(List<MarketDataPrice> marketDataPrices)
        {
            /*
            var dailyPerformanceResult = new DailyPnlCalculator().CalculateDailyPerformance(performanceRecords);
                var dailyPerformance = dailyPerformanceResult.GetType().GetProperty("payload")
                    ?.GetValue(dailyPerformanceResult, null);
            */

            var insertionStatus = InsertData(marketDataPrices);

            /*
            var duplicates = marketDataPrices.GroupBy(x => new {x.BusinessDate, x.Symbol}).ToList();
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

                var dataTable = new SqlHelper(ConnectionString).GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<MarketDataPrice>>(jsonResult);

                return Shared.WebApi.Wrap(true, json, HttpStatusCode.OK,
                    "Market Prices Audit Trail fetched successfully");
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    $"An error occured while fetching Market Prices Audit Trail:{ex.Message}");
            }
        }

        public object GetSymbolPrice(string symbol)
        {
            try
            {
                List<List<SqlParameter>> listOfParameters = new List<List<SqlParameter>>();

                List<SqlParameter> symbolPriceParamter = new List<SqlParameter>
                {
                    new SqlParameter("symbol", symbol)
                };

                listOfParameters.Add(symbolPriceParamter);

                var query = $@"SELECT id as Id,
                                business_date as BusinessDate,
                                security_id as SecurityId, 
                                symbol as Symbol, 
                                event as Event,
                                price as Price,
                                last_updated_by as LastUpdatedBy,
                                last_updated_on as LastUpdatedOn FROM [dbo].[market_prices_history] history where [symbol] = @symbol order by business_date desc";

                var dataTable =
                    new SqlHelper(ConnectionString).GetDataTable(query, CommandType.Text,
                        symbolPriceParamter.ToArray());

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<MarketDataPrice>>(jsonResult);

                return Shared.WebApi.Wrap(true, json, HttpStatusCode.OK,
                    "Market Price for Particular Symbol fetched successfully");
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching Market Prices of Particular Symbol");
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

        [HttpPost, Route("prices/commit")]
        public object CommitMarketPrice(List<MarketDataPrice> marketDataPrices)
        {
            return controller.CommitMarketPrice(marketDataPrices);
        }

        [HttpGet, Route("getSymbolPrices")]
        public object GetSymbolPrice(string symbol)
        {
            return controller.GetSymbolPrice(symbol);
        }
    }
}