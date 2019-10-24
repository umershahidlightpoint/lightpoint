using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using LP.Finance.Common.Model;
using Newtonsoft.Json;

namespace UT.Finance
{
    [TestClass]
    public class PerformanceWebApi
    {
        private static readonly string performanceURL = "/api/calculation/monthlyPerformance";

        [TestMethod]
        public void TestPerformanceCalculations()
        {
            List<MonthlyPerformance> listP = new List<MonthlyPerformance>();
            // id, monthEndNav, startOfMonthEstimateNav, estimated, performance, mtd, fund, portfolio, performanceDate
            listP.Add(new MonthlyPerformance(1, 101000000, 100000000, true, 1000000, 0.0099009900990099m, "LP", "PortfolioA", Convert.ToDateTime("2019-01-01")));
            listP.Add(new MonthlyPerformance(2, 102000000, 100000000, true, 2000000, 0.0196078431372549m, "LP", "PortfolioA", Convert.ToDateTime("2019-02-01")));
            listP.Add(new MonthlyPerformance(3, 104000000, 100000000, false, 4000000, 0.0384615384615385m, "BBM", "ASIA_FOCUS", Convert.ToDateTime("2019-03-01")));
            listP.Add(new MonthlyPerformance(4, 108000000, 100000000, true, 1000000, 0.00925925925925926m, "BOOTHBAY", "BOOTHBAY-ASIA_FOCUS", Convert.ToDateTime("2019-04-01")));
            listP.Add(new MonthlyPerformance(5, 1000000, 100000000, false, -5000000, 0.0272727272727273m, "LP", "PortfolioA", Convert.ToDateTime("2019-05-01")));
            listP.Add(new MonthlyPerformance(6, 3000000, 100000000, true, -3000000, -0.0283018867924528m, "BBM", "ASIA_FOCUS", Convert.ToDateTime("2019-06-01")));
            listP.Add(new MonthlyPerformance(7, -5000000, 100000000, false, 6000000, 0.06m, "BOOTHBAY", "BOOTHBAY-ASIA_FOCUS", Convert.ToDateTime("2019-07-01")));
            listP.Add(new MonthlyPerformance(8, -3000000, 100000000, true, 8000000, 0.0714285714285714m, "LP", "PortfolioA", Convert.ToDateTime("2019-08-01")));

            var performanceList = LP.Finance.Common.Utils.PostWebApi("FinanceWebApi", $"{performanceURL}", listP);
            Task.WaitAll(performanceList);

            var result = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(performanceList.Result);

                Assert.IsTrue((result[0].MTD == result[0].YTD) && (result[0].MTD == result[0].QTD) && (result[0].MTD == result[0].ITD), "Expected result");

                Assert.IsTrue((result[1].QTD == 0.0297029702970296999805862939M) && (result[1].YTD == 0.0297029702970296999805862939M) && (result[1].ITD == 0.0297029702970296999805862939M), "Expected result");

                Assert.IsFalse((result[1].QTD == 0.0297029702970296999805862939M) && (result[1].YTD == 0.0297029702970296999805862939M) && (result[1].ITD == 0.0297029702970296999805862939M), "Expected result");

                Assert.IsTrue((result[2].QTD == 0.0693069306930693434299538551M) && (result[2].YTD == 0.0693069306930693434299538551M) && (result[2].ITD == 0.0693069306930693434299538551M), "Expected result");

                Assert.IsTrue((result[3].QTD == 0.0693069306930693434299538551M) && (result[3].YTD == 0.0792079207920792455500881913M) && (result[3].ITD == 0.0792079207920792455500881913M), "Expected result");

                Assert.IsTrue((result[4].QTD == 0.1086408640864087089525793454M) && (result[4].YTD == 0.1086408640864087089525793454M) && (result[3].ITD == 0.0693069306930693434299538551M), "Expected result");

            }

    }

}