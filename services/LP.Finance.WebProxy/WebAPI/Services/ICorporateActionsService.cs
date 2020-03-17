using LP.Finance.Common.Dtos;
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
        object GetDividendDetails(DateTime date, int id);
        // StockSplits
        object GetStockSplits();
        object CreateStockSplit(StockSplitInputDto obj);
        object EditStockSplit(StockSplitInputDto obj);
        object DeleteStockSplit(int id);
        object StockSplitAudit(int id);
        object GetStockSplitDetails(int id);
        // SymbolChange
        object GetSymbolsChange();
        object CreateSymbolChange(SymbolChangeInputDto obj);
        object EditSymbolChange(SymbolChangeInputDto obj);
        object DeleteSymbolChange(int id);
        object SymbolChangeAudit(int id);
        //object GetSymbolChangeDetails(int id);
    }
}
