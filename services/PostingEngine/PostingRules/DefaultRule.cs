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

            var fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("Mark to Market Longs")).FirstOrDefault(), listOfFromTags, element);

            if (element.Side == "SHORT")
            {
                fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("Mark to Market Shorts")).FirstOrDefault(), listOfFromTags, element);
            }

            var toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("CHANGE IN UNREALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        public new void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.TradeCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.TradeCurrency).Rate);
            }

            var tradeAllocations = env.Allocations.Where(i => i.LpOrderId == element.LpOrderId).ToList();

            if ( element.IsBuy() || element.IsShort())
            {
                var tl = new TaxLotStatus {
                    TradeDate = element.TradeDate,
                    InvestmentAtCost = element.NetMoney * fxrate,
                    BusinessDate = element.TradeDate,
                    Symbol = element.Symbol,
                    Side = element.Side,
                    OpenId = element.LpOrderId,
                    Status = "Open",
                    OriginalQuantity = element.Quantity,
                    Quantity = element.Quantity };
                env.TaxLotStatus.Add(element.LpOrderId, tl);

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
                    Console.WriteLine("Should for a sell have at least one open lot");
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
                                var tl = new TaxLot {
                                    BusinessDate = env.ValueDate,
                                    OpeningLotId = lot.Trade.LpOrderId,
                                    ClosingLotId = element.LpOrderId,
                                    TradePrice = lot.Trade.SettleNetPrice, // Opening Trade Price
                                    CostBasis = element.SettleNetPrice, // Closing Trade Price
                                    Quantity = workingQuantity };
                                tl.Save(env.Connection, env.Transaction);

                                taxlotStatus.Quantity += workingQuantity;
                                if (taxlotStatus.Quantity == 0)
                                    taxlotStatus.Status = "Closed";
                                else
                                    taxlotStatus.Status = "Partially Closed";

                                var unrealizedPnl = taxlotStatus.Quantity * (element.SettleNetPrice - env.PrevMarketPrices[lot.Trade.Symbol].Price);
                                PostUnRealizedPnl(
                                    env, 
                                    env.FindTrade(lot.Trade.LpOrderId), 
                                    unrealizedPnl,
                                    env.PrevMarketPrices[lot.Trade.BloombergCode].Price,
                                    element.SettleNetPrice, 1);

                                // This is realized Pnl, need to post this as a journal entry
                                if ( element.Symbol.Equals("IBM"))
                                {

                                }
                                var PnL = Math.Abs(tl.Quantity) * (tl.CostBasis - tl.TradePrice);
                                PostRealizedPnl(
                                    env, 
                                    element, 
                                    PnL, 
                                    tl.TradePrice, 
                                    tl.CostBasis);

                                var listOfFromTags = new List<Tag>
                                    {
                                        Tag.Find("SecurityType"),
                                        Tag.Find("CustodianCode")
                                    };

                                var fromAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals("LONG POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);
                                var toAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals("Mark to Market Longs")).FirstOrDefault(), listOfFromTags, element);

                                new AccountUtils().SaveAccountDetails(env, fromAccount);
                                new AccountUtils().SaveAccountDetails(env, toAccount);


                                // Now Generate Entries
                                var fromJournal = new Journal
                                {
                                    Source = element.LpOrderId,
                                    Account = fromAccount,
                                    CreditDebit = env.DebitOrCredit(fromAccount, PnL),
                                    When = env.ValueDate,
                                    StartPrice = tl.TradePrice,
                                    EndPrice = tl.CostBasis,
                                    Value = PnL,
                                    FxCurrency = element.TradeCurrency,
                                    Quantity = element.Quantity,
                                    Symbol = element.Symbol,
                                    FxRate = 1,
                                    Event = "realizedpnl",
                                    Fund = tradeAllocations[0].Fund,
                                };

                                var toJournal = new Journal
                                {
                                    Source = element.LpOrderId,
                                    Account = toAccount,
                                    When = env.ValueDate,
                                    FxCurrency = element.TradeCurrency,
                                    StartPrice = tl.TradePrice,
                                    EndPrice = tl.CostBasis,
                                    Symbol = element.Symbol,
                                    Quantity = element.Quantity,
                                    FxRate = 1,
                                    CreditDebit = env.DebitOrCredit(toAccount, PnL * -1),
                                    Value = PnL * -1,
                                    Event = "realizedpnl",
                                    Fund = tradeAllocations[0].Fund,
                                };

                                env.Journals.AddRange(new[] { fromJournal, toJournal });

                                break;
                            }
                            else
                            {
                                var tl = new TaxLot {
                                    BusinessDate = env.ValueDate,
                                    OpeningLotId = lot.Trade.LpOrderId,
                                    ClosingLotId = element.LpOrderId,
                                    TradePrice = lot.Trade.SettleNetPrice,
                                    CostBasis = element.SettleNetPrice,
                                    Quantity = taxlotStatus.Quantity };
                                tl.Save(env.Connection, env.Transaction);
                                workingQuantity -= Math.Abs(taxlotStatus.Quantity);

                                var PnL = tl.Quantity * (tl.CostBasis - tl.TradePrice);

                                PostRealizedPnl(env, element, PnL, tl.TradePrice, tl.CostBasis);

                                taxlotStatus.Quantity = 0;
                                taxlotStatus.Status = "Closed";
                            }
                        }
                    }                    
                }

                // Given the openlots we now need to match off quantity
                var residualQuantity = element.Quantity;


            } else
            {
                // We have a Debit / Credit Dividends
            }
        }

        private void PostRealizedPnl(PostingEngineEnvironment env, Transaction element, double pnL, double start, double end)
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

            var debitJournal = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.From,
                When = env.ValueDate,
                StartPrice = start,
                EndPrice = end,
                CreditDebit = env.DebitOrCredit(accountToFrom.From, pnL),
                Value = pnL,
                FxCurrency = element.TradeCurrency,
                Quantity = element.Quantity,
                Symbol = element.Symbol,
                FxRate = 1,
                Event = "realizedpnl",
                Fund = tradeAllocations[0].Fund,
            };

            var creditJournal = new Journal(accountToFrom.To, "realizedpnl", env.ValueDate)
            {
                Source = element.LpOrderId,
                Account = accountToFrom.To,
                FxCurrency = element.TradeCurrency,
                StartPrice = start,
                EndPrice = end,
                Symbol = element.Symbol,
                Quantity = element.Quantity,
                FxRate = 1,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, pnL * -1),
                Value = pnL * -1,
                Fund = tradeAllocations[0].Fund,
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

            var fromJournal = new Journal
            {
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
