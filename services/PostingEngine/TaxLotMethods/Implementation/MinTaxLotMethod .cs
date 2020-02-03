using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.TaxLotMethods
{
    /// <summary>
    /// Order by Potential Pnl, Losses first and then gains, and also order by the lowest cost basis, i.e. the trade price, lowest first
    /// </summary>
    /// <param name="element">Closing Tax Lot</param>
    /// <returns>List of matched open Lots / ordered by Min Tax effect</returns>
    public class MinTaxLotMethod : ITaxLotMethodology
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element, double workingQuantity)
        {
            Logger.Info($"Getting Open Tax Lots for {element.Symbol}::{element.SettleNetPrice}::{element.Side}::[{element.Quantity}]::WQ:{workingQuantity}::{element.TradeDate.ToString("MM-dd-yyyy")}");

            var minTaxLots = new List<TaxLotDetail>();

            var openlots = BaseTaxLotMethodology.OpenTaxLots(env, element, workingQuantity).ToList();

            var results = openlots.Select(i => new {
                trade = i.Trade,
                taxRate = i.TaxRate,
                taxLotStatus = i.TaxLotStatus,
                potentialPnl = CalculateUnrealizedPnl(env, i, element, i.TaxLotStatus.Quantity),
                taxAmount = CalculateTaxImplication(env, i, element, i.TaxLotStatus.Quantity)
            }).ToList();

            if (element.IsSell()) // SELL
            {
                minTaxLots = results.Where(i => i.taxLotStatus.Quantity != 0)
                    //.OrderBy(i=> i.potentialPnl)
                    .OrderByDescending(i => i.trade.SettleNetPrice)
                    .Select(i => new TaxLotDetail
                    {
                        TaxRate = i.taxRate,
                        Trade = i.trade,
                        TradePrice = i.trade.SettleNetPrice,
                        TaxLotStatus = i.taxLotStatus,
                        PotentialPnl = i.potentialPnl,
                        TaxLiability = i.taxAmount
                    }).ToList();
            }
            else // COVER
            {
                minTaxLots = results.Where(i => i.taxLotStatus.Quantity != 0)
                    //.OrderBy(i=> i.potentialPnl)
                    .OrderBy(i => i.trade.SettleNetPrice)
                    .Select(i => new TaxLotDetail
                    {
                        TaxRate = i.taxRate,
                        Trade = i.trade,
                        TradePrice = i.trade.SettleNetPrice,
                        TaxLotStatus = i.taxLotStatus,
                        PotentialPnl = i.potentialPnl,
                        TaxLiability = i.taxAmount
                    }).ToList();
            }

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
            var fxrate = FxRates.Find(env.ValueDate, i.Trade.SettleCurrency).Rate;

            double multiplier = 1.0;

            if (env.SecurityDetails.ContainsKey(trade.BloombergCode))
                multiplier = env.SecurityDetails[trade.BloombergCode].Multiplier;


            if (env.TaxLotStatus.ContainsKey(i.Trade.LpOrderId))
            {
                var lot = i.TaxLotStatus;

                var quantity = lot.Quantity;

                var unrealizedPnl = (trade.SettleNetPrice - i.Trade.SettleNetPrice) * quantity * fxrate * multiplier;

                return unrealizedPnl;
            }

            return 0;
        }

    }

}
