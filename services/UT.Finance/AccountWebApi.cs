using System.Threading.Tasks;
using LP.Finance.Common;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace UT.Finance
{
    [TestClass]
    public class AccountWebApi
    {
        private static readonly string accountsURL = "/api/account";

        // A Basic Unit Test Template to Start
        [TestMethod]
        public void GetAccounts()
        {
            var accounts = Utils.GetWebApiData("FinanceWebApi", $"{accountsURL}");

            Task.WaitAll(accounts);

            dynamic result = JsonConvert.DeserializeObject<object>(accounts.Result);

            Assert.IsTrue(result.payload.Count > 0, "Expected Accounts");
        }
    }
}