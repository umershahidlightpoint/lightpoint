using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.PostingRules.Utilities
{
    class AccountUtils
    {
        // Collect a list of accounts that are generated
        private static readonly Dictionary<string, Account> accounts = new Dictionary<string, Account>();

        public void SaveAccountDetails(PostingEngineEnvironment env, Account account)
        {
            account.SaveUpdate(env.Connection, env.Transaction);
            account.Id = account.Identity(env.Connection, env.Transaction);
            foreach (var tag in account.Tags)
            {
                tag.Account = account;
                //tag.Tag.Save(_connection, _transaction);
                tag.Save(env.Connection, env.Transaction);
            }
        }

        /// <summary>
        /// Create an account based on the Account Definition and the past Transaction 
        /// </summary>
        /// <param name="def">Account Template</param>
        /// <param name="transaction">Transaction</param>
        /// <returns>An account based on the definition</returns>
        public Account CreateAccount(AccountDef def, Transaction transaction)
        {
            var type = transaction.GetType();

            var tags = new List<AccountTag>();

            // Create a tag to identify the account
            foreach (var tag in def.Tags)
            {
                var property = type.GetProperty(tag.PropertyName);
                var value = property.GetValue(transaction);
                if (value != null)
                {
                    tags.Add(new AccountTag { Tag = tag, TagValue = value.ToString() });
                }
            }

            var name = String.Join("-", tags.Select(t => t.TagValue));

            // Lets check to see if we have created this account already
            if (accounts.ContainsKey(name))
            {
                Console.WriteLine($"Using an existing account {name}");

                return accounts[name];
            }

            var account = new Account
            {
                // Need to revisit this ASAP
                //Type = def.AccountCategory,
                Description = name,
                Name = name
            };

            account.Tags = tags;

            accounts.Add(name, account);

            return account;
        }

        /// <summary>
        /// Drive the creation of the account based on the AccountType passed in
        /// </summary>
        /// <param name="accountType">Account Type (Category is embedded)</param>
        /// <param name="tags">Set of Tags to be assigned to this Account, driven by the caller of CreateAccount</param>
        /// <param name="transaction">Transaction we are creating the account for</param>
        /// <returns></returns>
        public Account CreateAccount(AccountType accountType, List<Tag> tags, Transaction transaction)
        {
            var type = transaction.GetType();

            var accountTags = new List<AccountTag>();

            // Create a tag to identify the account
            foreach (var tag in tags)
            {
                if (tag != null)
                {
                    var property = type.GetProperty(tag.PropertyName);
                    var value = property.GetValue(transaction);
                    if (value != null)
                    {
                        accountTags.Add(new AccountTag { Tag = tag, TagValue = value.ToString() });
                    }
                }
            }

            var name = $"{accountType.Name} -- {string.Join("-", accountTags.Select(t => t.TagValue))}";
            

            // Lets check to see if we have created this account already
            if (accounts.ContainsKey(name))
            {
                Console.WriteLine($"Using an existing account {name}");

                return accounts[name];
            }

            var account = new Account
            {
                // Need to revisit this ASAP
                //Type = def.AccountCategory,
                Description = name,
                Name = name,
                Type = accountType,
                Tags = accountTags
            };

            accounts.Add(name, account);

            return account;
        }

        public AccountToFrom GetFromToAccount(Transaction element)
        {
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
        }
    }
}
