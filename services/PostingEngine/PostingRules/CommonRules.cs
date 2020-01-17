using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using PostingEngine.TaxLotMethods;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.PostingRules
{
    internal static class CommonRules
    {
        /// <summary>
        /// Relieves the passed Taxlot
        /// </summary>
        /// <param name="env">Environment</param>
        /// <param name="lot">The Tax Lot to relieve</param>
        /// <param name="trade">The current trade</param>
        /// <param name="quantity">Quantity to relieve</param>
        /// <param name="fxrate">Appropriate fxrate</param>
        internal static TaxLot RelieveTaxLot(PostingEngineEnvironment env, TaxLotDetail lot, Transaction trade, double quantity, bool reverse = false)
        {
            var prevFxRate = FxRates.Find(lot.Trade.TradeDate, lot.Trade.SettleCurrency).Rate;

            var investmentAtCost = quantity * lot.Trade.SettleNetPrice * prevFxRate;
            if (reverse)
                investmentAtCost = investmentAtCost * -1;

            var tl = new TaxLot
            {
                Trade = trade,
                TradeDate = trade.TradeDate,
                InvestmentAtCost = investmentAtCost, // Needs to be the Investment Cost that we are relieving from the Tax
                BusinessDate = env.ValueDate,
                OpeningLotId = lot.Trade.LpOrderId,
                ClosingLotId = trade.LpOrderId,
                TradePrice = lot.Trade.SettleNetPrice,
                CostBasis = trade.SettleNetPrice,
                Quantity = quantity
            };

            CalculateRealizedPnl(env, tl);

            tl.Save(env.Connection, env.Transaction);

            return tl;
        }

        public static int DetermineSign(Transaction trade)
        {
            if (trade.IsBuy())
            {
                return 1;
            }
            else if (trade.IsSell())
            {
                return 1;
            }
            else if (trade.IsShort())
            {
                return 1;
            }
            else if (trade.IsCover())
            {
                return -1;
            }

            return 1;
        }
        /// <summary>
        /// Calcualte the Unrealized Pnl for this Tax lot
        /// </summary>
        /// <param name="env"></param>
        /// <returns></returns>
        public static double CalculateUnrealizedPnl(PostingEngineEnvironment env, TaxLotStatus taxLot)
        {
            double multiplier = 1.0;

            if (env.SecurityDetails.ContainsKey(taxLot.Trade.BloombergCode))
                multiplier = env.SecurityDetails[taxLot.Trade.BloombergCode].Multiplier;

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!taxLot.Trade.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, taxLot.Trade.SettleCurrency).Rate);
            }

            var eodPrice = 0.0;
            var prevEodPrice = 0.0;

            if (env.ValueDate == taxLot.Trade.TradeDate)
            {
                eodPrice = MarketPrices.Find(env.ValueDate, taxLot.Trade).Price;
                prevEodPrice = taxLot.Trade.SettleNetPrice;
            }
            else
            {
                prevEodPrice = MarketPrices.Find(env.PreviousValueDate, taxLot.Trade).Price;
                eodPrice = MarketPrices.Find(env.ValueDate, taxLot.Trade).Price;
            }

            var quantity = taxLot.Quantity;
            var priceDiff = (eodPrice - prevEodPrice);

            var unrealizedPnl = priceDiff * quantity;

            return unrealizedPnl * fxrate * multiplier;
        }

        /// <summary>
        /// Calculate the Realized Pnl based on the relieved Tax Lot
        /// </summary>
        /// <param name="createdTaxLot">The Relief</param>
        /// <param name="taxLotToRelieve">The target taxlot</param>
        public static double CalculateRealizedPnl(PostingEngineEnvironment env, TaxLot createdTaxLot)
        {
            var priceDiff = (createdTaxLot.CostBasis - createdTaxLot.TradePrice);
            var realizedPnl = 0.0;

            double multiplier = 1.0;

            if (env.SecurityDetails.ContainsKey(createdTaxLot.Trade.BloombergCode))
                multiplier = env.SecurityDetails[createdTaxLot.Trade.BloombergCode].Multiplier;

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!createdTaxLot.Trade.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, createdTaxLot.Trade.SettleCurrency).Rate);
            }

            if (createdTaxLot.Trade.IsBuy())
            {
                realizedPnl = priceDiff * Math.Abs(createdTaxLot.Quantity);
            }
            else if (createdTaxLot.Trade.IsSell())
            {
                realizedPnl = priceDiff * Math.Abs(createdTaxLot.Quantity);
            }
            else if (createdTaxLot.Trade.IsShort())
            {
                realizedPnl = priceDiff * Math.Abs(createdTaxLot.Quantity);
            }
            else if (createdTaxLot.Trade.IsCover())
            {
                realizedPnl = priceDiff * Math.Abs(createdTaxLot.Quantity) * -1;
            }

            createdTaxLot.RealizedPnl = realizedPnl * fxrate * multiplier;

            return createdTaxLot.RealizedPnl;
        }

        /// <summary>
        /// Relieves the passed TaxLostStatus, this should only be used for FORWARDS etc that expire
        /// </summary>
        /// <param name="env">Environment</param>
        /// <param name="lot">The Tax Lot to relieve</param>
        /// <param name="trade">The current trade</param>
        /// <param name="quantity">Quantity to relieve</param>
        /// <param name="fxrate">Appropriate fxrate</param>
        internal static TaxLot RelieveTaxLot(PostingEngineEnvironment env, Transaction taxLotToRelieve, Transaction trade, double quantity, bool reverse = false)
        {
            var prevFxRate = FxRates.Find(taxLotToRelieve.TradeDate, taxLotToRelieve.SettleCurrency).Rate;

            var investmentAtCost = quantity * taxLotToRelieve.SettleNetPrice * prevFxRate;
            if (reverse)
                investmentAtCost = investmentAtCost * -1;

            var tl = new TaxLot
            {
                Trade = trade,
                TradeDate = trade.TradeDate,
                InvestmentAtCost = investmentAtCost, // Needs to be the Investment Cost that we are relieving from the Tax
                BusinessDate = env.ValueDate,
                OpeningLotId = taxLotToRelieve.LpOrderId,
                ClosingLotId = trade.LpOrderId,
                TradePrice = taxLotToRelieve.SettleNetPrice,
                CostBasis = trade.SettleNetPrice,
                Quantity = quantity
            };

            
            //CalculateRealizedPnl(env, tl, taxLotToRelieve);
            CalculateRealizedPnl(env, tl);

            tl.Save(env.Connection, env.Transaction);

            return tl;
        }

        private static AccountToFrom RealizedPnlPostingAccounts(Transaction element, double pnl)
        {
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

            if (element.IsDerivative())
            {
                var markToMarketAccount = "Mark to Market Derivatives Contracts at Fair Value (Liabilities)";
                if (pnl > 0)
                    markToMarketAccount = "Mark to Market Derivatives Contracts at Fair Value (Assets)";

                fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals(markToMarketAccount)).FirstOrDefault(), listOfFromTags, element);
                toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("REALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);

                return new AccountToFrom
                {
                    From = fromAccount,
                    To = toAccount
                };
            }
            else
            {
                var accountType = (element.IsShort() || element.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";

                fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals(accountType)).FirstOrDefault(), listOfFromTags, element);
                toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("REALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);

                return new AccountToFrom
                {
                    From = fromAccount,
                    To = toAccount
                };
            }
        }

        internal static void PostRealizedPnl(PostingEngineEnvironment env, Transaction element, double realizedPnl, string from, string to)
        {
            var listOfTags = new List<Tag> {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
            };

            var fromAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(from)).FirstOrDefault(), listOfTags, element);
            var toAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(to)).FirstOrDefault(), listOfTags, element);

            new AccountUtils().SaveAccountDetails(env, fromAccount);
            new AccountUtils().SaveAccountDetails(env, toAccount);

            var debitJournal = new Journal(element)
            {
                Account = fromAccount,
                When = env.ValueDate,
                StartPrice = 0,
                EndPrice = 0,
                CreditDebit = env.DebitOrCredit(fromAccount, realizedPnl),
                Value = env.SignedValue(fromAccount, toAccount, true, realizedPnl * -1),
                FxRate = element.TradePrice,
                Event = "realizedpnl",
                Fund = env.GetFund(element),
            };

            var creditJournal = new Journal(element, toAccount, "realizedpnl", env.ValueDate)
            {
                StartPrice = 0,
                EndPrice = 0,
                FxRate = element.TradePrice,
                CreditDebit = env.DebitOrCredit(toAccount, realizedPnl),
                Value = env.SignedValue(fromAccount, toAccount, true, realizedPnl),
                Fund = env.GetFund(element),
            };

            env.Journals.AddRange(new[] { debitJournal, creditJournal });

        }

        internal static void PostRealizedPnl(PostingEngineEnvironment env, Transaction element, double pnL, double start, double end, double fxrate = 1.0)
        {
            var accountToFrom = RealizedPnlPostingAccounts(element, pnL);

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            var debitJournal = new Journal(element)
            {
                Account = accountToFrom.From,
                When = env.ValueDate,
                StartPrice = start,
                EndPrice = end,
                CreditDebit = env.DebitOrCredit(accountToFrom.From, pnL),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, pnL),
                FxRate = fxrate,
                Event = "realizedpnl",
                Fund = env.GetFund(element),
            };

            var creditJournal = new Journal(element, accountToFrom.To, "realizedpnl", env.ValueDate)
            {
                StartPrice = start,
                EndPrice = end,
                FxRate = fxrate,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, pnL * -1),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, pnL),
                Fund = env.GetFund(element),
            };

            env.Journals.AddRange(new[] { debitJournal, creditJournal });
        }

        private static AccountToFrom UnRealizedPnlPostingAccounts(Transaction element, double pnl)
        {
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

            if ( element.IsDerivative())
            {
                var markToMarketAccount = "Mark to Market Derivatives Contracts at Fair Value (Liabilities)";
                if ( pnl > 0 )
                    markToMarketAccount = "Mark to Market Derivatives Contracts at Fair Value (Assets)";

                var fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals(markToMarketAccount)).FirstOrDefault(), listOfFromTags, element);
                var toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("Change in Unrealized Derivatives Contracts at Fair Value")).FirstOrDefault(), listOfToTags, element);
                return new AccountToFrom
                {
                    From = fromAccount,
                    To = toAccount
                };
            }
            else
            {
                var markToMarketAccount = element.IsShort() || element.IsCover() ? "Mark to Market Shorts" : "Mark to Market Longs";
                var fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals(markToMarketAccount)).FirstOrDefault(), listOfFromTags, element);
                var toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("CHANGE IN UNREALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);
                return new AccountToFrom
                {
                    From = fromAccount,
                    To = toAccount
                };
            }
        }

        internal static void PostUnRealizedPnl(PostingEngineEnvironment env, Transaction element, double unrealizedPnl, double start, double end, double fxrate)
        {
            var accountToFrom = UnRealizedPnlPostingAccounts(element, unrealizedPnl);

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
                Account = accountToFrom.To,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, unrealizedPnl),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, unrealizedPnl),
            };

            env.Journals.AddRange(new[] { fromJournal, toJournal });
        }

        internal static void GenerateCloseOutPostings(PostingEngineEnvironment env, TaxLotDetail lot, TaxLot taxlot, Transaction element, TaxLotStatus taxlotStatus,string fund)
        {
            double multiplier = 1.0;

            if (env.SecurityDetails.ContainsKey(element.BloombergCode))
                multiplier = env.SecurityDetails[element.BloombergCode].Multiplier;

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            var prevPrice = MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price;
            var unrealizedPnl = Math.Abs(taxlotStatus.Quantity) * (element.SettleNetPrice - prevPrice) * multiplier;
            unrealizedPnl = Math.Abs(unrealizedPnl) * CommonRules.DetermineSign(taxlotStatus.Trade);

            var buyTrade = env.FindTrade(lot.Trade.LpOrderId);

            PostUnRealizedPnl(
                env,
                buyTrade,
                unrealizedPnl,
                MarketPrices.Find(env.PreviousValueDate, lot.Trade).Price,
                element.SettleNetPrice, fxrate);

            var PnL = Math.Abs(taxlot.Quantity) * (taxlot.CostBasis - taxlot.TradePrice) * multiplier * fxrate;
            PnL = taxlot.RealizedPnl;

            PostRealizedPnl(
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

            Account fromAccount = null;
            Account toAccount = null;

            if ( element.IsDerivative())
            {
                var accountType = (buyTrade.IsShort() || buyTrade.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";
                var markToMarketAccount = (buyTrade.IsShort() || buyTrade.IsCover()) ? "Mark to Market Shorts" : "Mark to Market Longs";

                fromAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(accountType)).FirstOrDefault(), listOfFromTags, element);
                toAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(markToMarketAccount)).FirstOrDefault(), listOfFromTags, element);
            }
            else
            {
                var accountType = (buyTrade.IsShort() || buyTrade.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";
                var markToMarketAccount = (buyTrade.IsShort() || buyTrade.IsCover()) ? "Mark to Market Shorts" : "Mark to Market Longs";

                fromAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(accountType)).FirstOrDefault(), listOfFromTags, element);
                toAccount = new AccountUtils().CreateAccount(AccountType.All.Where(i => i.Name.Equals(markToMarketAccount)).FirstOrDefault(), listOfFromTags, element);
            }

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

            var toJournal = new Journal(fromJournal)
            {
                Account = toAccount,
                CreditDebit = env.DebitOrCredit(toAccount, PnL * -1),
                Value = PnL * -1,
            };

            env.Journals.AddRange(new[] { fromJournal, toJournal });
        }

        private static AccountToFrom GetFromToAccount(PostingEngineEnvironment env,  Transaction element)
        {
            var type = element.GetType();
            var accountTypes = AccountType.All;

            var listOfTags = new List<Tag> {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
             };

            var accountType = (element.IsShort() || element.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";

            var fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals(accountType)).FirstOrDefault(), listOfTags, element);
            var toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfTags, element);

            new AccountUtils().SaveAccountDetails(env, fromAccount);
            new AccountUtils().SaveAccountDetails(env, toAccount);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        internal static void GenerateTradeDateJournals(PostingEngineEnvironment env, Transaction element)
        {
            double multiplier = 1.0;

            if (env.SecurityDetails.ContainsKey(element.BloombergCode))
                multiplier = env.SecurityDetails[element.BloombergCode].Multiplier;

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            var tradeAllocations = env.Allocations.Where(i => i.LpOrderId == element.LpOrderId).ToList();

            // Retrieve Allocation Objects for this trade
            if (tradeAllocations.Count() > 2)
            {
                env.AddMessage($"#of allocations > 2 please investigate {element.LpOrderId}");
                return;
            }

            if (tradeAllocations.Count() == 2)
            {
                var debitEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[0] : tradeAllocations[1];
                if (debitEntry.Symbol.Equals("@CASHUSD"))
                {
                    env.AddMessage($"Unexpected Cash allocation please investigate {element.LpOrderId}");
                    return;
                }
            }

            var accountToFrom = GetFromToAccount(env, element);
            if (accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            if (element.NetMoney != 0.0)
            {
                var moneyUSD = Math.Abs(element.NetMoney) * fxrate;

                // BUY -- Debit
                // SELL -- Credit

                if (element.IsSell() || element.IsCover())
                    moneyUSD = moneyUSD * -1;

                var eodPrice = MarketPrices.Find(env.ValueDate, element).Price;

                var fromJournal = new Journal(element, accountToFrom.From, Event.TRADE_DATE, env.ValueDate)
                {
                    CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, true, moneyUSD),
                    FxRate = fxrate,
                    StartPrice = element.SettleNetPrice,
                    EndPrice = eodPrice,
                    Fund = env.GetFund(element),
                };

                var toJournal = new Journal(element, accountToFrom.To, Event.TRADE_DATE, env.ValueDate)
                {
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD * -1),
                    Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, moneyUSD),
                    StartPrice = element.SettleNetPrice,
                    EndPrice = eodPrice,
                    Fund = env.GetFund(element),
                };

                env.Journals.AddRange(new[] { fromJournal, toJournal });
            }
        }

        public static string GetFXMarkToMarketAccountType(Transaction element, string v)
        {
            var accounttype = v;

            switch (element.SecurityType)
            {
                case "FORWARD":
                case "Physical index future.":
                case "Equity Swap":
                    accounttype = "FX Mark to Market on Derivative Contracts";
                    break;
                default:
                    if (element.IsShort() || element.IsCover())
                    {
                        accounttype = "FX MARK TO MARKET ON STOCK COST (SHORTS)";
                    }
                    break;
            }

            return accounttype;
        }
        public static string GetChangeInUnrealizedDueToFx(Transaction element, string v)
        {
            var accounttype = v;

            switch (element.SecurityType)
            {
                case "FORWARD":
                case "Physical index future.":
                case "Equity Swap":
                    accounttype = "Change in Unrealized Derivatives Contracts due to FX Translation";
                    break;
            }

            return accounttype;
        }

        internal static void GenerateSettlementDateJournals(PostingEngineEnvironment env, Transaction element)
        {
            double fxrate = 1.0;

            // Lets get fx rate if needed
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            var accountToFrom = new AccountingRules().GetFromToAccountOnSettlement(env, element);

            if (accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            // This is the fully loaded value to tbe posting

            if (element.NetMoney != 0.0)
            {
                var moneyUSD = Math.Abs(element.NetMoney) * fxrate;

                // BUY -- Debit
                // SELL -- Credit

                if (element.IsShort() || element.IsSell())
                    moneyUSD = moneyUSD * -1;

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
                    Fund = env.GetFund(element)
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
                    Fund = env.GetFund(element)
                };

                env.Journals.AddRange(new[] { debit, credit });
            }

        }
    }
}
