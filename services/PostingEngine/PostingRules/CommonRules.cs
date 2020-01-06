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

            var unrealizedPnl = 0.0;
            var quantity = Math.Abs(taxLot.Trade.Quantity);
            var priceDiff = (eodPrice - prevEodPrice);

            if (taxLot.Trade.IsBuy())
            {
                unrealizedPnl = priceDiff * quantity;
            }
            else if (taxLot.Trade.IsSell())
            {
                unrealizedPnl = priceDiff * quantity * -1;
            }
            else if (taxLot.Trade.IsShort())
            {
                unrealizedPnl = priceDiff * quantity;
            }
            else if (taxLot.Trade.IsCover())
            {
                unrealizedPnl = priceDiff * quantity * -1;
            }

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

            if (realizedPnl != 0.0)
            {
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

        private static AccountToFrom RealizedPnlPostingAccounts(Transaction element)
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

            var accountType = (element.IsShort() || element.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";

            //fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("CHANGE IN UNREALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfFromTags, element);
            fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals(accountType)).FirstOrDefault(), listOfFromTags, element);
            toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("REALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        internal static void PostRealizedPnl(PostingEngineEnvironment env, Transaction element, double pnL, double start, double end, double fxrate = 1.0)
        {
            var accountToFrom = RealizedPnlPostingAccounts(element);

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            if (element.IsSell() || element.IsCover())
            {
                pnL = pnL * -1;
            }

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

        private static AccountToFrom UnRealizedPnlPostingAccounts(Transaction element)
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

        internal static void PostUnRealizedPnl(PostingEngineEnvironment env, Transaction element, double unrealizedPnl, double start, double end, double fxrate)
        {
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

            var markToMarketAccount = (buyTrade.IsShort() || buyTrade.IsCover()) ? "Mark to Market Shorts" : "Mark to Market Longs";
            var accountType = (buyTrade.IsShort() || buyTrade.IsCover()) ? "SHORT POSITIONS AT COST" : "LONG POSITIONS AT COST";

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
        }
    }
}
