using LP.Finance.Common.Models;
using PostingEngine.PostingRules.Utilities;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.PostingRules
{
    /// <summary>
    /// Keep track of all of the differing rules associate with the differing events in the system
    /// </summary>
    internal class AccountingRules
    {
        private static AccountType _settledCash;
        private static AccountType _pbUnsettledActivity;

        /// <summary>
        /// Dealing with the settlement event
        /// </summary>
        /// <param name="element"></param>
        /// <param name="debit"></param>
        /// <param name="credit"></param>
        /// <returns></returns>
        internal AccountToFrom GetFromToAccountOnSettlement(PostingEngineEnvironment env, Transaction element)
        {
            var accountTypes = AccountType.All;

            var listOfTags = new List<Tag>
            {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
            };

            if ( _settledCash == null )
            {
                _settledCash = accountTypes.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault();
                _pbUnsettledActivity = accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault();
            }

            Account fromAccount = null; // Debiting Account
            Account toAccount = null; // Crediting Account

            switch (element.Side.ToLowerInvariant())
            {
                case "buy":
                    fromAccount = new AccountUtils()
                        .CreateAccount(_pbUnsettledActivity, listOfTags, element);
                    toAccount = new AccountUtils()
                        .CreateAccount(_settledCash, listOfTags, element);
                    break;
                case "sell":
                    fromAccount = new AccountUtils()
                        .CreateAccount(_pbUnsettledActivity, listOfTags, element);
                    toAccount = new AccountUtils()
                        .CreateAccount(_settledCash, listOfTags, element);
                    break;
                case "short":
                    fromAccount = new AccountUtils()
                        .CreateAccount(_pbUnsettledActivity, listOfTags, element);
                    toAccount = new AccountUtils()
                        .CreateAccount(_settledCash, listOfTags, element);
                    break;
                case "cover":
                    fromAccount = new AccountUtils()
                        .CreateAccount(_pbUnsettledActivity, listOfTags, element);
                    toAccount = new AccountUtils()
                        .CreateAccount(_settledCash, listOfTags, element);
                    break;
            }

            new AccountUtils().SaveAccountDetails(env, fromAccount);
            new AccountUtils().SaveAccountDetails(env, toAccount);

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }
    }
}
