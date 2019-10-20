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
        public List<Transaction> GetOpenLots(PostingEngineEnvironment env, Transaction element)
        {
            if (element.IsBuy() || element.IsShort())
            {
                return null;
            }

            var openLots = new List<Transaction>();

            var lots = env.Trades.Where(i =>
                    i.TradeDate.Date <= element.TradeDate.Date
                    && i.Symbol == element.Symbol
                    && i.LpOrderId != element.LpOrderId);

            if (element.IsSell())
            {
                var local = lots.Where(i => i.IsBuy())
                    .OrderBy(i => i.TradeDate)
                    .ToList();

                openLots.AddRange(local);
            }
            else if (element.IsCover())
            {
                var local = lots.Where(i => i.IsShort())
                    .OrderBy(i => i.TradeDate)
                    .ToList();

                openLots.AddRange(local);
            }

            return openLots;
        }
    }

}
