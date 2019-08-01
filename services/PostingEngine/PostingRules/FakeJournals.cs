using LP.Finance.Common.Models;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Linq;

namespace PostingEngine.PostingRules
{
    public class FakeJournals : IPostingRule
    {
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }

        private AccountToFrom GetFromToAccount(Transaction element)
        {
            return null;

            /*
            var type = element.GetType();
            var accountDefs = AccountDef.Defaults;

            var assetAccount = CreateAccount(accountDefs.Where(i => i.AccountCategory == AccountCategory.AC_ASSET).First(), element);

            if (element.SecurityType.Equals("Journals"))
            {
                var expencesAccount = CreateAccount(accountDefs.Where(i => i.AccountCategory == AccountCategory.AC_EXPENCES).First(), element);

                // The symbol will determine how to generate the Journal entry for these elements.
                switch (element.Symbol.ToUpper())
                {
                    case "ZZ_ACCOUNTING_FEES":
                        break;
                    case "ZZ_ADMINISTRATIVE_FEES":
                        break;
                    case "ZZ_BANK_SERVICE_FEES":
                        break;
                    case "ZZ_INVESTOR_CONTRIBUTIONS":
                        break;
                    case "ZZ_CUSTODY_FEES":
                        break;
                    default:
                        break;
                }

                return new AccountToFrom
                {
                    From = assetAccount,
                    To = expencesAccount
                };
            }

            var liabilitiesAccount = CreateAccount(accountDefs.Where(i => i.AccountCategory == AccountCategory.AC_LIABILITY).First(), element);

            return new AccountToFrom
            {
                From = assetAccount,
                To = liabilitiesAccount
            };
            */
        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            var accountToFrom = GetFromToAccount(element);

            new AccountUtils().SaveAccountDetails(env, accountToFrom.From);
            new AccountUtils().SaveAccountDetails(env, accountToFrom.To);

            var debit = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.From,
                When = env.ValueDate,
                Value = element.LocalNetNotional * -1,
                GeneratedBy = "system",
                Fund = element.Fund,
            };

            var credit = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.To,
                When = env.ValueDate,
                Value = element.LocalNetNotional,
                GeneratedBy = "system",
                Fund = element.Fund,
            };

            new Journal[] { debit, credit }.Save(env);
        }
    }
}
