﻿using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using LP.Finance.Common;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Diagnostics;
using LP.Finance.Common.Dtos;

namespace UT.Finance
{
    /// <summary>
    /// Summary description for JournalWebApi
    /// </summary>
    [TestClass]
    public class JournalWebApi
    {
        private static readonly string journalsURL = "/api/journal";
        private static readonly string getAllJournalsURL = "/api/journal/data/ALL/?pageNumber=0&pageSize=0";
        private static readonly string trialBalanceReportURL = "/api/journal/trialBalanceReport";

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
    }
}
