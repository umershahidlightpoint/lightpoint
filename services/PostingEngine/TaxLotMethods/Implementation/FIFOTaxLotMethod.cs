using System.Collections.Generic;
using System.Linq;
using LP.Finance.Common.Model;
using PostingEngine.Contracts;

namespace PostingEngine.TaxLotMethods.Implementation
{

    /// <summary>
    /// Get a list of the open tax lots for the passed trade, is this is a Sell then only get Buys, if a cover only shorts
    /// </summary>
    /// <param name="element">Closing Tax Lot</param>
    /// <returns>List of matched open Lots / ordered in FIFO</returns>
    public class FIFOTaxLotMethod : ITaxLotMethodology
    {
        public List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element, double workingQuantity)
        {
            var openlots = BaseTaxLotMethodology.OpenTaxLots(env, element, workingQuantity).OrderBy(i => i.Trade.TradeTime).ToList();

            return openlots;
        }
    }

}
