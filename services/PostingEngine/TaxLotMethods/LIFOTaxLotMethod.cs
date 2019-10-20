using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.TaxLotMethods
{

    /// <summary>
    /// Get a list of the open tax lots for the passed trade, is this is a Sell then only get Buys, if a cover only shorts
    /// </summary>
    /// <param name="element">Closing Tax Lot</param>
    /// <returns>List of matched open Lots / ordered in LIFO</returns>
    public class LIFOTaxLotMethod : ITaxLotMethodology
    {
        public List<Transaction> GetOpenLots(PostingEngineEnvironment env, Transaction element)
        {
            var side = element.Side.ToLowerInvariant();

            if (side.Equals("buy") || side.Equals("short"))
            {
                return null;
            }

            List<Transaction> openLots = new List<Transaction>();

            var lots = env.Trades.Where(i =>
                    i.TradeDate.Date <= element.TradeDate.Date
                    && i.Symbol == element.Symbol
                    && i.LpOrderId != element.LpOrderId);

            if (side.Equals("sell"))
            {
                var local = lots.Where(i => i.Side.ToLowerInvariant().Equals("buy"))
                    .OrderByDescending(i => i.TradeDate)
                    .ToList();

                openLots.AddRange(local);
            }
            else if (side.Equals("cover"))
            {
                var local = lots.Where(i => i.Side.ToLowerInvariant().Equals("short"))
                    .OrderByDescending(i => i.TradeDate)
                    .ToList();

                openLots.AddRange(local);
            }

            return openLots;
        }
    }

}
