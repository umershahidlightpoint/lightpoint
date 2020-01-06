using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.PostingRules
{
    public class DefaultRule : DefaultPostingRules, IPostingRule
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        public bool IsValid(PostingEngineEnvironment env, Transaction element)
        {
            return true;
        }

        /// <summary>
        /// Run for each day that the Tax Lot remains open / partially closed
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element">Trade we aee interested in</param>
        public new void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            base.DailyEvent(env, element);
        }

        public new void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            // NO Need for Swaps and Futures / Forwards as we don't own the stock
        }

        public new void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            double fxrate = 1.0;

            double multiplier = 1.0;

            if (env.SecurityDetails.ContainsKey(element.BloombergCode))
                multiplier = env.SecurityDetails[element.BloombergCode].Multiplier;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            var tradeAllocations = env.Allocations.Where(i => i.LpOrderId == element.LpOrderId).ToList();

            if ( element.IsBuy() || element.IsShort())
            {
                var t1 = env.GenerateOpenTaxLot(element, fxrate);

                if ( element.Quantity == 0 )
                {
                    // TODO: Need to review this as we need to see if there is a parent, and what the parents actuall is
                    return;
                }

                //tl.Save(env.Connection, env.Transaction);
            }
            else if (element.IsSell() || element.IsCover())
            {
                // Get Matching Lots
                var openLots = env.Methodology.GetOpenLots(env, element);

                if ( openLots.Count() == 0)
                {
                    var t1 = env.GenerateOpenTaxLot(element, fxrate);
                    // Whats going on here?
                    // We are skipping anything that does not get an OpenLot
                    Logger.Warn($"There should be for a sell {element.Symbol} have at least one open lot, non found");
                }
                else
                {
                    var workingQuantity = element.Quantity;

                    foreach( var lot in openLots)
                    {
                        if (workingQuantity == 0)
                            break;

                        if ( !env.TaxLotStatus.ContainsKey(lot.Trade.LpOrderId))
                        {
                            // TODO: For this open lot there should be a corresponding open to 
                            continue;
                        }

                        var taxlotStatus = env.TaxLotStatus[lot.Trade.LpOrderId];
                        if (taxlotStatus != null && taxlotStatus.Quantity != 0 && !taxlotStatus.Status.ToLowerInvariant().Equals("closed"))
                        {
                            // Does the open Lot fully fullfill the quantity ?
                            if (Math.Abs(taxlotStatus.Quantity) >= Math.Abs(workingQuantity))
                            {
                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, workingQuantity, true);

                                taxlotStatus.Quantity += workingQuantity;
                                if (taxlotStatus.Quantity == 0)
                                    taxlotStatus.Status = "Closed";
                                else
                                    taxlotStatus.Status = "Partially Closed";

                                CommonRules.GenerateCloseOutPostings(env, lot, taxlot, element, taxlotStatus, tradeAllocations[0].Fund);

                                break;
                            }
                            else
                            {
                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, taxlotStatus.Quantity * -1);

                                workingQuantity -= Math.Abs(taxlotStatus.Quantity);

                                CommonRules.PostRealizedPnl(env, element, taxlot.RealizedPnl, taxlot.TradePrice, taxlot.CostBasis);

                                taxlotStatus.Quantity = 0;
                                taxlotStatus.Status = "Closed";
                            }
                        }
                    }                    
                }
            }
            else
            {
                // We have a Debit / Credit Dividends
            }
        }
    }
}
