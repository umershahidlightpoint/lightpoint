using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.TaxLotMethods
{

    /// <summary>
    /// Get a list of the open tax lots for the passed trade, is this is a Sell then only get Buys, if a cover only shorts
    /// </summary>
    /// <param name="element">Closing Tax Lot</param>
    /// <returns>List of matched open Lots / ordered in FIFO</returns>
    public class FIFOTaxLotMethod : ITaxLotMethodology
    {
        public List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element)
        {
            var openlots = new BaseTaxLotMethodology().OpenTaxLots(env, element).OrderBy(i => i.Trade.TradeTime).ToList();

            return openlots;
        }
    }

}
