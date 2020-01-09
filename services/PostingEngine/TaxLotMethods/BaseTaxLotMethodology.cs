using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.TaxLotMethods
{
    public class TaxLotDetail
    {
        public Transaction Trade { get; set; }
        public TaxLotStatus TaxLotStatus { get; set; }
        public TradeTaxRate TaxRate { get; set; }
        public double PotentialPnl { get; set; }
        public double TaxLiability { get; set; }
    }

    class BaseTaxLotMethodology
    {
        public static ITaxLotMethodology GetTaxLotMethodology(string methodology)
        {
            switch( methodology.ToLowerInvariant())
            {
                default:
                case "fifo":
                    return new FIFOTaxLotMethod();
                case "lifo":
                    return new LIFOTaxLotMethod();
                case "mintax":
                    return new MinTaxLotMethod();
            }
        }

        /// <summary>
        /// Get the open Tax lots for the specified trade passed in
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element"></param>
        /// <returns></returns>
        public List<TaxLotDetail> OpenTaxLots(PostingEngineEnvironment env, Transaction element)
        {
            var fund = env.GetFund(element);

            if (element.IsBuy() || element.IsShort())
            {
                return new List<TaxLotDetail>();
            }

            var openLots = new List<TaxLotDetail>();

            var lots = env.Trades.Where(i =>
                    i.TradeDate.Date <= element.TradeDate.Date
                    && i.Symbol == element.Symbol
                    && env.GetFund(i) == fund
                    && !i.Status.Equals("Cancelled")
                    && i.LpOrderId != element.LpOrderId);

            if (element.IsSell())
            {
                var local = lots.Where(i => i.IsBuy())
                    .ToList();

                openLots.AddRange(local.Select(i=> new TaxLotDetail {
                    Trade = i,
                    TaxLotStatus = env.FindTaxLotStatus(i),
                    TaxRate = env.TradeTaxRate(i)
                }));
            }
            else if (element.IsCover())
            {
                var local = lots.Where(i => i.IsShort())
                    .ToList();

                openLots.AddRange(local.Select(i => new TaxLotDetail {
                    Trade = i,
                    TaxLotStatus = env.FindTaxLotStatus(i),
                    TaxRate = env.TradeTaxRate(i) }));
            }

            return openLots;
        }
    }

}
