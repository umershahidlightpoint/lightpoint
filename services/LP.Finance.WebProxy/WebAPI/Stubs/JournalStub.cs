using System;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;
using LP.Shared.Model;

namespace LP.Finance.WebProxy.WebAPI.Stubs
{
    public class JournalStub : IJournalService
    {
        public object Data(string symbol, int pageNumber, int pageSize, string sortColumn = "id",
            string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            return Shared.WebApi.GetFile("journals");
        }

        public object GetJournal(Guid source)
        {
            throw new NotImplementedException();
        }

        public object AddJournal(JournalInputDto journal)
        {
            throw new NotImplementedException();
        }

        public object UpdateJournal(Guid source, JournalInputDto journal)
        {
            throw new NotImplementedException();
        }

        public object DeleteJournal(Guid source)
        {
            throw new NotImplementedException();
        }

        public object GetCostBasisReport(DateTime? date, string fund, string symbol)
        {
            throw new NotImplementedException();
        }

        public object GetCostBasisChart(string symbol)
        {
            throw new NotImplementedException();
        }

        public object GetTaxLotReport(DateTime? from, DateTime? to, string fund, string symbol, Boolean side)
        {
            throw new NotImplementedException();
        }

        public object GetClosingTaxLots(string orderid, DateTime? to)
        {
            throw new NotImplementedException();
        }

        public object GetTaxLotsReport(DateTime? from, DateTime? to, string fund)
        {
            throw new NotImplementedException();
        }

        public object GetReconReport(string source, DateTime? date, string fund)
        {
            throw new NotImplementedException();
        }

        public object GetTrialBalanceReport(DateTime? from, DateTime? to, string fund)
        {
            throw new NotImplementedException();
        }

        public object GetAccountingTileData(DateTime? from, DateTime? to, string fund)
        {
            throw new NotImplementedException();
        }

        public object serverSideJournals(ServerRowModel obj)
        {
            throw new NotImplementedException();
        }

        public object GetTotalCount(ServerRowModel obj)
        {
            throw new NotImplementedException();
        }

        public object GetJournalsMetaData(JournalMetaInputDto obj)
        {
            throw new NotImplementedException();
        }

        public object AppMetaData(DateTime to, DateTime from)
        {
            throw new NotImplementedException();
        }

        public object GetLastJournalPostedDate()
        {
            throw new NotImplementedException();
        }

        public object AlleviateTaxLot()
        {
            throw new NotImplementedException();
        }

        public object ReverseTaxLotAlleviation(TaxLotReversalDto obj)
        {
            throw new NotImplementedException();
        }

        public object GetPeriodJournals(string symbol, DateTime now, string period)
        {
            throw new NotImplementedException();
        }

        public object GetValidDates(string columnName, string source)
        {
            throw new NotImplementedException();
        }

        public object GetMarketValueAppraisalReport(DateTime? date)
        {
            throw new NotImplementedException();
        }

        public object GetHistoricPerformanceReport(DateTime? from, DateTime? to)
        {
            throw new NotImplementedException();
        }

        public object ExcludeTrade(TradeExclusionInputDto obj)
        {
            throw new NotImplementedException();
        }

        public object GetDetailPnLToDateReport(DateTime @from, DateTime to, string symbol)
        {
            throw new NotImplementedException();
        }

        public object ReverseTradeExclusion(TradeExclusionInputDto obj)
        {
            throw new NotImplementedException();
        }
    }
}