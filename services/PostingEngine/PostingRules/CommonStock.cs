﻿using LP.Finance.Common.Models;
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

        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            /*
             * Are there accruals for this trade, we grab them as needed
            */
            throw new NotImplementedException();
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            // Retrieve Allocation Objects for this trade
            var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();

            var debitEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[0] : tradeAllocations[1];
            var creditEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[1] : tradeAllocations[0];

            var accountToFrom = GetFromToAccountOnSettlement(element, debitEntry, creditEntry);

            if ( accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            // This is the fully loaded value to tbe posting
            //var netMoney = (element.Quantity * element.TradePrice) + element.Commission + element.Fees;

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
                    GeneratedBy = "system",
                    Fund = creditEntry.Fund,
                };

                env.Journals.AddRange( new [] { debit, credit } );

                //new Journal[] { debit, credit }.Save(env);
            }
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
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("SHORT POSITIONS-COST")).FirstOrDefault(), listOfFromTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, element);
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
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Settled Activity )")).FirstOrDefault(), listOfToTags, credit);
                    break;
                case "sell":
                    break;
                case "short":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Settled Activity )")).FirstOrDefault(), listOfToTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("SHORT POSITIONS-COST")).FirstOrDefault(), listOfFromTags, element);
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
            if ( element.Side.ToLowerInvariant().Equals("buy") || element.Side.ToLowerInvariant().Equals("cover"))
            {
                var tl = new TaxLotStatus {
                    BusinessDate = element.TradeDate,
                    Symbol = element.Symbol, OpenId = element.LpOrderId, Status = "OpenLot", Quantity = element.Quantity };
                env.TaxLots.Add(element.LpOrderId, tl);

                //tl.Save(env.Connection, env.Transaction);
            }
            else if (element.Side.ToLowerInvariant().Equals("sell") || element.Side.ToLowerInvariant().Equals("short"))
            {
                // Closing Lot
                var openLots = env.GetOpenLots(element);

                if ( openLots.Count == 0)
                {
                    // Whats going on here?
                    Console.WriteLine("Should for a sell have at least one open lot");
                }
                else
                {
                    var workingQuantity = Math.Abs(element.Quantity);

                    foreach( var lot in openLots)
                    {
                        if (workingQuantity == 0)
                            break;

                        if ( !env.TaxLots.ContainsKey(lot.LpOrderId))
                        {
                            // What when wrong here
                            continue;
                        }

                        var taxlotStatus = env.TaxLots[lot.LpOrderId];
                        if (taxlotStatus != null && taxlotStatus.Quantity > 0)
                        {
                            // Does the open Lot fully fullfill the quantity ?
                            if (taxlotStatus.Quantity >= workingQuantity)
                            {
                                new TaxLot { BusinessDate = env.ValueDate, OpeningLotId = lot.LpOrderId, ClosingLotId = element.LpOrderId, Quantity = workingQuantity };
                                taxlotStatus.Quantity -= workingQuantity;
                                if (taxlotStatus.Quantity == 0)
                                    taxlotStatus.Status = "Closed";
                                else
                                    taxlotStatus.Status = "Partially Closed";

                                break;
                            }
                            else
                            {
                                new TaxLot { BusinessDate = env.ValueDate, OpeningLotId = lot.LpOrderId, ClosingLotId = element.LpOrderId, Quantity = Math.Abs(taxlotStatus.Quantity) };
                                workingQuantity -= Math.Abs(taxlotStatus.Quantity);
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
            var tradeAllocations = env.Allocations.Where(i => i.LpOrderId == element.LpOrderId).ToList();

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

            if ( element.LpOrderId.ToLower().Equals("79e41950a1874755ba5c264c40505464"))
            {

            }
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
                    GeneratedBy = "system",
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
                    GeneratedBy = "system",
                    Fund = creditEntry.Fund,
                };

                env.Journals.AddRange(new[] { debitJournal, creditJournal });
            }
        }
    }
}
