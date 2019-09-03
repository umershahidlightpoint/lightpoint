using System;
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

            dynamic result = JsonConvert.DeserializeObject<object>(trialBalanceReport.Result);

            Assert.IsTrue(result.stats.totalDebit == result.stats.totalCredit, "Total debit and credit are knocking off");
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

            dynamic result = JsonConvert.DeserializeObject<object>(journalData.Result);

            Assert.IsTrue(result.data != null, "Expected result");
        }
    }
}
