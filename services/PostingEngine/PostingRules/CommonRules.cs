﻿using LP.Finance.Common.Models;
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
                TradeDate = trade.TradeDate,
                InvestmentAtCost = investmentAtCost,
                BusinessDate = env.ValueDate,
                OpeningLotId = lot.Trade.LpOrderId,
                ClosingLotId = trade.LpOrderId,
                TradePrice = lot.Trade.SettleNetPrice,
                CostBasis = trade.SettleNetPrice,
                Quantity = quantity
            };
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

            //fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("CHANGE IN UNREALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfFromTags, element);
            fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("LONG POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);
            toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("REALIZED GAIN/(LOSS)")).FirstOrDefault(), listOfToTags, element);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        internal static void PostRealizedPnl(PostingEngineEnvironment env, Transaction element, double pnL, double start, double end, double fxrate = 1.0)
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
                Fund = fund,
            };

            var creditJournal = new Journal(element, accountToFrom.To, "realizedpnl", env.ValueDate)
            {
                StartPrice = start,
                EndPrice = end,
                FxRate = fxrate,
                CreditDebit = env.DebitOrCredit(accountToFrom.To, pnL * -1),
                Value = env.SignedValue(accountToFrom.From, accountToFrom.To, false, pnL),
                Fund = fund,
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

        internal static void PostUnRealizedPnl(PostingEngineEnvironment env, Transaction element, double unrealizedPnl, double start, double end, double fxrate)
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

            var prevPrice = MarketPrices.Find(env.PreviousValueDate, lot.Trade.Symbol).Price;
            var unrealizedPnl = taxlotStatus.Quantity * (element.SettleNetPrice - prevPrice) * multiplier;

            PostUnRealizedPnl(
                env,
                env.FindTrade(lot.Trade.LpOrderId),
                unrealizedPnl,
                MarketPrices.Find(env.PreviousValueDate, lot.Trade.BloombergCode).Price,
                element.SettleNetPrice, 1);

            var PnL = Math.Abs(taxlot.Quantity) * (taxlot.CostBasis - taxlot.TradePrice) * multiplier;
            PostRealizedPnl(
                env,
                element,
                PnL,
                taxlot.TradePrice,
                taxlot.CostBasis);

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
                Fund = fund,
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
                Fund = fund,
            };

            env.Journals.AddRange(new[] { fromJournal, toJournal });
        }
    }
}
