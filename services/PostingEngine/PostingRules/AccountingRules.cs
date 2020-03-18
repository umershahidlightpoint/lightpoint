using System.Collections.Generic;
using System.Linq;
using LP.Finance.Common.Model;
using PostingEngine.Utilities;

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

            var fromAccount = new AccountUtils().CreateAccount(_pbUnsettledActivity, listOfTags, element);
            var toAccount = new AccountUtils().CreateAccount(_settledCash, listOfTags, element);

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
