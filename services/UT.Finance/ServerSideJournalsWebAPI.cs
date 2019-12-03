using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LP.Finance.Common;
using LP.Finance.Common.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace UT.Finance
{
    [TestClass]
    public class ServerSideJournalsWebApi
    {
        private static readonly string JournalUrl = "/api/journal/serverSide";

        [TestMethod]
        public void GetPaginatedJournals()
        {
            var payload = new Payload();

            var result = GetJournals<Journal>(payload);

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Item2.Count <= 100, "Expected Page Size is Correct");
        }

        [TestMethod]
        public void GetInternalFilteredJournals()
        {
            var payload = new Payload
            {
                FilterModel = new
                {
                    fund = new
                    {
                        values = new[] {"LP", "BOOTHBAY"},
                        filterType = "set"
                    }
                }
            };

            var journals = Utils.PostWebApi("FinanceWebApi", JournalUrl, payload);

            Task.WaitAll(journals);

            var result = GetJournals<Journal>(payload);

            var value = result.Item2.Find(item => item.Fund != "LP" && item.Fund != "BOOTHBAY");

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(value == null, "Expected Result is Correct");
        }

        [TestMethod]
        public void GetExternalFilteredJournals()
        {
            var dateFrom = new DateTime(DateTime.Now.Year, 1, 1);
            var dateTo = DateTime.Now.Date;
            var payload = new Payload
            {
                ExternalFilterModel = new
                {
                    when = new
                    {
                        dateFrom = dateFrom.ToString("yyyy-MM-dd"),
                        dateTo = dateTo.ToString("yyyy-MM-dd"),
                        filterType = "date"
                    }
                }
            };

            var result = GetJournals<Journal>(payload);

            var value = result.Item2.Find(item => item.When < dateFrom && item.When > dateTo);

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(value == null, "Expected Result is Correct");
        }

        [TestMethod]
        public void GetAscendingSortedJournals()
        {
            var payload = new Payload
            {
                SortModel = new List<ColumnValueObject>
                {
                    new ColumnValueObject
                    {
                        ColId = "fund",
                        Sort = "asc"
                    }
                }
            };

            var result = GetJournals<Journal>(payload);

            var orderedByAsc = result.Item2.OrderBy(item => item.Fund);

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Item2.SequenceEqual(orderedByAsc), "Expected Result is Correct");
        }

        [TestMethod]
        public void GetDescendingSortedJournals()
        {
            var payload = new Payload
            {
                SortModel = new List<ColumnValueObject>
                {
                    new ColumnValueObject
                    {
                        ColId = "when",
                        Sort = "desc"
                    }
                }
            };

            var result = GetJournals<Journal>(payload);

            var orderedByAsc = result.Item2.OrderByDescending(item => item.When);

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Item2.SequenceEqual(orderedByAsc), "Expected Result is Correct");
        }

        private static Tuple<Response, List<T>> GetJournals<T>(Payload payload)
        {
            var journals = Utils.PostWebApi("FinanceWebApi", JournalUrl, payload);

            Task.WaitAll(journals);

            var response = JsonConvert.DeserializeObject<Response>(journals.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);

            var result = JsonConvert.DeserializeObject<List<T>>(serializedPayload);

            return new Tuple<Response, List<T>>(response, result);
        }
    }

    public class Payload
    {
        public int StartRow { get; set; } = 0;
        public int EndRow { get; set; } = 100;
        public int PageNumber { get; set; } = 1;
        public int PageSize { get; set; } = 100;
        public object FilterModel { get; set; } = new { };
        public object ExternalFilterModel { get; set; } = new { };
        public List<ColumnValueObject> SortModel { get; set; } = new List<ColumnValueObject>();
        public List<string> GroupKeys { get; set; } = new List<string>();
        public List<ColumnValueObject> RowGroupCols { get; set; } = new List<ColumnValueObject>();
        public bool PivotMode { get; set; } = false;
        public List<ColumnValueObject> PivotCols { get; set; } = new List<ColumnValueObject>();
    };

    public class ColumnValueObject
    {
        public string Id { get; set; }
        public string ColId { get; set; }
        public string Sort { get; set; }
        public string DisplayName { get; set; }
        public string Field { get; set; }
        public string AggFunc { get; set; }
    }
}