using System;
using System.Collections.Generic;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;

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
        object GetCostBasisReport(DateTime? date, string fund, string symbol);
        object GetCostBasisChart(string symbol);
        object GetTaxLotReport(DateTime? from, DateTime? to, string fund, string symbol, Boolean side);
        object GetClosingTaxLots(string orderid = null);
        object GetTaxLotsReport(DateTime? from, DateTime? to, string fund);
        object GetReconReport(String source, DateTime? date, string fund);
        object GetTrialBalanceReport(DateTime? from, DateTime? to, string fund);
        object GetAccountingTileData(DateTime? from, DateTime? to, string fund);
        object serverSideJournals(ServerRowModel obj);
        object GetTotalCount(ServerRowModel obj);
        object GetJournalsMetaData(JournalMetaInputDto obj);
        object DoHaveJournals(DateTime to, DateTime from);
        object GetLastJournalPostedDate();
    }
}