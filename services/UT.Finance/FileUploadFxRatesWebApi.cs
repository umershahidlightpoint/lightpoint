using System;
using System.IO;
using System.Collections.Generic;
using LP.Finance.Common;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using LP.Finance.Common.Model;

namespace UT.Finance
{
    [TestClass]
    public class FileUploadFxRatesWebApi
    {
        private static readonly string fileUploadFxRatesUrl = "/api/fxRates/upload";
        private static readonly string getFxRatePriceUrl = "/api/fxRates/fxRate"; // Used for edit and get request

        [TestMethod]
        public void TestUploadFxRatesDuplicates()
        {
            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            var filename = "FxRatesDup.csv";
            var folder = currentDir + Path.DirectorySeparatorChar + "TestFiles" + Path.DirectorySeparatorChar + $"{filename}";

            var performanceList = Utils.PostFileApi("FinanceWebApi", $"{fileUploadFxRatesUrl}", folder);

            Task.WaitAll(performanceList);

            var response = JsonConvert.DeserializeObject<Response>(performanceList.Result);
            var serializedPayload = JsonConvert.SerializeObject(response.payload);
            var result = JsonConvert.DeserializeObject<List<FxRate>>(serializedPayload);

            Assert.IsTrue(result.Count > 0, "Duplication Detected: Expected successful response");

        }

        [TestMethod]
        public void TestUploadFxRatesNoDuplicates()
        {
            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            var filename = "FxRates.csv";
            var folder = currentDir + Path.DirectorySeparatorChar + "TestFiles" + Path.DirectorySeparatorChar + $"{filename}";

            var performanceList = Utils.PostFileApi("FinanceWebApi", $"{fileUploadFxRatesUrl}", folder);

            Task.WaitAll(performanceList);

            var response = JsonConvert.DeserializeObject<Response>(performanceList.Result);
            var serializedPayload = JsonConvert.SerializeObject(response.payload);
            var result = JsonConvert.DeserializeObject<List<FxRate>>(serializedPayload);

            Assert.IsTrue(result.Count > 0, "No Duplication Detected: Expected successful response");

        }

        [TestMethod]
        public void GetnUpdateRow()
        {
            // Get FxRates
            var fxRatesData = Utils.GetWebApiData("FinanceWebApi", getFxRatePriceUrl);
            Task.WaitAll(fxRatesData);

            var response = JsonConvert.DeserializeObject<Response>(fxRatesData.Result);
            var serializedPayload = JsonConvert.SerializeObject(response.payload);
            var result = JsonConvert.DeserializeObject<List<MarketDataPrice>>(serializedPayload);

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Count > 0, "Data exists in GetFxRates");

            // Update FxRateRow
            var id = result[0].Id;
            var price = 12345m;

            var payload = new List<object> {
                      new {
                        Id = id,
                        Price = price
                    }};

            var updateFxRateRow = Utils.PutWebApi("FinanceWebApi", $"/api/fxRates/fxRate", payload);
            Task.WaitAll(updateFxRateRow);

            var getResponse = JsonConvert.DeserializeObject<Response>(updateFxRateRow.Result);
            Assert.IsTrue(getResponse.isSuccessful, "Expected Results: Price Updated Successfully");

            // Get Audit Trail
            var getAuditTrail = Utils.GetWebApiData("FinanceWebApi", $"/api/fxRates/audit?id={id}");
            Task.WaitAll(getAuditTrail);
 
            var getAuditResponse = JsonConvert.DeserializeObject<Response>(getAuditTrail.Result);
            var serializPayload = JsonConvert.SerializeObject(getAuditResponse.payload);
            var finalResult = JsonConvert.DeserializeObject<List<MarketDataPrice>>(serializPayload);

            Assert.IsTrue(getAuditResponse.isSuccessful, "Request Call Successful");
            Assert.IsTrue(finalResult.Count > 0, "Expected Results");
        }
    }
}
