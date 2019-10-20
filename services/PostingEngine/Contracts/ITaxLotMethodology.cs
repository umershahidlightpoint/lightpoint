using LP.Finance.Common.Models;
using System.Collections.Generic;

namespace PostingEngine.Contracts
{
    public interface ITaxLotMethodology
    {
        List<Transaction> GetOpenLots(PostingEngineEnvironment env, Transaction element);
    }
}
