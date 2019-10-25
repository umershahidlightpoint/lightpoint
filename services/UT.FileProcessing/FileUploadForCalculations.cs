using LP.FileProcessing;
using LP.Finance.Common;
using LP.Finance.Common.Model;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace UT.FileProcessing
{
    [TestFixture]
    public class FileUploadForCalculations
    {
        private static readonly string performanceURL = "/api/calculation/monthlyPerformance";
        private string financeWebAPI = null;

        [OneTimeSetUp]
        public void Setup()
        {
            var config = new ConfigurationBuilder()
                .AddJsonFile("appsettings.json")
                .Build();
            financeWebAPI = config["WebAPI:FinanceWebApi"];
        }

        [Test]        public void TestUploadMonthlyPerformance()        {            var currentDir = AppDomain.CurrentDomain.BaseDirectory;            var filename = "PerformanceDataFile.csv";            var folder = currentDir + "TestFiles" + Path.DirectorySeparatorChar + $"{filename}";            var recordBody = new FileProcessor().ImportFile(folder, "Performance", "PerformanceFormats", ',');            var records = JsonConvert.SerializeObject(recordBody.Item1);            var performanceRecords = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(records);            var sortedPerformanceRecords = performanceRecords.OrderBy(x => x.PerformanceDate).ToList();
            Assert.IsTrue(recordBody != null);
            Assert.IsTrue(recordBody.Item2.Count == 0);

            var performanceList = LP.Finance.Common.Utils.PostWebApi("FinanceWebApi", $"{performanceURL}", performanceRecords, financeWebAPI);
            Task.WaitAll(performanceList);
            var response = JsonConvert.DeserializeObject<Response>(performanceList.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);
            var calculatedResult = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(serializedPayload);

            for (int i = 0; i < sortedPerformanceRecords.Count; i++)
            {
                if (i == 0)
                {
                    sortedPerformanceRecords[i].ITD = sortedPerformanceRecords[i].MTD.Value;
                    sortedPerformanceRecords[i].YTDNetPerformance = sortedPerformanceRecords[i].Performance.Value;
                    sortedPerformanceRecords[i].QTD = sortedPerformanceRecords[i].MTD.Value;
                }
                else
                {
                    sortedPerformanceRecords[i].ITD = ((1 + sortedPerformanceRecords[i - 1].ITD) * (1 + sortedPerformanceRecords[i].MTD ?? 0)) - 1;
                    sortedPerformanceRecords[i].YTDNetPerformance = sortedPerformanceRecords[i - 1].YTDNetPerformance + sortedPerformanceRecords[i].Performance.Value;
                }
            }

            decimal calcITD = Math.Round(calculatedResult[calculatedResult.Count - 1].ITD * 100, 2);
            decimal perfITD = Math.Round(sortedPerformanceRecords[sortedPerformanceRecords.Count - 1].ITD * 100, 2);

            decimal calcYTDNetPerformance = calculatedResult[calculatedResult.Count - 1].YTDNetPerformance;
            decimal perfYTDNetPerformance = sortedPerformanceRecords[sortedPerformanceRecords.Count - 1].YTDNetPerformance;

            Assert.IsTrue((calculatedResult[0].MTD == calculatedResult[0].YTD) && (calculatedResult[0].MTD == calculatedResult[0].QTD) && (calculatedResult[0].MTD == calculatedResult[0].ITD), "Expected result");
            Assert.IsTrue((calcITD == perfITD), "Expected result");
            Assert.IsTrue((calcYTDNetPerformance == perfYTDNetPerformance), "Expected result");

            Assert.Pass();
        }
    }
}
