using LP.Finance.Common.Models;
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
            var accountToFrom = GetFromToAccountOnSettlement(element);
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

            var moneyUSD = element.NetMoney / fxrate;

            if (element.NetMoney != 0.0)
            {
                var debit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    FxCurrency = element.SettleCurrency,
                    FxRate = fxrate,
                    Value = moneyUSD * -1,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                var credit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    FxCurrency = element.SettleCurrency,
                    FxRate = fxrate,
                    Value = moneyUSD,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                env.Journals.AddRange( new [] { debit, credit } );

                //new Journal[] { debit, credit }.Save(env);
            }
        }

        private AccountToFrom GetFromToAccount(Transaction element)
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
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("LONG POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, element);
                    break;
                case "sell":
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

        private AccountToFrom GetFromToAccountOnSettlement(Transaction element)
        {
            var type = element.GetType();
            var accountTypes = AccountType.All;

            var listOfFromTags = new List<Tag>
            {
                //Tag.Find("CustodianCode"),
            };

            var listOfToTags = new List<Tag> {
                //Tag.Find("CustodianCode"),
             };

            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account
            switch (element.Side.ToLowerInvariant())
            {
                case "buy":
                    fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfFromTags, element);
                    toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Settled Activity )")).FirstOrDefault(), listOfToTags, element);
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
            // Retrieve Allocation Objects for this trade
            var tradeAllocations = env.Allocations.Where(i => i.ParentOrderId == element.ParentOrderId).ToList();

            var accountToFrom = GetFromToAccount(element);

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
                var moneyUSD = (element.NetMoney / fxrate);
                var creditAmount = moneyUSD;
                var debitAmount = moneyUSD * -1;

                var debitJournal = new Journal
                {
                    Source = tradeAllocations[0].TradeId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    Value = debitAmount,
                    FxCurrency = element.TradeCurrency,
                    FxRate = fxrate,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                var creditJournal = new Journal
                {
                    Source = tradeAllocations[1].TradeId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    FxCurrency = element.TradeCurrency,
                    FxRate = fxrate,
                    Value = creditAmount,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                env.Journals.AddRange(new[] { debitJournal, creditJournal });

                //new SQLBulkHelper().Insert("journal", new[] { debitJournal, creditJournal }, env.Connection);


                //new Journal[] { debitJournal, creditJournal }.Save(env);
            }
        }
    }
}
