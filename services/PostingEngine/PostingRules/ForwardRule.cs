using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using PostingEngine.TaxLotMethods;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.PostingRules
{
    public class ForwardRule : DefaultPostingRules, IPostingRule
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

            // On Settlement Date we backout the Tax Lot for FORWARDS
            if (env.TaxLotStatus.ContainsKey(element.LpOrderId))
            {
                var taxlot = env.TaxLotStatus[element.LpOrderId];

                if ( element.SecurityType.Equals("CROSS"))
                {
                    var listOfTradeTags = new List<Tag> {
                        Tag.Find("SecurityType"),
                        Tag.Find("CustodianCode"),
                        Tag.Find("TradeCurrency")
                    };

                    var listOfSettleTags = new List<Tag> {
                        Tag.Find("SecurityType"),
                        Tag.Find("CustodianCode"),
                        Tag.Find("SettleCurrency")
                    };

                    var accountTradeCurrency = new AccountUtils()
                        .CreateAccount(AccountType.All.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfTradeTags, element);

                    var accountSettleCurrency = new AccountUtils()
                        .CreateAccount(AccountType.All.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfSettleTags, element);

                    new AccountUtils().SaveAccountDetails(env, accountTradeCurrency);
                    new AccountUtils().SaveAccountDetails(env, accountSettleCurrency);

                    // Now Generate the Flows
                    var debit = new Journal(accountTradeCurrency, "settled-cash", env.ValueDate)
                    {
                        Source = element.LpOrderId,
                        Fund = env.GetFund(element),
                        FxCurrency = element.TradeCurrency,
                        Symbol = element.Symbol,
                        SecurityId = element.SecurityId,
                        Quantity = Convert.ToDouble(element.Quantity),

                        FxRate = 1,
                        StartPrice = 0,
                        EndPrice = 0,

                        Value = env.SignedValue(accountTradeCurrency, accountSettleCurrency, true, element.NetMoney),
                        CreditDebit = env.DebitOrCredit(accountTradeCurrency, element.NetMoney),
                    };

                    var credit = new Journal(accountSettleCurrency, "settled-cash", env.ValueDate)
                    {
                        Source = element.LpOrderId,
                        Fund = env.GetFund(element),
                        FxCurrency = element.SettleCurrency,
                        Symbol = element.Symbol,
                        SecurityId = element.SecurityId,
                        Quantity = Convert.ToDouble(element.Quantity),

                        FxRate = 1,
                        StartPrice = 0,
                        EndPrice = 0,

                        Value = env.SignedValue(accountTradeCurrency, accountSettleCurrency, false, element.NetMoney),
                        CreditDebit = env.DebitOrCredit(accountSettleCurrency, element.NetMoney),
                    };

                    env.Journals.AddRange(new[] { credit, debit });

                    if (taxlot.Quantity != 0)
                    {
                        var buyTrade = env.FindTrade(taxlot.OpenId);
                        CommonRules.RelieveTaxLot(env, buyTrade, element, taxlot.Quantity * -1, true);
                        taxlot.Quantity = 0;
                        taxlot.Status = "Closed";
                    }
                }
                else
                {
                    var buyTrade = env.FindTrade(taxlot.OpenId);
                    if (taxlot.Quantity != 0)
                    {
                        CommonRules.RelieveTaxLot(env, buyTrade, element, taxlot.Quantity * -1, true);
                        taxlot.Quantity = 0;
                        taxlot.Status = "Closed";
                    }
                }
            }
        }

        /// <summary>
        /// TradeCurrency == Base
        /// SettleCurrency == Risk
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element"></param>
        public new void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

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
                    Logger.Warn($"Created an Open Tax Lot for {element.Symbol}::{element.Side}");
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
                            Logger.Warn($"Unable to Find Tax Lot for {lot.Trade.Symbol}::{lot.Trade.Side}::{lot.Trade.Status}");
                            // TODO: For this open lot there should be a corresponding open to 
                            //Logger.Warn($"Unable to Find Tax Lot for {lot.Trade.Symbol}::{lot.Trade.Side}::{lot.Trade.Status}");
                            continue;
                        }

                        var taxlotStatus = env.TaxLotStatus[lot.Trade.LpOrderId];
                        if (taxlotStatus != null && taxlotStatus.Quantity != 0 && !taxlotStatus.Status.ToLowerInvariant().Equals("closed"))
                        {
                            // Does the open Lot fully fullfill the quantity ?
                            if (Math.Abs(taxlotStatus.Quantity) >= Math.Abs(workingQuantity))
                            {
                                var buyTrade = env.FindTrade(lot.Trade.LpOrderId);

                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, workingQuantity, true);

                                taxlotStatus.Quantity += workingQuantity;
                                if (taxlotStatus.Quantity == 0)
                                    taxlotStatus.Status = "Closed";
                                else
                                    taxlotStatus.Status = "Partially Closed";

                                var prevPrice = MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price;
                                var unrealizedPnl = taxlotStatus.Quantity * (element.SettleNetPrice - prevPrice) * fxrate;

                                CommonRules.PostUnRealizedPnl(
                                    env,
                                    buyTrade, 
                                    unrealizedPnl,
                                    MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price,
                                    element.SettleNetPrice, fxrate);

                                var PnL = Math.Abs(taxlot.Quantity) * (taxlot.CostBasis - taxlot.TradePrice) * fxrate;
                                CommonRules.PostRealizedPnl(
                                    env,
                                    buyTrade, 
                                    PnL,
                                    taxlot.TradePrice,
                                    taxlot.CostBasis, fxrate);

                                var listOfFromTags = new List<Tag>
                                    {
                                        Tag.Find("SecurityType"),
                                        Tag.Find("CustodianCode")
                                    };

                                var markToMarketAccount = (element.IsShort() || element.IsCover()) ? "Mark to Market Shorts" : "Mark to Market Longs";
                                var accountType = (element.IsShort() || element.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";

                                var fromAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(accountType)).FirstOrDefault(), listOfFromTags, element);
                                var toAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(markToMarketAccount)).FirstOrDefault(), listOfFromTags, element);

                                new AccountUtils().SaveAccountDetails(env, fromAccount);
                                new AccountUtils().SaveAccountDetails(env, toAccount);


                                // Now Generate Entries
                                var fromJournal = new Journal(element)
                                {
                                    Account = fromAccount,
                                    CreditDebit = env.DebitOrCredit(fromAccount, PnL),
                                    When = env.ValueDate,
                                    StartPrice = taxlot.TradePrice,
                                    EndPrice = taxlot.CostBasis,
                                    Value = PnL,
                                    FxRate = 1,
                                    Event = "realizedpnl",
                                    Fund = env.GetFund(element),
                                };

                                var toJournal = new Journal(element)
                                {
                                    Account = toAccount,
                                    When = env.ValueDate,
                                    StartPrice = taxlot.TradePrice,
                                    EndPrice = taxlot.CostBasis,
                                    FxRate = 1,
                                    CreditDebit = env.DebitOrCredit(toAccount, PnL * -1),
                                    Value = PnL * -1,
                                    Event = "realizedpnl",
                                    Fund = env.GetFund(element),
                                };

                                env.Journals.AddRange(new[] { fromJournal, toJournal });

                                break;
                            }
                            else
                            {
                                var taxlot = CommonRules.RelieveTaxLot(env, lot, element, taxlotStatus.Quantity);

                                workingQuantity += taxlotStatus.Quantity;

                                var PnL = Math.Abs(taxlot.Quantity) * (taxlot.CostBasis - taxlot.TradePrice) * fxrate;

                                CommonRules.PostRealizedPnl(env, element, PnL, taxlot.TradePrice, taxlot.CostBasis,fxrate);

                                taxlotStatus.Quantity = 0;
                                taxlotStatus.Status = "Closed";
                            }
                        }
                    }                    
                }

                // Given the openlots we now need to match off quantity
                var residualQuantity = element.Quantity;
            }
            else
            {
                // We have a Debit / Credit Dividends
            }
        }
    }
}
