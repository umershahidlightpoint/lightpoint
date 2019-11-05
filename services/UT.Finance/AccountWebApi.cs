using System;
using System.Collections.Generic;
using System.Linq;
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
        private static readonly string AccountsUrl = "/api/account";
        private static readonly string AccountCategoriesUrl = "/api/account_category";
        private static readonly string AccountTypesUrl = "/api/account_type";
        private static readonly string AccountTagsUrl = "/api/account_tag";

        // Unit Test to Add Account with Static Values
        [TestMethod]
        public void AddStaticAccount()
        {
            var payload = new AccountInputDto
            {
                Description = "Equity Again Swap - ACX AU SWAP - GSCO - MSCO",
                Type = 3,
                Tags = new List<AccountTagInputDto>(new[]
                {
                    new AccountTagInputDto {Id = 2, Value = "Equity"},
                    new AccountTagInputDto {Id = 4, Value = "ACX AU SWAP"}
                })
            };

            var accounts = Utils.PostWebApi("FinanceWebApi", $"{AccountsUrl}", payload);

            Task.WaitAll(accounts);

            var response = JsonConvert.DeserializeObject<Response>(accounts.Result);

            Assert.IsTrue(response.isSuccessful, "Account Added");
        }

        // Unit Test to Add Account Dynamically
        [TestMethod]
        public async Task AddDynamicAccount()
        {
            var accountCategories = await GetList<AccountCategoryOutputDto>(AccountCategoriesUrl);

            var accountTypes =
                await GetList<AccountTypeOutputDto>(
                    $"{AccountTypesUrl}?accountCategoryId={accountCategories.FirstOrDefault()?.Id}");

            var accountTags = await GetList<AccountTagOutputDto>(AccountTagsUrl);

            var payload = new AccountInputDto
            {
                Description = accountTypes.FirstOrDefault()?.Name,
                Type = accountTypes.FirstOrDefault()?.Id,
                Tags = new List<AccountTagInputDto>(new[]
                {
                    new AccountTagInputDto
                        {Id = accountTags.FirstOrDefault()?.Id, Value = accountCategories.FirstOrDefault()?.Name}
                })
            };

            var accounts = Utils.PostWebApi("FinanceWebApi", $"{AccountsUrl}", payload);

            Task.WaitAll(accounts);

            var response = JsonConvert.DeserializeObject<Response>(accounts.Result);

            Assert.IsTrue(response.isSuccessful, "Account Added");
        }

        // Unit Test to Add Account without Tags
        [TestMethod]
        public async Task AddNoTagsAccount()
        {
            var accountCategories = await GetList<AccountCategoryOutputDto>(AccountCategoriesUrl);

            var accountTypes =
                await GetList<AccountTypeOutputDto>(
                    $"{AccountTypesUrl}?accountCategoryId={accountCategories.FirstOrDefault()?.Id}");

            var payload = new AccountInputDto
            {
                Description = accountTypes.FirstOrDefault()?.Name,
                Type = accountTypes.FirstOrDefault()?.Id,
                Tags = new List<AccountTagInputDto>()
            };

            var accounts = Utils.PostWebApi("FinanceWebApi", $"{AccountsUrl}", payload);

            Task.WaitAll(accounts);

            var response = JsonConvert.DeserializeObject<Response>(accounts.Result);

            Assert.IsTrue(response.isSuccessful, "Account Added");
        }

        // Unit Test to Add Account with Invalid Payload
        [TestMethod]
        public void AddInvalidAccount()
        {
            var payload = new AccountInputDto
            {
                Description = "",
                Type = 0,
                Tags = new List<AccountTagInputDto>()
            };

            var accounts = Utils.PostWebApi("FinanceWebApi", $"{AccountsUrl}", payload);

            Task.WaitAll(accounts);

            var response = JsonConvert.DeserializeObject<Response>(accounts.Result);

            Assert.IsTrue(response.isSuccessful == false, "Account not Added");
        }

        // Unit Test to Update Account
        [TestMethod]
        public async Task UpdateAccount()
        {
            var accounts = await GetAccounts();
            var lastAccount = accounts.Item1.FirstOrDefault();

            var payload = new AccountInputDto
            {
                Description = lastAccount?.Description + " Updated",
                Type = lastAccount?.TypeId,
                Tags = new List<AccountTagInputDto>()
            };

            var account = Utils.PutWebApi("FinanceWebApi", $"{AccountsUrl}/{lastAccount?.AccountId}", payload);

            Task.WaitAll(account);

            var response = JsonConvert.DeserializeObject<Response>(account.Result);

            Assert.IsTrue(response.isSuccessful, "Account Updated");
        }

        // Unit Test to Delete Account
        [TestMethod]
        public async Task DeleteAccount()
        {
            var accounts = await GetAccounts();
            var lastAccount = accounts.Item1.FirstOrDefault();

            var account = Utils.DeleteWebApi("FinanceWebApi", $"{AccountsUrl}/{lastAccount?.AccountId}");

            Task.WaitAll(account);

            var response = JsonConvert.DeserializeObject<Response>(account.Result);

            Assert.IsTrue(response.isSuccessful, "Account Deleted");
        }

        // Unit Test for Accounts List
        [TestMethod]
        public async Task GetAccountsList()
        {
            var accounts = await GetAccounts();

            Assert.IsTrue(accounts.Item2.isSuccessful, "Request Call Successful");
            Assert.IsTrue(accounts.Item1.Count >= 0, "Expected Accounts");
        }

        private static async Task<Tuple<List<AccountOutputDto>, Response>> GetAccounts()
        {
            var accounts = await Utils.GetWebApiData("FinanceWebApi", $"{AccountsUrl}");

            var response = JsonConvert.DeserializeObject<Response>(accounts);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);

            var payload = JsonConvert.DeserializeObject<List<AccountOutputDto>>(serializedPayload);

            return new Tuple<List<AccountOutputDto>, Response>(payload, response);
        }

