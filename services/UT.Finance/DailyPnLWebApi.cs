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
    public class DailyPnLWebApi
    {
        private static readonly string DailyPnLURL = "/api/calculation/dailyUnofficialPnlAudit/calculate";

        [TestMethod]
        public void DailyPnLCalculations()
        {
            List<DailyPnL> listP = new List<DailyPnL>();
                                                    // BusinessDate, Portfolio, Fund, TradePnL, Day, DailyPnlReturn
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-01-01"), "ASIA_FOCUS", "BBM", 500, 100, 0.001M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-01-02"), "PORTFOLIO-A", "BBM", 1000, 200, 0.002M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-01-03"), "ASIA_FOCUS", "BBM", 8000, 300, 0.003M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-01-04"), "ASIA_FOCUS", "BBM", 9010, 250, 0.008M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-02-01"), "ASIA_FOCUS", "BBM", 8010, 400, 0.004M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-02-02"), "ASIA_FOCUS", "BBM", 9010, 100, 0.001M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-02-03"), "ASIA_FOCUS", "BBM", 8010, 150, 0.005M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-02-04"), "ASIA_FOCUS", "BBM", 60, 10, 0.001M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-03-01"), "ASIA_FOCUS", "BBM", 500, 1, 0.001M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-03-02"), "ASIA_FOCUS", "BBM", 100, 12, 0.0012M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-03-03"), "ASIA_FOCUS", "BBM", 2090, 250, 0.0025M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-03-04"), "ASIA_FOCUS", "BBM", 8502, 400, 0.004M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-04-01"), "ASIA_FOCUS", "BBM", 7600, 12, 0.0012M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-04-02"), "ASIA_FOCUS", "BBM", 2460, 197, 0.00197M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-04-03"), "ASIA_FOCUS", "BBM", 4346, 65, 0.0065M));
            listP.Add(new DailyPnL(Convert.ToDateTime("2019-04-04"), "ASIA_FOCUS", "BBM", 3480, 23, 0.0023M));

            var dailyPnlList = LP.Finance.Common.Utils.PostWebApi("FinanceWebApi", $"{DailyPnLURL}", listP);
            Task.WaitAll(dailyPnlList);

            var response = JsonConvert.DeserializeObject<Response>(dailyPnlList.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);

            var result = JsonConvert.DeserializeObject<List<DailyPnL>>(serializedPayload);

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");
            Assert.IsTrue((Math.Round(result[0].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.001M * 100, 2)) && (Math.Round(result[0].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.001M * 100, 2))
                       && (Math.Round(result[0].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.001M * 100, 2)) && (Math.Round(result[0].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.001M * 100, 2))
                       && (Math.Round(result[0].MTDPnL.Value * 100, 2) == Math.Round(100M * 100, 2)) && (Math.Round(result[0].QTDPnL.Value * 100, 2) == Math.Round(100M * 100, 2))
                       && (Math.Round(result[0].YTDPnL.Value * 100, 2) == Math.Round(100M * 100, 2)) && (Math.Round(result[0].ITDPnL.Value * 100, 2) == Math.Round(100M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[1].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.002M * 100, 2)) && (Math.Round(result[1].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.002M * 100, 2))
                       && (Math.Round(result[1].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.002M * 100, 2)) && (Math.Round(result[1].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.002M * 100, 2))
                       && (Math.Round(result[1].MTDPnL.Value * 100, 2) == Math.Round(200M * 100, 2)) && (Math.Round(result[1].QTDPnL.Value * 100, 2) == Math.Round(200M * 100, 2))
                       && (Math.Round(result[1].YTDPnL.Value * 100, 2) == Math.Round(200M * 100, 2)) && (Math.Round(result[1].ITDPnL.Value * 100, 2) == Math.Round(200M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[2].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.004003M * 100, 2)) && (Math.Round(result[2].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.004003M * 100, 2))
                       && (Math.Round(result[2].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.004003M * 100, 2)) && (Math.Round(result[2].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.004003M * 100, 2))
                       && (Math.Round(result[2].MTDPnL.Value * 100, 2) == Math.Round(400M * 100, 2)) && (Math.Round(result[2].QTDPnL.Value * 100, 2) == Math.Round(400M * 100, 2))
                       && (Math.Round(result[2].YTDPnL.Value * 100, 2) == Math.Round(400M * 100, 2)) && (Math.Round(result[2].ITDPnL.Value * 100, 2) == Math.Round(400M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[3].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.012035M * 100, 2)) && (Math.Round(result[3].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.012035024M * 100, 2))
                       && (Math.Round(result[3].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.012035024M * 100, 2)) && (Math.Round(result[3].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.012035024M * 100, 2))
                       && (Math.Round(result[3].MTDPnL.Value * 100, 2) == Math.Round(650M * 100, 2)) && (Math.Round(result[3].QTDPnL.Value * 100, 2) == Math.Round(650M * 100, 2))
                       && (Math.Round(result[3].YTDPnL.Value * 100, 2) == Math.Round(650M * 100, 2)) && (Math.Round(result[3].ITDPnL.Value * 100, 2) == Math.Round(650M * 100, 2)), "Expected result");

                    
            Assert.IsTrue((Math.Round(result[4].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.004M * 100, 2)) && (Math.Round(result[4].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.016083164096M * 100, 2))
                       && (Math.Round(result[4].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.016083164096M * 100, 2)) && (Math.Round(result[4].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.016083164096M * 100, 2))
                       && (Math.Round(result[4].MTDPnL.Value * 100, 2) == Math.Round(400M * 100, 2)) && (Math.Round(result[4].QTDPnL.Value * 100, 2) == Math.Round(1050M * 100, 2))
                       && (Math.Round(result[4].YTDPnL.Value * 100, 2) == Math.Round(1050M * 100, 2)) && (Math.Round(result[4].ITDPnL.Value * 100, 2) == Math.Round(1050M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[5].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.005004M * 100, 2)) && (Math.Round(result[5].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.017099247260096M * 100, 2))
                       && (Math.Round(result[5].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.017099247260096M * 100, 2)) && (Math.Round(result[5].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.017099247260096M * 100, 2))
                       && (Math.Round(result[5].MTDPnL.Value * 100, 2) == Math.Round(500M * 100, 2)) && (Math.Round(result[5].QTDPnL.Value * 100, 2) == Math.Round(1150M * 100, 2))
                       && (Math.Round(result[5].YTDPnL.Value * 100, 2) == Math.Round(1150M * 100, 2)) && (Math.Round(result[5].ITDPnL.Value * 100, 2) == Math.Round(1150M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[6].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.01002902M * 100, 2)) && (Math.Round(result[6].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.0221847434963965M * 100, 2))
                       && (Math.Round(result[6].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.0221847434963965M * 100, 2)) && (Math.Round(result[6].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.0221847434963965M * 100, 2))
                       && (Math.Round(result[6].MTDPnL.Value * 100, 2) == Math.Round(650M * 100, 2)) && (Math.Round(result[6].QTDPnL.Value * 100, 2) == Math.Round(1300M * 100, 2))
                       && (Math.Round(result[6].YTDPnL.Value * 100, 2) == Math.Round(1300M * 100, 2)) && (Math.Round(result[6].ITDPnL.Value * 100, 2) == Math.Round(1300M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[7].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.01103904902M * 100, 2)) && (Math.Round(result[7].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.0232069282398929M * 100, 2))
                       && (Math.Round(result[7].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.0232069282398929M * 100, 2)) && (Math.Round(result[7].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.0232069282398929M * 100, 2))
                       && (Math.Round(result[7].MTDPnL.Value * 100, 2) == Math.Round(660M * 100, 2)) && (Math.Round(result[7].QTDPnL.Value * 100, 2) == Math.Round(1310M * 100, 2))
                       && (Math.Round(result[7].YTDPnL.Value * 100, 2) == Math.Round(1310M * 100, 2)) && (Math.Round(result[7].ITDPnL.Value * 100, 2) == Math.Round(1310M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[8].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.001M * 100, 2)) && (Math.Round(result[8].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.0242301351681328M * 100, 2))
                       && (Math.Round(result[8].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.0242301351681328M * 100, 2)) && (Math.Round(result[8].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.0242301351681328M * 100, 2))
                       && (Math.Round(result[8].MTDPnL.Value * 100, 2) == Math.Round(1.0M * 100, 2)) && (Math.Round(result[8].QTDPnL.Value * 100, 2) == Math.Round(1311M * 100, 2))
                       && (Math.Round(result[8].YTDPnL.Value * 100, 2) == Math.Round(1311M * 100, 2)) && (Math.Round(result[8].ITDPnL.Value * 100, 2) == Math.Round(1311M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[9].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.0022012M * 100, 2)) && (Math.Round(result[9].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.0254592113303346M * 100, 2))
                       && (Math.Round(result[9].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.0254592113303346M * 100, 2)) && (Math.Round(result[9].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.0254592113303346M * 100, 2))
                       && (Math.Round(result[9].MTDPnL.Value * 100, 2) == Math.Round(13M * 100, 2)) && (Math.Round(result[9].QTDPnL.Value * 100, 2) == Math.Round(1323M * 100, 2))
                       && (Math.Round(result[9].YTDPnL.Value * 100, 2) == Math.Round(1323M * 100, 2)) && (Math.Round(result[9].ITDPnL.Value * 100, 2) == Math.Round(1323M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[10].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.004706703M * 100, 2)) && (Math.Round(result[10].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.0280228593586604M * 100, 2))
                       && (Math.Round(result[10].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.0280228593586604M * 100, 2)) && (Math.Round(result[10].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.0280228593586604M * 100, 2))
                       && (Math.Round(result[10].MTDPnL.Value * 100, 2) == Math.Round(263M * 100, 2)) && (Math.Round(result[10].QTDPnL.Value * 100, 2) == Math.Round(1573M * 100, 2))
                       && (Math.Round(result[10].YTDPnL.Value * 100, 2) == Math.Round(1573M * 100, 2)) && (Math.Round(result[10].ITDPnL.Value * 100, 2) == Math.Round(1573M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[11].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.008725529812M * 100, 2)) && (Math.Round(result[11].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.032134950796095M * 100, 2))
                       && (Math.Round(result[11].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.032134950796095M * 100, 2)) && (Math.Round(result[11].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.032134950796095M * 100, 2))
                       && (Math.Round(result[11].MTDPnL.Value * 100, 2) == Math.Round(663M * 100, 2)) && (Math.Round(result[11].QTDPnL.Value * 100, 2) == Math.Round(1973M * 100, 2))
                       && (Math.Round(result[11].YTDPnL.Value * 100, 2) == Math.Round(1973M * 100, 2)) && (Math.Round(result[11].ITDPnL.Value * 100, 2) == Math.Round(1973M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[12].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.0012M * 100, 2)) && (Math.Round(result[12].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.0012M * 100, 2))
                       && (Math.Round(result[12].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.0333735127370503M * 100, 2)) && (Math.Round(result[12].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.0333735127370503M * 100, 2))
                       && (Math.Round(result[12].MTDPnL.Value * 100, 2) == Math.Round(12.0M * 100, 2)) && (Math.Round(result[12].QTDPnL.Value * 100, 2) == Math.Round(12.0M * 100, 2))
                       && (Math.Round(result[12].YTDPnL.Value * 100, 2) == Math.Round(1985.0M * 100, 2)) && (Math.Round(result[12].ITDPnL.Value * 100, 2) == Math.Round(1985M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[13].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.003172364M * 100, 2)) && (Math.Round(result[13].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.003172364M * 100, 2))
                       && (Math.Round(result[13].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.0354092585571423M * 100, 2)) && (Math.Round(result[13].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.0354092585571423M * 100, 2))
                       && (Math.Round(result[13].MTDPnL.Value * 100, 2) == Math.Round(209.0M * 100, 2)) && (Math.Round(result[13].QTDPnL.Value * 100, 2) == Math.Round(209.0M * 100, 2))
                       && (Math.Round(result[13].YTDPnL.Value * 100, 2) == Math.Round(2182.0M * 100, 2)) && (Math.Round(result[13].ITDPnL.Value * 100, 2) == Math.Round(2182.0M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[14].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.009692984366M * 100, 2)) && (Math.Round(result[14].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.009692984366M * 100, 2))
                       && (Math.Round(result[14].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.0421394187377637M * 100, 2)) && (Math.Round(result[14].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.0421394187377637M * 100, 2))
                       && (Math.Round(result[14].MTDPnL.Value * 100, 2) == Math.Round(274.0M * 100, 2)) && (Math.Round(result[14].QTDPnL.Value * 100, 2) == Math.Round(274.0M * 100, 2))
                       && (Math.Round(result[14].YTDPnL.Value * 100, 2) == Math.Round(2247.0M * 100, 2)) && (Math.Round(result[14].ITDPnL.Value * 100, 2) == Math.Round(2247.0M * 100, 2)), "Expected result");

            Assert.IsTrue((Math.Round(result[15].MTDPercentageReturn.Value * 100, 2) == Math.Round(0.0120152782300418M * 100, 2)) && (Math.Round(result[15].QTDPercentageReturn.Value * 100, 2) == Math.Round(0.0120152782300418M * 100, 2))
                       && (Math.Round(result[15].YTDPercentageReturn.Value * 100, 2) == Math.Round(0.0445363394008606M * 100, 2)) && (Math.Round(result[15].ITDPercentageReturn.Value * 100, 2) == Math.Round(0.0445363394008606M * 100, 2))
                       && (Math.Round(result[13].MTDPnL.Value * 100, 2) == Math.Round(209.0M * 100, 2)) && (Math.Round(result[13].QTDPnL.Value * 100, 2) == Math.Round(209.0M * 100, 2))
                       && (Math.Round(result[13].YTDPnL.Value * 100, 2) == Math.Round(2182.0M * 100, 2)) && (Math.Round(result[13].ITDPnL.Value * 100, 2) == Math.Round(2182.0M * 100, 2)), "Expected result");

        }
    }
}