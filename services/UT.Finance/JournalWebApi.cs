using System;
using System.Text;
using System.Collections.Generic;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using LP.Finance.Common;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace UT.Finance
{
    /// <summary>
    /// Summary description for JournalWebApi
    /// </summary>
    [TestClass]
    public class JournalWebApi
    {
        private static readonly string journalsURL = "/api/journal";
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

            Assert.IsTrue((result.stats.totalDebit * -1) == result.stats.totalCredit, "Total debit and credit are knocking off");
        }
    }
}
