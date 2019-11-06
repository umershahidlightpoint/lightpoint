using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using System.Threading.Tasks;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using LP.Finance.Common;

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

            var response = JsonConvert.DeserializeObject<Response>(performanceList.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);

            var result = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(serializedPayload);

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");

            Assert.IsTrue((Math.Round(result[0].MTD.Value *100,2) == Math.Round(result[0].YTD * 100, 2)) && (Math.Round(result[0].MTD.Value * 100, 2) == Math.Round(result[0].QTD * 100, 2)) && (Math.Round(result[0].MTD.Value * 100, 2) == Math.Round(result[0].ITD * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[1].QTD * 100, 2) == Math.Round(0.0297029702970297M * 100, 2)) && (Math.Round(result[1].YTD * 100, 2) == Math.Round(0.0297029702970297M * 100, 2)) && (Math.Round(result[1].ITD * 100, 2) == Math.Round(0.0297029702970297M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[2].QTD * 100, 2) == Math.Round(0.0384615384615385M * 100, 2)) && (Math.Round(result[2].YTD * 100, 2) == Math.Round(0.0384615384615385M * 100, 2)) && (Math.Round(result[2].ITD * 100, 2) == Math.Round(0.0384615384615385M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[3].QTD *100, 2) == Math.Round(0.00925925925925926M * 100, 2)) && (Math.Round(result[3].YTD * 100, 2) == Math.Round(0.00925925925925926M * 100, 2)) && (Math.Round(result[3].ITD * 100, 2) == Math.Round(0.00925925925925926M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[4].QTD *100,2) == Math.Round(0.0272727272727273M * 100, 2)) && (Math.Round(result[4].YTD * 100, 2) == Math.Round(0.0577857785778578M * 100, 2)) && (Math.Round(result[4].ITD * 100, 2) == Math.Round(0.0577857785778578M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[5].QTD * 100, 2) == Math.Round(-0.0283018867924528M * 100, 2)) && (Math.Round(result[5].YTD * 100, 2) == Math.Round(0.0090711175616837M * 100, 2)) && (Math.Round(result[5].ITD * 100, 2) == Math.Round(0.0090711175616837M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[6].QTD * 100, 2) == Math.Round(0.06M * 100, 2)) && (Math.Round(result[6].YTD * 100, 2) == Math.Round(0.0698148148148148M * 100, 2)) && (Math.Round(result[6].ITD * 100, 2) == Math.Round(0.0698148148148148M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[7].QTD * 100, 2) == Math.Round(0.0714285714285714M * 100, 2)) && (Math.Round(result[7].YTD * 100, 2) == Math.Round(0.13334190561913331M * 100, 2)) && (Math.Round(result[7].ITD * 100, 2) == Math.Round(0.13334190561913331M * 100, 2)), "Expected result");

        }

    }

}