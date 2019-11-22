using System;
using System.Collections.Generic;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI.Stubs
{
    public class JournalStub : IJournalService
    {
        public object Data(string symbol, int pageNumber, int pageSize, string sortColumn = "id",
            string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            return Utils.GetFile("journals");
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

        public object GetTrialBalanceReport(DateTime? from, DateTime? to, string fund)
        {
            throw new NotImplementedException();
        }

        public object GetCostBasisReport(DateTime? date, string fund)
        {
            throw new NotImplementedException();
        }

        public object GetCostBasisChart(string symbol)
        {
            throw new NotImplementedException();
        }

        public object GetTaxLotReport(DateTime? from, DateTime? to, string fund)
        {
            throw new NotImplementedException();
        }

        public object GetAccountingTileData(DateTime? from, DateTime? to, string fund)
        {
            throw new NotImplementedException();
        }

        public object GetTaxLotsReport(DateTime? from, DateTime? to, string fund)
        {
            throw new NotImplementedException();
        }

        public object GetClosingTaxLots(string orderid)
        {
            throw new NotImplementedException();
        }

        public object GetReconReport(DateTime? date, string fund)
        {
            throw new NotImplementedException();
        }

        public object GetSummarizedJournal(List<GridLayoutDto> layout)
        {
            throw new NotImplementedException();
        }
    }
}