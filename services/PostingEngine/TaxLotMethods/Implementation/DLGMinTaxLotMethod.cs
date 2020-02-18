using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.Extensions;
using PostingEngine.MarketData;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.TaxLotMethods
{
    /// <summary>
    /// DLG implementation, this is not what citco has implemented
    /// </summary>
    /// <param name="element">Closing Tax Lot</param>
    /// <returns>List of matched open Lots / ordered by Min Tax effect</returns>
    public class DLGMinTaxLotMethod : ITaxLotMethodology
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element, double workingQuantity)
        {
            Logger.Info($"Getting Open Tax Lots for {element.Symbol}::{element.Side}::{workingQuantity}::{element.TradeDate.ToString("MM-dd-yyyy")}");

            var minTaxLots = new List<TaxLotDetail>();

            var openlots = BaseTaxLotMethodology.OpenTaxLots(env, element, workingQuantity).ToList();

            var results = openlots.Select(i => new {
                trade = i.Trade,
                taxRate = i.TaxRate,
                taxLotStatus = i.TaxLotStatus,
                potentialPnl = CalculateUnrealizedPnl(env, i, element, workingQuantity),
                taxAmount = CalculateTaxImplication(env, i, element, workingQuantity)
            }).ToList();

            minTaxLots = results.Where(i => i.taxLotStatus.Quantity != 0).OrderBy(i=> Math.Abs(i.taxAmount)).Select(i=> new TaxLotDetail {
                TaxRate = i.taxRate,
                Trade = i.trade,
                TaxLotStatus = i.taxLotStatus,
                PotentialPnl = i.potentialPnl,
                TaxLiability = i.taxAmount
            }).ToList();

            BaseTaxLotMethodology.Log(Logger, minTaxLots);

            return minTaxLots;
        }

        private double CalculateTaxImplication(PostingEngineEnvironment env, TaxLotDetail i, Transaction trade, double workingQuantity)
        {
            var unrealizedPnl = CalculateUnrealizedPnl(env, i, trade, workingQuantity);

            var taxrate = Convert.ToDouble(i.TaxRate.Rate);

            var taxImplication = unrealizedPnl * taxrate;

            return taxImplication;
        }

        /// <summary>
        /// Calculate the Unrealized Pnl for the passed TaxLotStatus
        /// </summary>
        /// <param name="env"></param>
        /// <param name="i"></param>
        /// <param name="trade"></param>
        /// <returns></returns>
        private double CalculateUnrealizedPnl(PostingEngineEnvironment env, TaxLotDetail i, Transaction trade, double workingQuantity)
        {
            var fxrate = FxRates.Find(env, env.ValueDate, i.Trade.SettleCurrency).Rate;

            var multiplier = trade.Multiplier(env);

            if (env.TaxLotStatus.ContainsKey(i.Trade.LpOrderId))
            {
                var lot = i.TaxLotStatus;

                var quantity = Math.Abs(lot.Quantity) > Math.Abs(workingQuantity) ? workingQuantity : lot.Quantity;

                var unrealizedPnl = (trade.SettleNetPrice - i.Trade.SettleNetPrice) * Math.Abs(quantity) * fxrate * multiplier;

                if ( trade.IsCover() )
                {
                    unrealizedPnl *= -1;
                }
                else if ( trade.IsSell())
                {
                    unrealizedPnl *= -1;
                }
                return unrealizedPnl;
            }

            return 0;
        }

    }

}
