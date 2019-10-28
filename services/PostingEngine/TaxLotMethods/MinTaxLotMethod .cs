using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using System.Collections.Generic;

namespace PostingEngine.TaxLotMethods
{
    /// <summary>
    /// Need to calculate a tax liability and then sort the Open Tax lots in ascending order, so that we close out tax lots according to min tax liability
    /// </summary>
    /// <param name="element">Closing Tax Lot</param>
    /// <returns>List of matched open Lots / ordered in LIFO</returns>
    public class MinTaxLotMethod : ITaxLotMethodology
    {
        public List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element)
        {
            var side = element.Side.ToLowerInvariant();

            if (side.Equals("buy") || side.Equals("short"))
            {
                return null;
            }

            return null;
        }
    }

}
