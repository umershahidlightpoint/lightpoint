using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.PostingRules
{

    // Common functions that are shared across all IPostingRule implementations
    public class DefaultPostingRules
    {
        internal void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            double tradefxrate = 1.0;
            double settlefxrate = 1.0;
            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                tradefxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
                fxrate = tradefxrate;
            }

            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                settlefxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
                fxrate = settlefxrate;
            }

            // Calculate the unrealized PNL
            if (env.TaxLotStatus.ContainsKey(element.LpOrderId))
            {
                var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();

                // Determine if we need to accumulate unrealized PNL
                var taxlot = env.TaxLotStatus[element.LpOrderId];

                if (!taxlot.Status.ToLowerInvariant().Equals("closed"))
                {
                    var type = element.GetType();
                    var accountTypes = AccountType.All;

                    var listOfFromTags = new List<Tag>
                    {
                        Tag.Find("SecurityType"),
                        Tag.Find("CustodianCode")
                    };

                    var listOfToTags = new List<Tag> {
                        Tag.Find("SecurityType"),
                        Tag.Find("CustodianCode")
                     };

                    // We have an open / partially closed tax lot so now need to calculate unrealized Pnl
                    var quantity = taxlot.Quantity;
                    var symbol = element.Symbol;

                    var prevEodPrice = 0.0;
                    var eodPrice = 0.0;

                    if (env.ValueDate == element.TradeDate)
                    {
                        eodPrice = MarketPrices.Find(env.ValueDate, element.BloombergCode).Price;
                        prevEodPrice = element.SettleNetPrice;
                    }
                    else
                    {
                        prevEodPrice = MarketPrices.Find(env.PreviousValueDate, element.BloombergCode).Price;
                        eodPrice = MarketPrices.Find(env.ValueDate, element.BloombergCode).Price;
                    }

                    /*
                     * In this case we are just going to add the zero rows into the system
                    if (eodPrice - prevEodPrice == 0)
                        return;
                    */
                    var multiplier = 1.0;

                    if (env.SecurityDetails.ContainsKey(element.BloombergCode))
                        multiplier = env.SecurityDetails[element.BloombergCode].Multiplier;

                    var unrealizedPnl = quantity * (eodPrice - prevEodPrice) * fxrate * multiplier;

                    var fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("Mark to Market Longs")).FirstOrDefault(), listOfFromTags, element);

                    if (taxlot.Side == "SHORT")
                    {
                        unrealizedPnl = unrealizedPnl * -1;
                        fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("Mark to Market Shorts")).FirstOrDefault(), listOfFromTags, element);
                    }

                    var toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("CHANGE IN UNREALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);

                    new AccountUtils().SaveAccountDetails(env, fromAccount);
                    new AccountUtils().SaveAccountDetails(env, toAccount);

                    var fund = tradeAllocations[0].Fund;

                    var debit = new Journal(element)
                    {
                        Account = fromAccount,
                        When = env.ValueDate,
                        Symbol = symbol,
                        Quantity = quantity,
                        FxRate = fxrate,
                        Value = env.SignedValue(fromAccount, toAccount, true, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(fromAccount, taxlot.IsShort() ? unrealizedPnl * -1 : unrealizedPnl),
                        StartPrice = prevEodPrice,
                        EndPrice = eodPrice,
                        Event = "unrealizedpnl",
                        Fund = fund,
                    };

                    var credit = new Journal(element)
                    {
                        Account = toAccount,
                        When = env.ValueDate,
                        FxRate = fxrate,
                        Quantity = quantity,
                        Value = env.SignedValue(fromAccount, toAccount, false, unrealizedPnl),
                        CreditDebit = env.DebitOrCredit(toAccount, unrealizedPnl),
                        Event = "unrealizedpnl",
                        StartPrice = prevEodPrice,
                        EndPrice = eodPrice,
                        Fund = fund,
                    };

                    env.Journals.AddRange(new[] { debit, credit });
                    if (fxrate != 1.0)
                    {
                        if (element.TradeDate != env.ValueDate && element.SettleDate >= env.ValueDate)
                        {
                            var fxJournals = new FxPosting().CreateFx(env, "daily", element.NetMoney, quantity, null, element);
                            env.Journals.AddRange(fxJournals);
                        }
                    }

                }
            }
        }
        internal void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            double tradefxrate = 1.0;
            double settlefxrate = 1.0;
            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                tradefxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
                fxrate = tradefxrate;
            }

            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                settlefxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
                fxrate = settlefxrate;
            }

            // Retrieve Allocation Objects for this trade
            var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();

            // Reversing the trade date activity
            var debitEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[1] : tradeAllocations[0];
            var creditEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[0] : tradeAllocations[1];

            var accountToFrom = new AccountingRules().GetFromToAccountOnSettlement(element, debitEntry, creditEntry);

            if (accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            // This is the fully loaded value to tbe posting

            if (element.NetMoney != 0.0)
            {
                var moneyUSD = Math.Abs(element.NetMoney) * fxrate;

                // BUY -- Debit
                // SELL -- Credit

                if (element.IsShort() || element.IsSell())
                    moneyUSD = moneyUSD * -1;

                if (element.Symbol.Equals("FB"))
                {

                }
                var debit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    FxCurrency = element.SettleCurrency,
                    Symbol = element.Symbol,
                    SecurityId = element.SecurityId,
                    Quantity = element.Quantity,
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, moneyUSD),
                    Event = "settlement",
                    Fund = debitEntry.Fund,
                };

                var credit = new Journal
                {
                    Source = element.LpOrderId,
                    FxCurrency = element.SettleCurrency,
                    Symbol = element.Symbol,
                    SecurityId = element.SecurityId,
                    Quantity = element.Quantity,

                    FxRate = fxrate,
                    When = env.ValueDate,
                    Account = accountToFrom.To,

                    CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD * -1),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, moneyUSD),
                    Event = "settlement",
                    Fund = creditEntry.Fund,
                };

                env.Journals.AddRange(new[] { debit, credit });
            }
        }
        internal void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            var tradeAllocations = env.Allocations.Where(i => i.LpOrderId == element.LpOrderId).ToList();

            if ( element.IsCredit() || element.IsDebit())
            {
                if ( element.TransactionCategory == "Cash Dividends")
                {
                    // We have a Cash Dividend, so how do we treat this
                    return;
                }
            }

            if (element.IsBuy() || element.IsShort())
            {
                var tl = new TaxLotStatus
                {
                    InvestmentAtCost = element.NetMoney * fxrate,
                    FxRate = fxrate,
                    TradeDate = element.TradeDate,
                    BusinessDate = element.TradeDate,
                    Symbol = element.Symbol,
                    Side = element.Side,
                    OpenId = element.LpOrderId,
                    Status = "Open",
                    OriginalQuantity = element.Quantity,
                    Quantity = element.Quantity
                };
                env.TaxLotStatus.Add(element.LpOrderId, tl);

                if (element.Quantity == 0)
                {
                    // TODO: Need to review this as we need to see if there is a parent, and what the parents actuall is
                    return;
                }

                //tl.Save(env.Connection, env.Transaction);
            }
            else if (element.IsSell() || element.IsCover())
            {
                if ( element.Symbol.Equals("BWX"))
                {

                }
                // Get Matching Lots
                var openLots = env.Methodology.GetOpenLots(env, element);

                if (openLots.Count() == 0)
                {
                    // Whats going on here?
                    // We are skipping anything that does not get an OpenLot
                    Console.WriteLine("Should for a sell have at least one open lot");
                }
                else
                {
                    var workingQuantity = element.Quantity;

                    foreach (var lot in openLots)
                    {
                        if (workingQuantity == 0)
                            break;

                        if (!env.TaxLotStatus.ContainsKey(lot.Trade.LpOrderId))
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
                                var tl = new TaxLot
                                {
                                    TradeDate = element.TradeDate,
                                    InvestmentAtCost = workingQuantity * lot.Trade.SettleNetPrice * fxrate,
                                    BusinessDate = env.BusinessDate,
                                    OpeningLotId = lot.Trade.LpOrderId,
                                    ClosingLotId = element.LpOrderId,
                                    TradePrice = lot.Trade.SettleNetPrice, // Opening Trade Price
                                    CostBasis = element.SettleNetPrice, // Closing Trade Price
                                    Quantity = workingQuantity
                                };
                                tl.Save(env.Connection, env.Transaction);

                                taxlotStatus.Quantity += workingQuantity;
                                if (taxlotStatus.Quantity == 0)
                                    taxlotStatus.Status = "Closed";
                                else
                                    taxlotStatus.Status = "Partially Closed";

                                var prevPrice = MarketPrices.Find(env.PreviousValueDate, lot.Trade.BloombergCode).Price;

                                // Calculate the unrealized PNL for the created Tax Lot
                                var unrealizedPnl = Math.Abs(tl.Quantity) * (element.SettleNetPrice - prevPrice);

                                PostUnRealizedPnl(
                                    env,
                                    env.FindTrade(lot.Trade.LpOrderId),
                                    unrealizedPnl,
                                    prevPrice,
                                    element.SettleNetPrice, 
                                    fxrate);

                                // Calculate the Realized PNL from closing tax lot
                                var PnL = Math.Abs(tl.Quantity) * (tl.CostBasis - tl.TradePrice) * fxrate;
                                
                                // Original FxRate
                                var changeDueToFx = fxrate - taxlotStatus.FxRate;
                                // Original Trade Price
                                var changeInRealizedPnlDueToFx = changeDueToFx * (tl.TradePrice) * Math.Abs(tl.Quantity);
                                var changeInUnRealizedPnlDueToFx = changeDueToFx * (tl.CostBasis - tl.TradePrice) * Math.Abs(tl.Quantity); ;

                                PostRealizedPnl(
                                    env,
                                    element,
                                    PnL,
                                    tl.TradePrice,
                                    tl.CostBasis, 
                                    fxrate);

                                if ( fxrate != 1.0 )
                                    PostUnrealizedFxGain(env, element, changeInUnRealizedPnlDueToFx, tl.TradePrice, tl.CostBasis, changeDueToFx);

                                if (fxrate != 1.0)
                                    PostRealizedFxGain(env, element, changeInRealizedPnlDueToFx, tl.TradePrice, tl.CostBasis, changeDueToFx);

                                var listOfFromTags = new List<Tag>
                                    {
                                        Tag.Find("SecurityType"),
                                        Tag.Find("CustodianCode")
                                    };

                                var fromTo = new AccountUtils().GetAccounts(env, "LONG POSITIONS AT COST", "Mark to Market Longs", listOfFromTags, element);

                                // Now Generate Entries for the trade that is drawing down on the taxLot
                                var fromJournal = new Journal(element)
                                {
                                    Account = fromTo.From,
                                    When = env.ValueDate,

                                    CreditDebit = env.DebitOrCredit(fromTo.From, PnL),
                                    Value = env.SignedValue(fromTo.From, fromTo.To, true, PnL),
                                    Event = "realizedpnl",
                                    Fund = tradeAllocations[0].Fund,

                                    StartPrice = tl.TradePrice,
                                    EndPrice = tl.CostBasis,
                                    FxRate = fxrate,
                                };

                                var toJournal = new Journal(element)
                                {
                                    Account = fromTo.To,
                                    When = env.ValueDate,

                                    CreditDebit = env.DebitOrCredit(fromTo.To, PnL * -1),
                                    Value = env.SignedValue(fromTo.From, fromTo.To, false, PnL),
                                    Event = "realizedpnl",
                                    Fund = tradeAllocations[0].Fund,

                                    StartPrice = tl.TradePrice,
                                    EndPrice = tl.CostBasis,
                                    FxRate = fxrate,
                                };

                                env.Journals.AddRange(new[] { fromJournal, toJournal });

                                break;
                            }
                            else
                            {
                                // Close out the tax lot
                                var tl = new TaxLot
                                {
                                    TradeDate = element.TradeDate,
                                    InvestmentAtCost = taxlotStatus.Quantity * -1 * lot.Trade.SettleNetPrice * fxrate,
                                    BusinessDate = env.ValueDate,
                                    OpeningLotId = lot.Trade.LpOrderId,
                                    ClosingLotId = element.LpOrderId,
                                    TradePrice = lot.Trade.SettleNetPrice,
                                    CostBasis = element.SettleNetPrice,
                                    Quantity = taxlotStatus.Quantity * -1
                                };
                                tl.Save(env.Connection, env.Transaction);

                                workingQuantity += taxlotStatus.Quantity;

                                var PnL = Math.Abs(tl.Quantity) * (tl.CostBasis - tl.TradePrice) * fxrate;

                                PostRealizedPnl(env, element, PnL, tl.TradePrice, tl.CostBasis, fxrate);

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

            // Retrieve Allocation Objects for this trade
            if (tradeAllocations.Count() > 2)
            {
                env.AddMessage($"#of allocations > 2 please investigate {element.LpOrderId}");
                return;
            }

            var debitEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[0] : tradeAllocations[1];
            var creditEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[1] : tradeAllocations[0];

            var accountToFrom = GetFromToAccount(element, debitEntry, creditEntry);

            if (debitEntry.Symbol.Equals("@CASHUSD"))
            {
                env.AddMessage($"Unexpected Cash allocation please investigate {element.LpOrderId}");
                return;
            }

            if (accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);


            if (element.NetMoney != 0.0)
            {
                var moneyUSD = Math.Abs(element.NetMoney) * fxrate;

                // BUY -- Debit
                // SELL -- Credit

                if (element.IsSell() || element.IsCover())
                    moneyUSD = moneyUSD * -1;

                var eodPrice = MarketPrices.Find(env.ValueDate, element.BloombergCode).Price;

                var fromJournal = new Journal(element, accountToFrom.From, "tradedate", env.ValueDate)
                {
                    CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, moneyUSD),
                    FxRate = fxrate,
                    StartPrice = element.SettleNetPrice,
                    EndPrice = eodPrice,
                    Fund = debitEntry.Fund,
                };

                var toJournal = new Journal(element, accountToFrom.To, "tradedate", env.ValueDate)
                {
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD * -1),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, moneyUSD),
                    StartPrice = element.SettleNetPrice,
                    EndPrice = eodPrice,
                    Fund = creditEntry.Fund,
                };

                env.Journals.AddRange(new[] { fromJournal, toJournal });
            }
        }

        private void PostRealizedFxGain(PostingEngineEnvironment env, Transaction element, double realizedFxPnl, double start, double end, double fxrate)
        {
            var fromTo = new AccountUtils().GetAccounts(env, "LONG POSITIONS AT COST", "REALIZED GAIN/(LOSS) DUE TO FX", new string[] { element.SettleCurrency }.ToList());

            var debit = new Journal(fromTo.From, "realized-cash-fx", env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = element.Fund,
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),

                FxRate = fxrate,
                StartPrice = start,
                EndPrice = end,

                Value = env.SignedValue(fromTo.From, fromTo.To, true, realizedFxPnl),
                CreditDebit = env.DebitOrCredit(fromTo.From, realizedFxPnl),
            };

            var credit = new Journal(fromTo.To, "realized-cash-fx", env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = element.Fund,
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),

                FxRate = fxrate,
                StartPrice = start,
                EndPrice = end,

                Value = env.SignedValue(fromTo.From, fromTo.To, false, realizedFxPnl),
                CreditDebit = env.DebitOrCredit(fromTo.To, realizedFxPnl),
            };


            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
        }

        private void PostUnrealizedFxGain(PostingEngineEnvironment env, Transaction element, double realizedFxPnl, double start, double end, double fxrate)
        {
            var fromTo = new AccountUtils().GetAccounts(env, "Mark to Market longs fx translation gain or loss", "change in unrealized do to fx translation", new string[] { element.SettleCurrency }.ToList());

            var debit = new Journal(fromTo.From, "unrealized-cash-fx", env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = element.Fund,
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),

                FxRate = fxrate,
                StartPrice = start,
                EndPrice = end,

                Value = env.SignedValue(fromTo.From, fromTo.To, true, realizedFxPnl),
                CreditDebit = env.DebitOrCredit(fromTo.From, realizedFxPnl),
            };

            var credit = new Journal(fromTo.To, "unrealized-cash-fx", env.ValueDate)
            {
                Source = element.LpOrderId,
                Fund = element.Fund,
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                SecurityId = element.SecurityId,
                Quantity = Convert.ToDouble(element.Quantity),

                FxRate = fxrate,
                StartPrice = start,
                EndPrice = end,

                Value = env.SignedValue(fromTo.From, fromTo.To, false, realizedFxPnl),
                CreditDebit = env.DebitOrCredit(fromTo.To, realizedFxPnl),
            };


            env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));
        }

        private void PostRealizedPnl(PostingEngineEnvironment env, Transaction element, double pnL, double start, double end, double fxrate)
        {
            var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();
            if (tradeAllocations.Count == 0)
            {

            }
            var accountToFrom = RealizedPnlPostingAccounts(element);

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            var fund = tradeAllocations[0].Fund;
            if (element.IsSell() || element.IsCover())
            {
                pnL = pnL * -1;
            }

            var fromJournal = new Journal(element)
            {
                Account = accountToFrom.From,
                When = env.ValueDate,
                StartPrice = start,
                EndPrice = end,
                CreditDebit = env.DebitOrCredit(accountToFrom.From, pnL),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, pnL),
                FxRate = fxrate,
                Event = "realizedpnl",
                Fund = tradeAllocations[0].Fund,
            };

            var toJournal = new Journal(element, accountToFrom.To, "realizedpnl", env.ValueDate)
            {
                StartPrice = start,
                EndPrice = end,
                FxRate = fxrate,
                Fund = tradeAllocations[0].Fund,
                Account = accountToFrom.To,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, pnL * -1),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, pnL),
            };

            env.Journals.AddRange(new[] { fromJournal, toJournal });
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
                Fund = tradeAllocations[0].Fund,
                StartPrice = start,
                EndPrice = end,

                Account = accountToFrom.From,
                CreditDebit = env.DebitOrCredit(accountToFrom.From, unrealizedPnl),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, unrealizedPnl) * fxrate,
            };

            var toJournal = new Journal(fromJournal)
            {
                Account = accountToFrom.To,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, unrealizedPnl),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, unrealizedPnl) * fxrate,
            };

            env.Journals.AddRange(new[] { fromJournal, toJournal });
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
        private AccountToFrom GetFromToAccount(Transaction element, Transaction debit, Transaction credit)
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

            switch (element.Side.ToLowerInvariant())
            {
                case "buy":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("LONG POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, debit);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, credit);
                    break;
                case "sell":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("LONG POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, debit);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, credit);
                    break;
                case "short":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("SHORT POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, element);
                    break;
                case "cover":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("SHORT POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, element);
                    break;
            }

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

    }
}
