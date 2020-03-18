using PostingEngine.TaxLotMethods;
using System.Collections.Generic;
using LP.Finance.Common.Model;

namespace PostingEngine.Contracts
{
    public interface ITaxLotMethodology
    {
        List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element, double workingQuantity);
    }
}
