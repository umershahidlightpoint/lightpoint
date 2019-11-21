using System;
using LP.Finance.Common.Dtos;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IJournalService
    {
        object Data(string symbol, int pageNumber, int pageSize, string sortColumn = "id", string sortDirection = "asc",
            int accountId = 0, int value = 0);

        object GetJournal(Guid source);
        object AddJournal(JournalInputDto journal);
        object UpdateJournal(Guid source, JournalInputDto journal);
        object DeleteJournal(Guid source);
        object GetTrialBalanceReport(DateTime? from, DateTime? to, string fund);
        object GetReconReport(DateTime? date, string fund);
        object GetCostBasisReport(DateTime? date, string fund);
        object GetCostBasisChart(string symbol);
        object GetTaxLotReport(DateTime? from, DateTime? to, string fund);
        object GetTaxLotsReport(DateTime? from, DateTime? to, string fund);
        object GetAccountingTileData(DateTime? from, DateTime? to, string fund);
        object GetClosingTaxLots(string orderid);
    }
}