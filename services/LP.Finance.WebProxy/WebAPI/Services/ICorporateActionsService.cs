﻿using LP.Finance.Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface ICorporateActionsService
    {
        object GetCashDividends();
        object CreateCashDividend(CashDividendInputDto obj);
        object EditCashDividend(CashDividendInputDto obj);
        object DeleteCashDividend(int id);
        object CashDividendAudit(int id);
        object GetDividendDetails();
    }
}