using System.Threading.Tasks;
using LP.Finance.Common;
using LP.Finance.Common.Models;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace UT.ReferenceData
{
    [TestClass]
    public class RefDataWebAPi
    {
        private static readonly string allocationsURL = "/api/allocation?period=";
        private static readonly string tradesURL = "/api/trade?period=";

        [TestMethod]
        public void CompareALLITD()
        {
            var ALL = Utils.GetWebApiData($"{allocationsURL}ALL");
            var ITD = Utils.GetWebApiData($"{allocationsURL}ITD");

            Task.WaitAll(new[] { ALL, ITD });

            var allResult = ALL.Result;
            var itdResult = ITD.Result;

            var allRes = JsonConvert.DeserializeObject<PayLoad>(allResult);
            var itdRes = JsonConvert.DeserializeObject<PayLoad>(itdResult);

            Assert.AreEqual(allRes.payload, itdRes.payload);
        }

        [TestMethod]
        public void Trades()
        {
            var ALL = Utils.GetWebApiData($"{tradesURL}ALL");

            Task.WaitAll(new[] { ALL });

            var allResult = ALL.Result;

            var allRes = JsonConvert.DeserializeObject<Transaction[]>(allResult);


            Assert.IsTrue(allRes.Length > 0, "Expected elements");
        }

        [TestMethod]
        public void Allocations()
        {
            var ALL = Utils.GetWebApiData($"{allocationsURL}ALL");

            Task.WaitAll(new[] { ALL });

            var allResult = ALL.Result;

            var allRes = JsonConvert.DeserializeObject<PayLoad>(allResult);

            var allElements = JsonConvert.DeserializeObject<Transaction[]>(allRes.payload);


            Assert.IsTrue(allElements.Length > 0, "Expected elements");
        }

    }
}
