using System;
using System.Collections.Generic;
using System.Linq;
using LP.Finance.Common.Model;
using PostingEngine.Contracts;
using PostingEngine.MarketData;

namespace PostingEngine.TaxLotMethods.Implementation
{
    /// <summary>
    /// Need to calculate a tax liability and then sort the Open Tax lots in ascending order, so that we close out tax lots according to min tax liability
    /// </summary>
    /// <param name="element">Closing Tax Lot</param>
    /// <returns>List of matched open Lots / ordered by Min Tax effect</returns>
    public class MinimumTaxLotMethod : ITaxLotMethodology
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element, double workingQuantity)
        {
            Logger.Info($"Getting Open Tax Lots for {element.Symbol}::{element.Side}::{workingQuantity}::{element.TradeDate.ToString("MM-dd-yyyy")}");

            var openlots = BaseTaxLotMethodology.OpenTaxLots(env, element, workingQuantity).ToList();

            var results = openlots.Select(i => new {
                trade = i.Trade,
                taxRate = i.TaxRate,
                taxLotStatus = i.TaxLotStatus,
                potentialPnl = CalculateUnrealizedPnl(env, i, element, i.TaxLotStatus.Quantity),
                taxAmount = CalculateTaxImplication(env, i, element, i.TaxLotStatus.Quantity)
            }).ToList();

            // this gives me the losses first and then the gains
            var taxlots = results.Where(i => i.taxLotStatus.Quantity != 0).OrderBy(i => Math.Abs(i.taxAmount)).Select(i => new TaxLotDetail
            {
                TaxRate = i.taxRate,
                Trade = i.trade,
                TaxLotStatus = i.taxLotStatus,
                PotentialPnl = i.potentialPnl,
                TaxLiability = i.taxAmount
            }).ToList();

            BaseTaxLotMethodology.Log(Logger, taxlots);

            return taxlots;
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

                var quantity = lot.Quantity;

                var unrealizedPnl = (trade.FactoredSettleNetPrice() - i.Trade.FactoredSettleNetPrice()) * Math.Abs(quantity) * fxrate * multiplier;

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
