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
        }

        private AccountToFrom RealizedPnlPostingAccounts(Transaction element)
        {
            var type = element.GetType();
            var accountTypes = AccountType.All;

            var listOfFromTags = new List<Tag> {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
             };

            var listOfToTags = new List<Tag>
            {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
            };

            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account

            fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("CHANGE IN UNREALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfFromTags, element);
            toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("REALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        // UnrelaizedPnlPostingAccount(Transaction element, "", "")

        private AccountToFrom UnRealizedPnlPostingAccounts(Transaction element)
        {
            var type = element.GetType();
            var accountTypes = AccountType.All;

            var listOfFromTags = new List<Tag> {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
             };

            var listOfToTags = new List<Tag>
            {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
            };


            var markToMarketAccount = element.IsShort() ? "Mark to Market Shorts" : "Mark to Market Longs";

            var fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals(markToMarketAccount)).FirstOrDefault(), listOfFromTags, element);
            var toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("CHANGE IN UNREALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
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
                            //Logger.Warn($"Unable to Find Tax Lot for {lot.Trade.Symbol}::{lot.Trade.Side}::{lot.Trade.Status}");
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

                                var prevPrice = MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price;
                                var unrealizedPnl = taxlotStatus.Quantity * (element.SettleNetPrice - prevPrice) * fxrate;

                                PostUnRealizedPnl(
                                    env, 
                                    env.FindTrade(lot.Trade.LpOrderId), 
                                    unrealizedPnl,
                                    MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price,
                                    element.SettleNetPrice, fxrate);

                                var PnL = Math.Abs(taxlot.Quantity) * (taxlot.CostBasis - taxlot.TradePrice) * fxrate;
                                PostRealizedPnl(
                                    env, 
                                    element, 
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

                                workingQuantity -= Math.Abs(taxlotStatus.Quantity);

                                var PnL = taxlot.Quantity * (taxlot.CostBasis - taxlot.TradePrice) * fxrate;

                                PostRealizedPnl(env, element, PnL, taxlot.TradePrice, taxlot.CostBasis,fxrate);

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

        private void PostRealizedPnl(PostingEngineEnvironment env, Transaction element, double pnL, double start, double end, double fxrate)
        {
            var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();
            if( tradeAllocations.Count == 0)
            {

            }
            var accountToFrom = RealizedPnlPostingAccounts(element);

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            var fund = tradeAllocations[0].Fund;
            if (String.IsNullOrEmpty(fund))
            {

            }

            var debitJournal = new Journal(element)
            {
                Account = accountToFrom.From,
                When = env.ValueDate,
                StartPrice = start,
                EndPrice = end,
                CreditDebit = env.DebitOrCredit(accountToFrom.From, pnL),
                Value = pnL,
                FxRate = fxrate,
                Event = "realizedpnl",
                Fund = env.GetFund(element),
            };

            var creditJournal = new Journal(accountToFrom.To, "realizedpnl", env.ValueDate)
            {
                Source = element.LpOrderId,
                Account = accountToFrom.To,
                FxCurrency = element.SettleCurrency,
                StartPrice = start,
                EndPrice = end,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = element.Quantity,
                FxRate = fxrate,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, pnL * -1),
                Value = pnL * -1,
                Fund = env.GetFund(element),
            };

            env.Journals.AddRange(new[] { debitJournal, creditJournal });
        }
        private void PostUnRealizedPnl(PostingEngineEnvironment env, Transaction element, double unrealizedPnl, double start, double end, double fxrate)
        {
            var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();
            if (tradeAllocations.Count == 0)
            {

            }
            var accountToFrom = UnRealizedPnlPostingAccounts(element);

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            var fromJournal = new Journal(element)
            {
                When = env.ValueDate,
                Event = "unrealizedpnl",
                FxRate = fxrate,
                Fund = env.GetFund(element),
                StartPrice = start,
                EndPrice = end,

                Account = accountToFrom.From,
                CreditDebit = env.DebitOrCredit(accountToFrom.From, unrealizedPnl),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, unrealizedPnl),
            };

            var toJournal = new Journal(fromJournal)
            {
                /*
                Source = element.LpOrderId,
                When = env.ValueDate,
                FxCurrency = element.TradeCurrency,
                Symbol = element.Symbol,
                Quantity = element.Quantity,
                Event = "unrealizedpnl",
                FxRate = fxrate,
                Fund = tradeAllocations[0].Fund,
                StartPrice = start,
                EndPrice = end,
                */

                Account = accountToFrom.To,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, unrealizedPnl),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, unrealizedPnl),
            };

            env.Journals.AddRange(new[] { fromJournal, toJournal });
        }
    }
}
