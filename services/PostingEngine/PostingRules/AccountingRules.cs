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
        /// <summary>
        /// Dealing with the settlement event
        /// </summary>
        /// <param name="element"></param>
        /// <param name="debit"></param>
        /// <param name="credit"></param>
        /// <returns></returns>
        internal AccountToFrom GetFromToAccountOnSettlement(Transaction element, Transaction debit, Transaction credit)
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
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfToTags, debit);
                    break;
                case "sell":
                    fromAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfFromTags, debit);
                    toAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfToTags, debit);
                    break;
                case "short":
                    fromAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfFromTags, debit);
                    toAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfToTags, debit);
                    break;
                case "cover":
                    fromAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )")).FirstOrDefault(), listOfFromTags, debit);
                    toAccount = new AccountUtils()
                        .CreateAccount(accountTypes.Where(i => i.Name.Equals("Settled Cash")).FirstOrDefault(), listOfToTags, debit);
                    break;
            }

            return new AccountToFrom
            {
                From = fromAccount,
                To = toAccount
            };
        }
    }
}
