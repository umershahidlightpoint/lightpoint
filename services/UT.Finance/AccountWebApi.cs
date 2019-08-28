using System.Collections.Generic;
using System.Threading.Tasks;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace UT.Finance
{
    [TestClass]
    public class AccountWebApi
    {
        private static readonly string accountsURL = "/api/account";

        // Passing Unit Test Should be Checked for Other Scenarios
        [TestMethod]
        public void AddAccount()
        {
            var content = new AccountInputDto
            {
                Description = "Equity Again Swap - ACX AU SWAP - GSCO - MSCO",
                Type = 3,
                Tags = new List<AccountTagInputDto>(new[]
                {
                    new AccountTagInputDto {Id = 2, Value = "Equity"},
                    new AccountTagInputDto {Id = 4, Value = "ACX AU SWAP"}
                })
            };

            var accounts = Utils.PostWebApi("FinanceWebApi", $"{accountsURL}", content);

            Task.WaitAll(accounts);

            dynamic result = JsonConvert.DeserializeObject<object>(accounts.Result);

            Assert.IsTrue(result.isSuccessful == true, "Account Added");
        }

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