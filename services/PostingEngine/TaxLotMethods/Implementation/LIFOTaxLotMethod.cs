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
    /// <returns>Returns an ordered list of open tax lots</returns>
    public class LIFOTaxLotMethod : ITaxLotMethodology
    {
        public List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element, double workingQuantity)
        {
            var openlots = BaseTaxLotMethodology.OpenTaxLots(env, element, workingQuantity).OrderByDescending(i=>i.Trade.TradeTime).ToList();

            return openlots;
        }
    }

}
