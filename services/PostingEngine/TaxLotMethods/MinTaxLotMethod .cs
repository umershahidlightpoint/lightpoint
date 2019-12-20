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
        public List<TaxLotDetail> GetOpenLots(PostingEngineEnvironment env, Transaction element)
        {
            var minTaxLots = new List<TaxLotDetail>();

            var openlots = new BaseTaxLotMethodology().OpenTaxLots(env, element).OrderByDescending(i => i.Trade.TradeDate).ToList();

            var results = openlots.Select(i => new {
                trade = i.Trade,
                taxRate = i.TaxRate,
                taxAmount = CalculateTaxImplication(env, i)
            }).ToList();

            minTaxLots = results.OrderBy(i=> i.taxAmount).Select(i=> new TaxLotDetail {
                TaxRate = i.taxRate,
                Trade = i.trade
            }).ToList();

            return minTaxLots;
        }

        private double CalculateTaxImplication(PostingEngineEnvironment env, TaxLotDetail i)
        {
            var taxrate = Convert.ToDouble(i.TaxRate.Rate);

            var eodPrice = MarketPrices.Find(env.ValueDate, i.Trade.BloombergCode).Price;
            var fxrate = FxRates.Find(env.ValueDate, i.Trade.SettleCurrency).Rate;

            var taxImplication = (eodPrice * i.Trade.SettleNetPrice) * i.Trade.Quantity * fxrate * taxrate;

            return taxImplication;
        }
    }

}
