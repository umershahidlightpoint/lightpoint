﻿using LP.Finance.Common.Dtos;
using LP.Finance.Common.Models;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IAccountControllerService
    {
        object Data(string symbol, string search = "");

        object GetAccounts(int pageNumber, int pageSize, string accountName, string accountCategory);

        object CreateAccount(AccountDto account);

        object UpdateAccount(int id, Account account);

        object DeleteAccount(int id);
    }
}