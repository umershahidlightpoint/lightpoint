using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.TaxLotMethods
{
    public class TaxLotDetail
    {
        public Transaction Trade { get; set; }
        public TradeTaxRate TaxRate { get; set; }
    }

    class BaseTaxLotMethodology
    {
        /// <summary>
        /// Get the open Tax lots for the specified trade passed in
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element"></param>
        /// <returns></returns>
        public List<TaxLotDetail> OpenTaxLots(PostingEngineEnvironment env, Transaction element)
        {
            if (element.IsBuy() || element.IsShort())
            {
                return new List<TaxLotDetail>();
            }

            var openLots = new List<TaxLotDetail>();

            var lots = env.Trades.Where(i =>
                    i.TradeDate.Date <= element.TradeDate.Date
                    && i.Symbol == element.Symbol
                    && i.LpOrderId != element.LpOrderId);

            if (element.IsSell())
            {
                var local = lots.Where(i => i.IsBuy())
                    .ToList();

                openLots.AddRange(local.Select(i=> new TaxLotDetail { Trade = i, TaxRate = env.TradeTaxRate(i) }));
            }
            else if (element.IsCover())
            {
                var local = lots.Where(i => i.IsShort())
                    .ToList();

                openLots.AddRange(local.Select(i => new TaxLotDetail { Trade = i, TaxRate = env.TradeTaxRate(i) }));
            }

            return openLots;
        }
    }

}
