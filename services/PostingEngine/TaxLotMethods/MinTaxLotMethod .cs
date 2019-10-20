using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using System.Collections.Generic;

namespace PostingEngine.TaxLotMethods
{
    /// <summary>
    /// Get a list of the open tax lots for the passed trade, is this is a Sell then only get Buys, if a cover only shorts
    /// </summary>
    /// <param name="element">Closing Tax Lot</param>
    /// <returns>List of matched open Lots / ordered in LIFO</returns>
    public class MinTaxLotMethod : ITaxLotMethodology
    {
        public List<Transaction> GetOpenLots(PostingEngineEnvironment env, Transaction element)
        {
            return null;
        }
    }

}
