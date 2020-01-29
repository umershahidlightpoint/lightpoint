using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.TaxLotMethods
{
    /// <summary>
    /// Need to calculate a tax liability and then sort the Open Tax lots in ascending order, so that we close out tax lots according to min tax liability
    /// </summary>
    /// <param name="element">Closing Tax Lot</param>
    /// <returns>List of matched open Lots / ordered by Min Tax effect</returns>
    public class MinTaxLotMethod : ITaxLotMethodology
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element)
        {
            Logger.Info($"Getting Open Tax Lots for {element.Symbol}::{element.Side}::{env.GetFund(element)}::{element.TradeDate.ToString("MM-dd-yyyy")}");

            var minTaxLots = new List<TaxLotDetail>();

            var openlots = new BaseTaxLotMethodology().OpenTaxLots(env, element).ToList();

            var results = openlots.Select(i => new {
                trade = i.Trade,
                taxRate = i.TaxRate,
                taxLotStatus = i.TaxLotStatus,
                potentialPnl = CalculateUnrealizedPnl(env, i, element),
                taxAmount = CalculateTaxImplication(env, i, element)
            }).ToList();

            minTaxLots = results.Where(i => i.taxLotStatus.Quantity != 0).OrderBy(i=> Math.Abs(i.taxAmount)).Select(i=> new TaxLotDetail {
                TaxRate = i.taxRate,
                Trade = i.trade,
                TaxLotStatus = i.taxLotStatus,
                PotentialPnl = i.potentialPnl,
                TaxLiability = i.taxAmount
            }).ToList();

            // Display all of the retrieved Tax Lots so that we can double check
            foreach(var i in minTaxLots)
            {
                Logger.Info($"Retrieved Open Tax Lots {i.Trade.TradeDate.ToString("MM-dd-yyyy")}::{i.TaxRate.Rate}::{i.PotentialPnl}::{i.TaxLiability}::{i.TaxLotStatus.Quantity}");
            }

            return minTaxLots;
        }

        private double CalculateTaxImplication(PostingEngineEnvironment env, TaxLotDetail i, Transaction trade)
        {
            var unrealizedPnl = CalculateUnrealizedPnl(env, i, trade);

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
        private double CalculateUnrealizedPnl(PostingEngineEnvironment env, TaxLotDetail i, Transaction trade)
        {
            var eodPrice = MarketPrices.GetPrice(env, env.ValueDate, i.Trade).Price;
            var fxrate = FxRates.Find(env.ValueDate, i.Trade.SettleCurrency).Rate;

            if (env.TaxLotStatus.ContainsKey(i.Trade.LpOrderId))
            {
                var lot = i.TaxLotStatus;

                var quantity = Math.Abs(lot.Quantity) > Math.Abs(trade.Quantity) ? trade.Quantity : lot.Quantity;

                var unrealizedPnl = (trade.SettleNetPrice - i.Trade.SettleNetPrice) * Math.Abs(quantity) * fxrate;

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
