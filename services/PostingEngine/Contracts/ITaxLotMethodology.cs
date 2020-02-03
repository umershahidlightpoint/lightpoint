using LP.Finance.Common.Models;
using PostingEngine.TaxLotMethods;
using System.Collections.Generic;

namespace PostingEngine.Contracts
{
    public interface ITaxLotMethodology
    {
        List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element, double workingQuantity);
    }
}
