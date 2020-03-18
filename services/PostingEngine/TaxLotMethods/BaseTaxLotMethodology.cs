using PostingEngine.Contracts;
using System;
using System.Collections.Generic;
using System.Linq;
using LP.Finance.Common.Model;
using PostingEngine.TaxLotMethods.Implementation;

namespace PostingEngine.TaxLotMethods
{

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
                case "minimumtax":
                    return new MinimumTaxLotMethod();
            }
        }

        /// <summary>
        /// Get the open Tax lots for the specified trade passed in, general rule of thumb is that I will get a SELL or COVER which then
        /// is matched off against a BUY Or SHORT, but for some instrument types this rule is broken
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element"></param>
        /// <returns></returns>
        public static List<TaxLotDetail> OpenTaxLots(PostingEngineEnvironment env, Transaction element, double workingQuantity)
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
                    && env.TaxLotsIsOpen(i)
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

        static internal void Log(NLog.Logger Logger, List<TaxLotDetail> taxlots)
        {
            // Display all of the retrieved Tax Lots so that we can double check
            if (taxlots.Count() == 0)
                return;


            /*
            var taxlot = taxlots[0];
            Logger.Info($"Retrieved Open Tax Lots {taxlot.Trade.Symbol}::{taxlot.Trade.Side}");
            foreach (var i in taxlots)
            {
                Logger.Info($"==> Open Tax Lots [{i.TradePrice}]::{i.Trade.TradeDate.ToString("MM-dd-yyyy")}::{i.TaxRate.Rate}::{i.PotentialPnl}::{i.TaxLiability}::{i.TaxLotStatus.Quantity}");
            }
            */
        }
    }

}
