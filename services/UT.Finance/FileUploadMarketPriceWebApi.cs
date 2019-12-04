using System;
using System.IO;
using LP.Finance.Common;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using LP.Finance.Common.Model;
using System.Collections.Generic;

namespace UT.Finance
{
    [TestClass]
    public class FileUploadMarketPriceWebApi
    {
        private static readonly string fileUploadMarketPriceUrl = "/api/marketdata/prices/upload";
        private static readonly string getMarketPriceUrl = "/api/marketdata/prices"; // Used for edit and get request

        [TestMethod]
        public void TestUploadMarketDuplicates()
        {
            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            var filename = "MarketDataPricesDup.csv";
            var folder = currentDir + Path.DirectorySeparatorChar + "TestFiles" + Path.DirectorySeparatorChar + $"{filename}";

            var marketList = Utils.PostFileApi("FinanceWebApi", $"{fileUploadMarketPriceUrl}", folder);
            Task.WaitAll(marketList);

            var response = JsonConvert.DeserializeObject<Response>(marketList.Result);
            var serializedPayload = JsonConvert.SerializeObject(response.payload);
            var result = JsonConvert.DeserializeObject<List<MarketDataPrice>>(serializedPayload);

            Assert.IsTrue(result.Count > 0, "Duplication Detected: Expected successful response");

        }

        [TestMethod]
        public void TestUploadMarketsNoDuplicates()
        {
            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            var filename = "MarketDataPrices.csv";
            var folder = currentDir + Path.DirectorySeparatorChar + "TestFiles" + Path.DirectorySeparatorChar + $"{filename}";

            var marketList = Utils.PostFileApi("FinanceWebApi", $"{fileUploadMarketPriceUrl}", folder);
            Task.WaitAll(marketList);
            var response = JsonConvert.DeserializeObject<Response>(marketList.Result);

            Assert.IsTrue(Convert.ToInt32(response.statusCode) == 200, "No Duplication Detected: Expected successful response");

        }

        [TestMethod]
        public void GetnUpdateRow()
        {
            // Get Market Rates
            var marketRatesData = Utils.GetWebApiData("FinanceWebApi", getMarketPriceUrl);
            Task.WaitAll(marketRatesData);

            var response = JsonConvert.DeserializeObject<Response>(marketRatesData.Result);
            var serializedPayload = JsonConvert.SerializeObject(response.payload);
            var result = JsonConvert.DeserializeObject<List<MarketDataPrice>>(serializedPayload);

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Count > 0, "Data exists in MarketRates");

            // Update MarketRatesRow
            var id = result[0].Id;
            var price = 12345m;

            var payload = new List<object> {
                      new {
                        Id = id,
                        Price = price
                    }};

            var updateMarketRateRow = Utils.PutWebApi("FinanceWebApi", $"/api/marketdata/prices", payload);
            Task.WaitAll(updateMarketRateRow);

            var getResponse = JsonConvert.DeserializeObject<Response>(updateMarketRateRow.Result);
            Assert.IsTrue(getResponse.isSuccessful, "Expected Results: Price Updated Successfully");

            // Get Audit Trail
            var getAuditTrail = Utils.GetWebApiData("FinanceWebApi", $"/api/marketdata/audit?id={id}");
            Task.WaitAll(getAuditTrail);

            var getAuditResponse = JsonConvert.DeserializeObject<Response>(getAuditTrail.Result);
            var serializPayload = JsonConvert.SerializeObject(getAuditResponse.payload);
            var finalResult = JsonConvert.DeserializeObject<List<MarketDataPrice>>(serializPayload);

            Assert.IsTrue(getAuditResponse.isSuccessful, "Request Call Successful");
            Assert.IsTrue(finalResult.Count > 0, "Expected Results");
        }

    }
}
