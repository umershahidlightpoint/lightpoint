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
        /// <summary>
        /// The currently supported tax lot methodologies
        /// </summary>
        /// <param name="methodology"></param>
        /// <returns></returns>
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
        /// Get the open Tax lots for the specified trade passed in, general rule of thumb is that I will get a SELL or COVER which then
        /// is matched off against a BUY Or SHORT, but for some instrument types this rule is broken
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element"></param>
        /// <returns></returns>
        public List<TaxLotDetail> OpenTaxLots(PostingEngineEnvironment env, Transaction element)
        {
            var fund = env.GetFund(element);

            // TBD: DLG This may be wrong, as we do get Sells / Covers prior to a Buy or a Sell
            if (element.IsBuy() || element.IsShort())
            {
                return new List<TaxLotDetail>();
            }

            var openLots = new List<TaxLotDetail>();

            // Need to ensure that we only get trades that are prior to this trade's trade time, and don't inlcude this trade
            var lots = env.Trades.Where(i =>
                    i.TradeTime <= element.TradeTime
                    && i.Symbol == element.Symbol
                    && env.GetFund(i) == fund
                    && !i.Status.Equals("Cancelled")
                    && i.LpOrderId != element.LpOrderId);

            // We need to grab the opposite of the past trade
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
            else if (element.IsBuy())
            {
                var local = lots.Where(i => i.IsSell())
                    .ToList();

                openLots.AddRange(local.Select(i => new TaxLotDetail
                {
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
            else if (element.IsShort())
            {
                var local = lots.Where(i => i.IsCover())
                    .ToList();

                openLots.AddRange(local.Select(i => new TaxLotDetail
                {
                    Trade = i,
                    TaxLotStatus = env.FindTaxLotStatus(i),
                    TaxRate = env.TradeTaxRate(i)
                }));
            }


            return openLots;
        }
    }

}
