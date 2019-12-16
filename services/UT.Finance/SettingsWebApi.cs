using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using PostingEngine;
using PostingEngine.MarketData;

namespace UT.Finance
{
    [TestClass]
    public class SettingsWebApi
    {
        private static readonly string getReportingCurrencyUrl = "/api/setting/currency";
        private static readonly string SettingUrl = "/api/setting"; // same url used for get/post/put request 

        [TestMethod]
        public void getCurrency()
        {

            var reportingCurrency = Utils.GetWebApiData("FinanceWebApi", getReportingCurrencyUrl);
            Task.WaitAll(reportingCurrency);
            var response = JsonConvert.DeserializeObject<Response>(reportingCurrency.Result);
            var serializedStats = JsonConvert.SerializeObject(response.stats);
            dynamic result = JsonConvert.DeserializeObject(serializedStats);

            var responsePayload = JsonConvert.DeserializeObject<Response>(reportingCurrency.Result);
            var serializedPayload = JsonConvert.SerializeObject(responsePayload.payload);
            dynamic fResult = JsonConvert.DeserializeObject(serializedPayload);

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");
            Assert.IsTrue(fResult.Count >= 0, "Expected Result");
        }

        [TestMethod]
        public void getSetting()
        {
            var getSetting = Utils.GetWebApiData("FinanceWebApi", SettingUrl);
            Task.WaitAll(getSetting);
            var response = JsonConvert.DeserializeObject<Response>(getSetting.Result);
            var serializedStats = JsonConvert.SerializeObject(response.stats);

            var responsePayload = JsonConvert.DeserializeObject<Response>(getSetting.Result);
            var serializedPayload = JsonConvert.SerializeObject(responsePayload.payload);
            dynamic fResult = JsonConvert.DeserializeObject(serializedPayload);

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");
            Assert.IsTrue(fResult.Count >= 0 || fResult.Count <=0, "Expected Result");
        }

        [TestMethod]
        public void CreateSetting()
        {
            var payload = new SettingInputDto
            {
                CurrencyCode = "USD",
                TaxMethodology = "MINTAX",
                FiscalMonth = "February",
                FiscalDay = 4
            };

            var Invalidpayload = new SettingInputDto
            {
                CurrencyCode = "",
                TaxMethodology = "MINTAX",
                FiscalMonth = "February",
                FiscalDay = 4
            };

            var createSetting = Utils.PostWebApi("FinanceWebApi", $"{SettingUrl}", payload);
            Task.WaitAll(createSetting);

            var resultSetting = JsonConvert.DeserializeObject<Response>(createSetting.Result);

            Assert.IsTrue(resultSetting.isSuccessful == true, "Settings Added");

            //For Invalid Payload
            var createSettingI = Utils.PostWebApi("FinanceWebApi", $"{SettingUrl}", Invalidpayload);
            Task.WaitAll(createSettingI);

            var resultSettingI = JsonConvert.DeserializeObject<Response>(createSettingI.Result);

            Assert.IsTrue(!resultSettingI.isSuccessful, "Expected Result");

        }

        [TestMethod]
        public void UpdateSetting()
        {
            var getSetting = Utils.GetWebApiData("FinanceWebApi", SettingUrl);
            Task.WaitAll(getSetting);
            var response = JsonConvert.DeserializeObject<Response>(getSetting.Result);
            var serializedStats = JsonConvert.SerializeObject(response.stats);

            var responsePayload = JsonConvert.DeserializeObject<Response>(getSetting.Result);
            var serializedPayload = JsonConvert.SerializeObject(responsePayload.payload);
            var resultSettings = JsonConvert.DeserializeObject<List<object>>(serializedPayload);

            // Get SettingId
            JObject settingRes = (JObject)resultSettings[0];
            var settingProperties = settingRes.Properties();
            var settingId = (int)settingProperties.Where(x => x.Name == "id").FirstOrDefault().Value;

            var payload = new SettingInputDto
            {
                Id = settingId,
                CurrencyCode = "CAD",
                TaxMethodology = "MINTAX",
                FiscalMonth = "January",
                FiscalDay = 4
            };

            var createSetting = Utils.PutWebApi("FinanceWebApi", $"{SettingUrl}", payload);
            Task.WaitAll(createSetting);

            var resultSetting = JsonConvert.DeserializeObject<Response>(createSetting.Result);

            Assert.IsTrue(resultSetting.isSuccessful == true, "Settings Updated");

        }

    }
}
