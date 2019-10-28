using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LP.Finance.Common;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace UT.Finance
{
    [TestClass]
    public class ReportsWebApi
    {

        private static readonly string getAllgetCostBasisReportURL = "/api/journal/costbasisReport?date=null&fund=ALL";
        private static readonly string getTaxLotReportURL = "/api/journal/taxlotReport?from=null&to=null&fund=ALL";

        public ReportsWebApi()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        [TestMethod]
        public void getCostBasisReport()
        {

            var getCostBasisReport = Utils.GetWebApiData("FinanceWebApi", getAllgetCostBasisReportURL);

            Task.WaitAll(getCostBasisReport);

            dynamic result = JsonConvert.DeserializeObject<object>(getCostBasisReport.Result);

            Assert.IsTrue(result.data.Count >= 0, "Expected result");

        }

        [TestMethod]
        public void getTaxLotReport()
        {

            var getTaxLotReport = Utils.GetWebApiData("FinanceWebApi", getTaxLotReportURL);

            Task.WaitAll(getTaxLotReport);

            dynamic result = JsonConvert.DeserializeObject<object>(getTaxLotReport.Result);

            Assert.IsTrue(result.data.Count >= 0, "Expected result");

        }

    }

}
