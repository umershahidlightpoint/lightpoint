using System;
using System.Collections.Generic;
using System.Dynamic;
using System.Linq;
using System.Threading.Tasks;
using LP.Finance.Common;
using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace UT.Finance
{
    [TestClass]
    public class ServerSideJournalsWebApi
    {
        private static readonly string JournalUrl = "/api/journal/serverSide";

        private readonly ServerRowModel _payload = new ServerRowModel
        {
            startRow = 0,
            endRow = 100,
            pageNumber = 1,
            pageSize = 100,
            filterModel = new ExpandoObject(),
            externalFilterModel = new ExpandoObject(),
            sortModel = new List<SortModel>(),
            groupKeys = new List<string>(),
            rowGroupCols = new List<RowGroupCols>(),
            valueCols = new List<ValueCols>()
        };

        [TestMethod]
        public void GetPaginatedJournals()
        {
            var result = GetJournals<Journal>(_payload);

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Item2.Count <= 100, "Expected Page Size is Correct");
        }

        [TestMethod]
        public void GetInternalFilteredJournals()
        {
            var payload = (IDictionary<string, dynamic>) _payload.filterModel;
            payload.Add("fund", new
            {
                values = new[] {"LP", "BOOTHBAY"},
                filterType = "set"
            });

            var result = GetJournals<Journal>(_payload);

            var value = result.Item2.Find(item => item.Fund != "LP" && item.Fund != "BOOTHBAY");

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(value == null, "Expected Result is Correct");
        }

        [TestMethod]
        public void GetExternalFilteredJournals()
        {
            var dateFrom = new DateTime(DateTime.Now.Year, 1, 1);
            var dateTo = DateTime.Now.Date;
            var payload = (IDictionary<string, dynamic>) _payload.externalFilterModel;
            payload.Add("when", new
            {
                dateFrom = dateFrom.ToString("yyyy-MM-dd"),
                dateTo = dateTo.ToString("yyyy-MM-dd"),
                filterType = "date"
            });

            var result = GetJournals<Journal>(_payload);

            var value = result.Item2.Find(item => item.When < dateFrom && item.When > dateTo);

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(value == null, "Expected Result is Correct");
        }

        [TestMethod]
        public void GetAscendingSortedJournals()
        {
            _payload.sortModel = new List<SortModel>
            {
                new SortModel {colId = "fund", sort = "asc"}
            };

            var result = GetJournals<Journal>(_payload);

            var orderedByAsc = result.Item2.OrderBy(item => item.Fund);

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Item2.SequenceEqual(orderedByAsc), "Expected Result is Correct");
        }

        [TestMethod]
        public void GetDescendingSortedJournals()
        {
            _payload.sortModel = new List<SortModel>
            {
                new SortModel {colId = "when", sort = "desc"}
            };

            var result = GetJournals<Journal>(_payload);

            var orderedByAsc = result.Item2.OrderByDescending(item => item.When);

            Assert.IsTrue(result.Item1.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Item2.SequenceEqual(orderedByAsc), "Expected Result is Correct");
        }

        private static Tuple<Response, List<T>> GetJournals<T>(ServerRowModel payload)
        {
            var journals = Utils.PostWebApi("FinanceWebApi", JournalUrl, payload);

            Task.WaitAll(journals);

            var response = JsonConvert.DeserializeObject<Response>(journals.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);

            var result = JsonConvert.DeserializeObject<List<T>>(serializedPayload);

            return new Tuple<Response, List<T>>(response, result);
        }
    }
}