using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using LP.Finance.Common;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Diagnostics;
using LP.Finance.Common.Dtos;
using System.Reflection;
using System.Linq;
using Newtonsoft.Json.Linq;

namespace UT.Finance
{
    /// <summary>
    /// Summary description for JournalWebApi
    /// </summary>
    [TestClass]
    public class JournalWebApi
    {
        private static readonly string journalsURL = "/api/journal";
        private static readonly string getAccountsURL = "/api/account";
        private static readonly string getJournalsURL = "/api/journal/data/ALL/?pageNumber=0&pageSize=0&sortColum=&sortDirection=&accountId=0&value=0";
        private static readonly string editJournalsURL = "api/journal/dc5a85cd-a002-4078-b387-37525b668653";

        private static readonly string getAllJournalsURL = "/api/journal/data/ALL/?pageNumber=0&pageSize=0";
        private static readonly string trialBalanceReportURL = "/api/journal/trialBalanceReport";
        private static readonly string getFundsURL = "/api/refdata/data?refdata=fund";


        public JournalWebApi()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        [TestMethod]
        public void GetTrialBalanceReport()
        {
            var trialBalanceReport = Utils.GetWebApiData("FinanceWebApi", trialBalanceReportURL);
            Task.WaitAll(trialBalanceReport);
            var response = JsonConvert.DeserializeObject<Response>(trialBalanceReport.Result);
            var serializedStats = JsonConvert.SerializeObject(response.stats);
            dynamic result = JsonConvert.DeserializeObject(serializedStats);

            var responsePayload = JsonConvert.DeserializeObject<Response>(trialBalanceReport.Result);
            var serializedPayload = JsonConvert.SerializeObject(responsePayload.payload);
            dynamic fResult = JsonConvert.DeserializeObject(serializedPayload);

            Assert.IsTrue(fResult.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.totalDebit == result.totalCredit, "Total debit and credit are knocking off");
            Assert.IsTrue(fResult.Count >= 0, "Expected Result");
        }

        [TestMethod]
        public void GetJournalData()
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var journalData = Utils.GetWebApiData("FinanceWebApi", getAllJournalsURL);

            Task.WaitAll(journalData);
            sw.Stop();
            var elapsed = sw.ElapsedMilliseconds / 1000;

            var response = JsonConvert.DeserializeObject<Response>(journalData.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);

