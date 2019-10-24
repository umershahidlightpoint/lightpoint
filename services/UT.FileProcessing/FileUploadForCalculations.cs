using LP.FileProcessing;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.IO;
using System.Text;
using System.Threading.Tasks;

namespace UT.FileProcessing
{
    public class Response
    {
        public DateTime when { get; set; }
        public string by { get; set; }
        public bool isSuccessful { get; set; }
        public string message { get; set; }
        public object payload { get; set; }
        public object meta { get; set; }
    }

    [TestFixture]
    public class FileUploadForCalculations
    {
        private static readonly string performanceURL = "/api/calculation/monthlyPerformance";

        [Test]        public void TestUploadMonthlyPerformance()        {            var currentDir = AppDomain.CurrentDomain.BaseDirectory;            var filename = "PerformanceDataFile.csv";            var folder = currentDir + "TestFiles" + Path.DirectorySeparatorChar + $"{filename}";            var recordBody = new FileProcessor().ImportFile(folder, "Performance", "PerformanceFormats", ',');            var records = JsonConvert.SerializeObject(recordBody.Item1);            var performanceRecords = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(records);            Assert.IsTrue(recordBody != null);            Assert.IsTrue(recordBody.Item2.Count == 0);            var performanceList = LP.Finance.Common.Utils.PostWebApi("FinanceWebApi", $"{performanceURL}", performanceRecords);            Task.WaitAll(performanceList);            var response = JsonConvert.DeserializeObject<Response>(performanceList.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);
            var calculatedResult = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(serializedPayload);

            for (int i = 0; i < performanceRecords.Count; i++)
            {
                if (i == 0)
                {
                    performanceRecords[i].ITD = performanceRecords[i].MTD.Value;
                    performanceRecords[i].YTDNetPerformance = performanceRecords[i].Performance.Value;
                }
                else
                {
                    performanceRecords[i].ITD = ((1 + performanceRecords[i - 1].ITD) * (1 + performanceRecords[i].MTD ?? 0)) - 1;
                    performanceRecords[i].YTDNetPerformance = performanceRecords[i-1].YTDNetPerformance + performanceRecords[i].Performance.Value;
                }
            }
            decimal calcITD = Math.Round(calculatedResult[calculatedResult.Count-1].ITD * 100, 2);
            decimal perfITD = Math.Round(performanceRecords[performanceRecords.Count-1].ITD * 100, 2);

            decimal calcYTDNetPerformance = calculatedResult[calculatedResult.Count - 1].YTDNetPerformance;
            decimal perfYTDNetPerformance = performanceRecords[performanceRecords.Count - 1].YTDNetPerformance;

            Assert.IsTrue((calculatedResult[0].MTD == calculatedResult[0].YTD) && (calculatedResult[0].MTD == calculatedResult[0].QTD) && (calculatedResult[0].MTD == calculatedResult[0].ITD), "Expected result");
            Assert.IsTrue((calcITD == perfITD), "Expected result");
            Assert.IsTrue((calcYTDNetPerformance == perfYTDNetPerformance), "Expected result");
            Assert.Pass();        }
    }
}
