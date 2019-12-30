﻿using LP.Finance.Common.Models;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.PostingRules
{

    public class Cross : DefaultPostingRules, IPostingRule
    {
        public bool IsValid(PostingEngineEnvironment env, Transaction element)
        {
            return true;
        }

        public new void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            /*
             * Are there accruals for this trade, we grab them as needed
            */
            throw new NotImplementedException();
        }

        public new void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
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
            if (!element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            var moneyUSD = element.NetMoney * fxrate;

            if (element.NetMoney != 0.0)
            {
                var debit = new Journal
                {
                    Source = debitEntry.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    FxCurrency = element.SettleCurrency,
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.From, moneyUSD),
                    Value = moneyUSD,
                    Event = "settlementdate",
                    Fund = env.GetFund(element),
                };

                var credit = new Journal
                {
                    Source = creditEntry.LpOrderId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    FxCurrency = element.SettleCurrency,
                    FxRate = fxrate,
                    CreditDebit = env.DebitOrCredit(accountToFrom.To, moneyUSD* -1),
                    Value = moneyUSD * -1,
                    Fund = env.GetFund(element),
                };

                env.Journals.AddRange( new [] { debit, credit } );
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
                    break;
                case "short":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("SHORT POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);
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
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfToTags, credit);
                    break;
                case "sell":
                    break;
                case "short":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfToTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("SHORT POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);
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

        public new void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            // Retrieve Allocation Objects for this trade
            var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();

            var debitEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[0] : tradeAllocations[1];
            var creditEntry = tradeAllocations[0].Side == element.Side ? tradeAllocations[1] : tradeAllocations[0];

            var accountToFrom = GetFromToAccount(element, debitEntry, creditEntry);

            if (accountToFrom.To == null || accountToFrom.From == null)
            {
                env.AddMessage($"Unable to identify From/To accounts for trade {element.OrderSource} :: {element.Side}");
                return;
            }

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            double fxrate = 1.0;

            // Lets get fx rate if needed
            if ( !element.SettleCurrency.Equals(env.BaseCurrency))
            {
                fxrate = Convert.ToDouble(FxRates.Find(env.ValueDate, element.SettleCurrency).Rate);
            }

            if (element.NetMoney != 0.0)
            {
                var moneyUSD = (element.NetMoney * fxrate);
                var creditAmount = moneyUSD;
                var debitAmount = moneyUSD * -1;

                var debitJournal = new Journal
                {
                    Source = debitEntry.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    Value = debitAmount,
                    FxCurrency = element.SettleCurrency,
                    FxRate = fxrate,
                    Fund = debitEntry.Fund,
                };

                var creditJournal = new Journal
                {
                    Source = creditEntry.LpOrderId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    FxCurrency = element.SettleCurrency,
                    FxRate = fxrate,
                    Value = creditAmount,
                    Fund = creditEntry.Fund,
                };

                env.Journals.AddRange(new[] { debitJournal, creditJournal });
            }
        }
    }
}