            dynamic result = JsonConvert.DeserializeObject(serializedPayload);

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Count != null, "Expected result");
        }

        [TestMethod]
        public void CreateJournal()
        {
            //GET FUNDS
            var getFunds = Utils.GetWebApiData("ReferenceWebApi", getFundsURL);
            Task.WaitAll(getFunds);
            var response = JsonConvert.DeserializeObject<Response>(getFunds.Result);
            var serializedPayload = JsonConvert.SerializeObject(response.payload);
            var result = JsonConvert.DeserializeObject<List<object>>(serializedPayload);
            JObject fundCode = (JObject)result[0];
            var properties = fundCode.Properties();
            var fundCodeValue = properties.Where(x => x.Name == "FundCode").FirstOrDefault().Value.ToString();

            Assert.IsTrue(response.isSuccessful == true, "Request Call Successful");

            //Account From
            var getAccounts = Utils.GetWebApiData("FinanceWebApi", getAccountsURL);
            Task.WaitAll(getAccounts);
            var responseAccountFrom = JsonConvert.DeserializeObject<Response>(getAccounts.Result);
            var serializedPayloads = JsonConvert.SerializeObject(responseAccountFrom.payload);
            var resultAccount = JsonConvert.DeserializeObject<List<object>>(serializedPayloads);
            // Get Value AccountFrom
            JObject accountIdFrom = (JObject)resultAccount[0];
            var accountProperties = accountIdFrom.Properties();
            var accountIdValueFrom = (int)accountProperties.Where(x => x.Name == "AccountId").FirstOrDefault().Value;

            // Get Value AccountTo
            JObject accountIdTo = (JObject)resultAccount[1];
            var accountPropertiesTo = accountIdTo.Properties();
            var accountIdValueTo = (int)accountPropertiesTo.Where(x => x.Name == "AccountId").FirstOrDefault().Value;

            Assert.IsTrue(responseAccountFrom.isSuccessful == true, "Request Call Successful");

            var payload = new JournalInputDto
            {
                AccountFrom = accountIdValueFrom,
                AccountTo = accountIdValueTo,
                Fund = fundCodeValue,
                Value = 123321123
            };

            var Invalidpayload = new JournalInputDto
            {
                AccountFrom = 0,
                AccountTo = 0,
                Fund = "",
                Value = 0
            };

            var createJournal = Utils.PostWebApi("FinanceWebApi", $"{journalsURL}", payload);
            Task.WaitAll(createJournal);
            dynamic resultJournal = JsonConvert.DeserializeObject<object>(createJournal.Result);
            Assert.IsTrue(resultJournal.isSuccessful == true, "Journal Added");

            var createJournalInvalid = Utils.PostWebApi("FinanceWebApi", $"{journalsURL}", Invalidpayload);
            Task.WaitAll(createJournalInvalid);
            dynamic resultJournalInvalid = JsonConvert.DeserializeObject<object>(createJournalInvalid.Result);
            Assert.IsTrue(resultJournalInvalid.isSuccessful == false, "The Request Failed! Try Again");
        }

        [TestMethod]
        public void UpdateJournalData()
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var journalData = Utils.GetWebApiData("FinanceWebApi", getJournalsURL);

            Task.WaitAll(journalData);
            sw.Stop();
            var elapsed = sw.ElapsedMilliseconds / 1000;

            var response = JsonConvert.DeserializeObject<Response>(journalData.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);

            var result = JsonConvert.DeserializeObject<List<object>>(serializedPayload);
            JObject JournalId = (JObject)result[0];
            var properties = JournalId.Properties();
            var JournalIdValue = properties.Where(x => x.Name == "source").FirstOrDefault().Value.ToString();

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");

            //Account From
            var getAccounts = Utils.GetWebApiData("FinanceWebApi", getAccountsURL);
            Task.WaitAll(getAccounts);
            var responseAccountFrom = JsonConvert.DeserializeObject<Response>(getAccounts.Result);
            var serializedPayloads = JsonConvert.SerializeObject(responseAccountFrom.payload);
            var resultAccount = JsonConvert.DeserializeObject<List<object>>(serializedPayloads);

            // Get Value AccountFrom
            JObject accountIdFrom = (JObject)resultAccount[0];
            var accountProperties = accountIdFrom.Properties();
            var accountIdValueFrom = (int)accountProperties.Where(x => x.Name == "AccountId").FirstOrDefault().Value;

            // Get Value AccountTo
            JObject accountIdTo = (JObject)resultAccount[1];
            var accountPropertiesTo = accountIdTo.Properties();
            var accountIdValueTo = (int)accountPropertiesTo.Where(x => x.Name == "AccountId").FirstOrDefault().Value;


            var payload = new JournalInputDto
            {
                AccountFrom = accountIdValueFrom,
                AccountTo = accountIdValueTo,
                Fund = "ASIA_FOCUS",
                Value = 123321123
            };

            var updateJournal = Utils.PutWebApi("FinanceWebApi", $"/api/journal/{JournalIdValue}", payload);
            Task.WaitAll(updateJournal);
            dynamic resultUpdateJournal = JsonConvert.DeserializeObject<Response>(updateJournal.Result);
            Assert.IsTrue(resultUpdateJournal.isSuccessful == true, "Journal Updated");
        }


        [TestMethod]
        public void DeleteJournal()
        {
            Stopwatch sw = new Stopwatch();
            sw.Start();
            var journalData = Utils.GetWebApiData("FinanceWebApi", getJournalsURL);

            Task.WaitAll(journalData);
            sw.Stop();
            var elapsed = sw.ElapsedMilliseconds / 1000;

            var response = JsonConvert.DeserializeObject<Response>(journalData.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);

            var result = JsonConvert.DeserializeObject<List<object>>(serializedPayload);
            JObject JournalId = (JObject)result[0];
            var properties = JournalId.Properties();
            var JournalIdValue = properties.Where(x => x.Name == "source").FirstOrDefault().Value.ToString();

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");

            var deleteJournal = Utils.DeleteWebApi("FinanceWebApi", $"/api/journal/{JournalIdValue}");
            Task.WaitAll(deleteJournal);
            dynamic resultUpdateJournal = JsonConvert.DeserializeObject<Response>(deleteJournal.Result);
            Assert.IsTrue(resultUpdateJournal.isSuccessful == true, "Journal Deleted");
        }

        }
}
