using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace PostingEngine.PostingRules.Utilities
{
    class AccountUtils
    {
        public Account GetAccount(PostingEngineEnvironment env, string accountType, List<string> tags)
        {
            var account = CreateAccount(AccountType.Find(accountType), tags);
            SaveAccountDetails(env, account);

            return account;
        }

        public AccountToFrom GetAccounts(PostingEngineEnvironment env, string fromType, string toType, List<Tag> tags, Transaction element)
        {
            var fromAccount = CreateAccount(AccountType.Find(fromType), tags, element);
            var toAccount = CreateAccount(AccountType.Find(toType), tags, element);

            SaveAccountDetails(env, fromAccount);
            SaveAccountDetails(env, toAccount);

            return new AccountToFrom { From = fromAccount, To = toAccount };
        }

        public AccountToFrom GetAccounts(PostingEngineEnvironment env, string fromType, string toType, List<string> tags)
        {
            var fromAccount = CreateAccount(AccountType.Find(fromType), tags);
            var toAccount = CreateAccount(AccountType.Find(toType), tags);

            SaveAccountDetails(env, fromAccount);
            SaveAccountDetails(env, toAccount);

            return new AccountToFrom { From = fromAccount, To = toAccount };
        }

        // Collect a list of accounts that are generated
        private static readonly Dictionary<string, Account> accounts = new Dictionary<string, Account>();
        public static void LoadAll()
        {

        }
        private static SqlConnection _connection;
        
        public void SaveAccountDetails(PostingEngineEnvironment env, Account account)
        {
            if (!account.Exists)
            {
                if ( _connection == null )
                {
                    _connection = new SqlConnection(env.ConnectionString);
                    _connection.Open();
                }

                var transaction = _connection.BeginTransaction();

                account.SaveUpdate(_connection, transaction);
                account.Id = account.Identity(_connection, transaction);
                foreach (var tag in account.Tags)
                {
                    tag.Account = account;
                    //tag.Tag.Save(_connection, _transaction);
                    tag.Save(_connection, transaction);
                }
                account.Exists = true;

                transaction.Commit();
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

        internal Account DeriveMTMCorrectAccount(Account from, Transaction element, List<Tag> tags, double unrealizedPnl)
        {
            Account account = from;

            var accountCategoryId = unrealizedPnl > 0 ? AccountCategory.AC_ASSET : AccountCategory.AC_LIABILITY;

            switch (element.SecurityType)
            {
                case "CROSS":
                case "FORWARD":
                case "Physical index future.":
                case "Equity Swap":
                    account = CreateAccount(AccountType.Find(accountCategoryId, "Derivative contracts, at fair value"), tags, element);
                    break;
            }

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
            var description = $"{string.Join("-", accountTags.Select(t => t.TagValue))}";
            
            // Lets check to see if we have created this account already
            if (accounts.ContainsKey(name))
            {
                return accounts[name];
            }

            var existingAccount = Account.All.Where(a => a.Name.Equals(name) && a.Type.Id == accountType.Id).FirstOrDefault();
            if (existingAccount != null)
            {
                return existingAccount;
            }


            var account = new Account
            {
                // Need to revisit this ASAP
                //Type = def.AccountCategory,
                Description = description,
                Name = name,
                Type = accountType,
                Tags = accountTags
            };

            accounts.Add(name, account);

            return account;
        }

        public Account CreateAccount(AccountType accountType, string name, Transaction transaction)
        {
            var accountName = $"{name}";


            // Lets check to see if we have created this account already
            if (accounts.ContainsKey(accountName))
            {
                return accounts[accountName];
            }

            var existingAccount = Account.All.Where(a => a.Name.Equals(accountName) && a.Type.Id == accountType.Id).FirstOrDefault();
            if ( existingAccount != null )
            {
                return existingAccount;
            }

            var account = new Account
            {
                // Need to revisit this ASAP
                //Type = def.AccountCategory,
                Description = accountName,
                Name = accountName,
                Type = accountType,
                Tags = new List<AccountTag>()
            };

            accounts.Add(accountName, account);

            return account;
        }

        public Account CreateAccount(AccountType accountType, List<string> tags)
        {
            var accountName = $"{accountType.Name} -- {string.Join("-", tags)}";
            var description = $"{string.Join("-", tags)}";

            // Lets check to see if we have created this account already
            if (accounts.ContainsKey(accountName))
            {
                return accounts[accountName];
            }

            var existingAccount = Account.All.Where(a => a.Name.Equals(accountName) && a.Type.Id == accountType.Id).FirstOrDefault();
            if (existingAccount != null)
            {
                return existingAccount;
            }

            var account = new Account
            {
                // Need to revisit this ASAP
                //Type = def.AccountCategory,
                Name = accountName,
                Description = description,
                Type = accountType,
                Tags = new List<AccountTag>()
            };

            accounts.Add(accountName, account);

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