//        private static async Task<List<AccountCategoryOutputDto>> GetAccountCategories()
//        {
//            var accountCategories = await Utils.GetWebApiData("FinanceWebApi", $"{AccountCategoriesUrl}");
//
//            var response = JsonConvert.DeserializeObject<Response>(accountCategories);
//
//            var payload = JsonConvert.SerializeObject(response.payload);
//
//            return JsonConvert.DeserializeObject<List<AccountCategoryOutputDto>>(payload);
//        }
//
//        private static async Task<List<AccountTypeOutputDto>> GetAccountTypes(int? accountCategoryId)
//        {
//            var accountTypes = await Utils.GetWebApiData("FinanceWebApi",
//                $"{AccountTypesUrl}?accountCategoryId={accountCategoryId}");
//
//            var response = JsonConvert.DeserializeObject<Response>(accountTypes);
//
//            var payload = JsonConvert.SerializeObject(response.payload);
//
//            return JsonConvert.DeserializeObject<List<AccountTypeOutputDto>>(payload);
//        }
//
//        private static async Task<List<AccountTagOutputDto>> GetAccountTags()
//        {
//            var accountTags = await Utils.GetWebApiData("FinanceWebApi", $"{AccountTagsUrl}");
//
//            var response = JsonConvert.DeserializeObject<Response>(accountTags);
//
//            var payload = JsonConvert.SerializeObject(response.payload);
//
//            return JsonConvert.DeserializeObject<List<AccountTagOutputDto>>(payload);
//        }

        private static async Task<List<T>> GetList<T>(string url)
        {
            var list = await Utils.GetWebApiData("FinanceWebApi", $"{url}");

            var response = JsonConvert.DeserializeObject<Response>(list);

            var payload = JsonConvert.SerializeObject(response.payload);

            return JsonConvert.DeserializeObject<List<T>>(payload);
        }
    }
}