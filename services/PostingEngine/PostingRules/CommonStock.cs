using LP.Finance.Common.Models;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.PostingRules
{
    public class CommonStock : IPostingRule
    {
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            var accountToFrom = GetFromToAccountOnSettlement(element);

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

                new Journal[] { debit, credit }.Save(env);
            }
        }

        private AccountToFrom GetFromToAccount(Transaction element)
        {
            var type = element.GetType();
            var accountTypes = AccountType.All;

            var listOfFromTags = new List<Tag> {
             };

            var listOfToTags = new List<Tag>
            {
            };

            var fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("LONG POSITIONS AT COST")).FirstOrDefault(), listOfFromTags, element);

            var toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfToTags, element);

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

            var fromAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfFromTags, element);

            var toAccount = new AccountUtils().CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Settled Activity )")).FirstOrDefault(), listOfToTags, element);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            var accountToFrom = GetFromToAccount(element);

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

                if ( element.Side.ToLower().Equals("buy"))
                {
                    var debit = new Journal
                    {
                        Source = element.LpOrderId,
                        Account = accountToFrom.From,
                        When = env.ValueDate,
                        Value = moneyUSD * -1,
                        FxCurrency = element.TradeCurrency,
                        FxRate = fxrate,
                        GeneratedBy = "system",
                        Fund = element.Fund,
                    };

                    var credit = new Journal
                    {
                        Source = element.LpOrderId,
                        Account = accountToFrom.To,
                        When = env.ValueDate,
                        FxCurrency = element.TradeCurrency,
                        FxRate = fxrate,
                        Value = moneyUSD,
                        GeneratedBy = "system",
                        Fund = element.Fund,
                    };

                    new Journal[] { debit, credit }.Save(env);
                }
                else if (element.Side.ToLower().Equals("sell"))
                {

                }
                else if (element.Side.ToLower().Equals("short"))
                {

                }
                else if (element.Side.ToLower().Equals("cover"))
                {
                }
            }
        }
    }
}
