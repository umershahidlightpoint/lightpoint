﻿using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.PostingRules
{
    public class CommonStock : PostingRule, IPostingRule
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
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            // Calculate the unrealized PNL
            if (env.TaxLotStatus.ContainsKey(element.LpOrderId))
            {
                var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();

                // Determine if we need to accumulate unrealized PNL
                var taxlot = env.TaxLotStatus[element.LpOrderId];
                if ( !taxlot.Status.ToLowerInvariant().Equals("closed"))
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
                        if (env.EODMarketPrices.ContainsKey(symbol))
                        {
                            eodPrice = env.EODMarketPrices[symbol].Price;
                        }

                        prevEodPrice = element.SettleNetPrice;
                    }
                    else
                    {
                        if (env.PrevMarketPrices.ContainsKey(symbol))
                            prevEodPrice = env.PrevMarketPrices[symbol].Price;

                        if (env.EODMarketPrices.ContainsKey(symbol))
                            eodPrice = env.EODMarketPrices[symbol].Price;
                    }

                    var fxRate = 1;

                    var unrealizedPnl = quantity * (eodPrice - prevEodPrice);

                    var fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("Mark to Market Longs")).FirstOrDefault(), listOfFromTags, element);

                    if ( taxlot.Side == "SHORT" )
                    {
                        fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("Mark to Market Shorts")).FirstOrDefault(), listOfFromTags, element);
                    }

                    var toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("CHANGE IN UNREALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);

                    new AccountUtils().SaveAccountDetails(env, fromAccount);
                    new AccountUtils().SaveAccountDetails(env, toAccount);

                    var fund = tradeAllocations[0].Fund;

                    var debit = new Journal
                    {
                        Source = element.LpOrderId,
                        Account = fromAccount,
                        When = env.ValueDate,
                        FxCurrency = element.SettleCurrency,
                        Symbol = symbol,
                        Quantity = quantity,
                        FxRate = fxRate,
                        Value = unrealizedPnl * -1,
                        StartPrice = prevEodPrice,
                        EndPrice = eodPrice,
                        GeneratedBy = "system",
                        Event = "unrealizedpnl",
                        Fund = fund,
                    };

                    var credit = new Journal
                    {
                        Source = element.LpOrderId,
                        Account = toAccount,
                        When = env.ValueDate,
                        FxCurrency = element.SettleCurrency,
                        FxRate = fxRate,
                        Symbol = symbol,
                        Quantity = quantity,
                        Value = unrealizedPnl,
                        Event = "unrealizedpnl",
                        StartPrice = prevEodPrice,
                        EndPrice = eodPrice,
                        GeneratedBy = "system",
                        Fund = fund,
                    };

                    env.Journals.AddRange(new[] { debit, credit });

                }
            }

        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            // Retrieve Allocation Objects for this trade
            var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();

            // Reversing the trade date activity
            var debitEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[1] : tradeAllocations[0];
            var creditEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[0] : tradeAllocations[1];

            var accountToFrom = GetFromToAccountOnSettlement(element, debitEntry, creditEntry);

            if ( accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            // This is the fully loaded value to tbe posting

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals("USD"))
            {
                fxrate = Convert.ToDouble(env.FxRates[element.SettleCurrency].Rate);
            }

            var moneyUSD = Math.Abs(element.NetMoney) / fxrate;

            if (element.NetMoney != 0.0)
            {
                var debit = new Journal
                {
                    Source = debitEntry.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    FxCurrency = element.SettleCurrency,
                    Symbol = debitEntry.Symbol,
                    Quantity = element.Quantity,
                    FxRate = fxrate,
                    Value = moneyUSD * -1,
                    GeneratedBy = "system",
                    Event = "settlement",
                    Fund = debitEntry.Fund,
                };

                var credit = new Journal
                {
                    Source = creditEntry.LpOrderId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    FxCurrency = element.SettleCurrency,
                    FxRate = fxrate,
                    Symbol = creditEntry.Symbol,
                    Quantity = element.Quantity,
                    Value = moneyUSD,
                    Event = "settlement",
                    GeneratedBy = "system",
                    Fund = creditEntry.Fund,
                };

                env.Journals.AddRange( new [] { debit, credit } );

                //new Journal[] { debit, credit }.Save(env);
            }
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

        /// <summary>
        /// Dealing with the settlement event
        /// </summary>
        /// <param name="element"></param>
        /// <param name="debit"></param>
        /// <param name="credit"></param>
        /// <returns></returns>
        private AccountToFrom GetFromToAccountOnSettlement(Transaction element, Transaction debit, Transaction credit)
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

            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account
            switch (element.Side.ToLowerInvariant())
            {
                case "buy":
                    fromAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfFromTags, debit);
                    toAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfToTags, debit);
                    break;
                case "sell":
                    break;
                case "short":
                    fromAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfFromTags, debit);
                    toAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfToTags, debit);
                    break;
                case "cover":
                    break;
            }


            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            var tradeAllocations = env.Allocations.Where(i => i.LpOrderId == element.LpOrderId).ToList();

            if ( element.IsBuy() || element.IsShort())
            {
                var tl = new TaxLotStatus {
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

                        if ( !env.TaxLotStatus.ContainsKey(lot.LpOrderId))
                        {
                            // TODO: For this open lot there should be a corresponding open to 
                            continue;
                        }

                        var taxlotStatus = env.TaxLotStatus[lot.LpOrderId];
                        if (taxlotStatus != null && taxlotStatus.Quantity != 0 && !taxlotStatus.Status.ToLowerInvariant().Equals("closed"))
                        {
                            // Does the open Lot fully fullfill the quantity ?
                            if (Math.Abs(taxlotStatus.Quantity) >= Math.Abs(workingQuantity))
                            {
                                var tl = new TaxLot {
                                    BusinessDate = env.ValueDate,
                                    OpeningLotId = lot.LpOrderId,
                                    ClosingLotId = element.LpOrderId,
                                    TradePrice = lot.SettleNetPrice, // Opening Trade Price
                                    CostBasis = element.SettleNetPrice, // Closing Trade Price
                                    Quantity = workingQuantity };
                                tl.Save(env.Connection, env.Transaction);

                                taxlotStatus.Quantity += workingQuantity;
                                if (taxlotStatus.Quantity == 0)
                                    taxlotStatus.Status = "Closed";
                                else
                                    taxlotStatus.Status = "Partially Closed";

                                var unrealizedPnl = taxlotStatus.Quantity * (element.SettleNetPrice - env.PrevMarketPrices[lot.Symbol].Price);
                                PostUnRealizedPnl(
                                    env, 
                                    env.FindTrade(lot.LpOrderId), 
                                    unrealizedPnl,
                                    env.PrevMarketPrices[lot.Symbol].Price,
                                    element.SettleNetPrice);

                                // This is realized Pnl, need to post this as a journal entry
                                var PnL = tl.Quantity * (tl.CostBasis - tl.TradePrice);
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
                                var debitJournal = new Journal
                                {
                                    Source = element.LpOrderId,
                                    Account = fromAccount,
                                    When = env.ValueDate,
                                    StartPrice = tl.TradePrice,
                                    EndPrice = tl.CostBasis,
                                    Value = PnL * -1,
                                    FxCurrency = element.TradeCurrency,
                                    Quantity = element.Quantity,
                                    Symbol = element.Symbol,
                                    FxRate = 1,
                                    GeneratedBy = "system",
                                    Event = "realizedpnl",
                                    Fund = tradeAllocations[0].Fund,
                                };

                                var creditJournal = new Journal
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
                                    Value = PnL,
                                    GeneratedBy = "system",
                                    Event = "realizedpnl",
                                    Fund = tradeAllocations[0].Fund,
                                };

                                env.Journals.AddRange(new[] { debitJournal, creditJournal });

                                break;
                            }
                            else
                            {
                                var tl = new TaxLot {
                                    BusinessDate = env.ValueDate,
                                    OpeningLotId = lot.LpOrderId,
                                    ClosingLotId = element.LpOrderId,
                                    TradePrice = lot.SettleNetPrice,
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

            // Retrieve Allocation Objects for this trade
            if ( tradeAllocations.Count() > 2)
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

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if ( !element.TradeCurrency.Equals("USD"))
            {
                fxrate = Convert.ToDouble(env.FxRates[element.TradeCurrency].Rate);
            }

            if (element.NetMoney != 0.0)
            {
                var moneyUSD = (Math.Abs(element.NetMoney) / fxrate);
                if ( element.Side.ToLowerInvariant().Equals("sell"))
                {
                    moneyUSD = moneyUSD * -1;
                }

                var eodPrice = env.EODMarketPrices[element.Symbol].Price;

                var debitJournal = new Journal
                {
                    Source = debitEntry.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    Value = moneyUSD * -1,
                    FxCurrency = element.TradeCurrency,
                    Quantity = element.Quantity,
                    Symbol = debitEntry.Symbol,
                    FxRate = fxrate,
                    Event = "tradedate",
                    GeneratedBy = "system",
                    StartPrice = element.SettleNetPrice,
                    EndPrice = eodPrice,
                    Fund = debitEntry.Fund,
                };

                var creditJournal = new Journal
                {
                    Source = creditEntry.LpOrderId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    FxCurrency = element.TradeCurrency,
                    Symbol = creditEntry.Symbol,
                    Quantity = element.Quantity,
                    FxRate = fxrate,
                    Value = moneyUSD,
                    Event = "tradedate",
                    GeneratedBy = "system",
                    StartPrice = element.SettleNetPrice,
                    EndPrice = eodPrice,
                    Fund = creditEntry.Fund,
                };

                env.Journals.AddRange(new[] { debitJournal, creditJournal });
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
                Value = pnL * -1,
                FxCurrency = element.TradeCurrency,
                Quantity = element.Quantity,
                Symbol = element.Symbol,
                FxRate = 1,
                GeneratedBy = "system",
                Event = "realizedpnl",
                Fund = tradeAllocations[0].Fund,
            };

            var creditJournal = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.To,
                When = env.ValueDate,
                FxCurrency = element.TradeCurrency,
                StartPrice = start,
                EndPrice = end,
                Symbol = element.Symbol,
                Quantity = element.Quantity,
                FxRate = 1,
                Value = pnL,
                GeneratedBy = "system",
                Event = "realizedpnl",
                Fund = tradeAllocations[0].Fund,
            };

            env.Journals.AddRange(new[] { debitJournal, creditJournal });
        }
        private void PostUnRealizedPnl(PostingEngineEnvironment env, Transaction element, double unrealizedPnl, double start, double end)
        {
            var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();
            if (tradeAllocations.Count == 0)
            {

            }
            var accountToFrom = UnRealizedPnlPostingAccounts(element);

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            var fund = tradeAllocations[0].Fund;

            var debitJournal = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.From,
                When = env.ValueDate,
                StartPrice = start,
                EndPrice = end,
                Value = unrealizedPnl * -1,
                FxCurrency = element.TradeCurrency,
                Quantity = element.Quantity,
                Symbol = element.Symbol,
                FxRate = 1,
                GeneratedBy = "system",
                Event = "unrealizedpnl",
                Fund = tradeAllocations[0].Fund,
            };

            var creditJournal = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.To,
                When = env.ValueDate,
                FxCurrency = element.TradeCurrency,
                StartPrice = start,
                EndPrice = end,
                Symbol = element.Symbol,
                Quantity = element.Quantity,
                FxRate = 1,
                Value = unrealizedPnl,
                GeneratedBy = "system",
                Event = "unrealizedpnl",
                Fund = tradeAllocations[0].Fund,
            };

            env.Journals.AddRange(new[] { debitJournal, creditJournal });
        }
    }
}
