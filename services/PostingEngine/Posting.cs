using ConsoleApp1;
using LP.Finance.Common.Models;
using System;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace PostingEngine
{
    class Posting
    {
        private SqlConnection _connection;
        private SqlTransaction _transaction;

        public Posting(SqlConnection connection, SqlTransaction transaction)
        {
            this._connection = connection;
            this._transaction = transaction;
        }

        public void SaveAccountDetails(Account account)
        {
            account.SaveUpdate(_connection, _transaction);
            account.Id = account.Identity(_connection, _transaction);
            foreach (var tag in account.Tags)
            {
                tag.Account = account;
                //tag.Tag.Save(_connection, _transaction);
                tag.Save(_connection, _transaction);
            }
        }

        /// <summary>
        /// Process the transaction recieved, it will generate two offesting journal entries.
        /// </summary>
        /// <param name="element"></param>
        public void Process(Transaction element)
        {
            // For each row in the database determine the account Id associated with that Transaction, this is going to be based on some rules
            var existingJournals = GetJournals(element);

            if (existingJournals.Count() > 0)
            {
                // need to remove those entries

                // And recreate them
            }
            else
            {
                var accountToFrom = GetFromToAccount(element);

                SaveAccountDetails(accountToFrom.From);
                SaveAccountDetails(accountToFrom.To);

                var debit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = element.TradeDate,
                    Value = element.Commission * -1,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                debit.Save(_connection, _transaction);

                var credit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.To,
                    When = element.TradeDate,
                    Value = element.Commission,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                credit.Save(_connection, _transaction);

                // Now have two entries / credit / debit

                // Need to save both now
            }
        }

        private Journal[] GetJournals(Transaction element)
        {
            return new Journal[] { };
        }

        /// <summary>
        /// Create an account based on the Account Definition and the past Transaction 
        /// </summary>
        /// <param name="def">Account Template</param>
        /// <param name="transaction">Transaction</param>
        /// <returns>An account based on the definition</returns>
        private Account CreateAccount( AccountDef def, Transaction transaction)
        {
            var type = transaction.GetType();

            var tags = new System.Collections.Generic.List<AccountTag>();

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

            var assetAccount = new Account { Category = def.AccountCategory, Description = name, Name = name };

            assetAccount.Tags = tags;

            return assetAccount;
        }

        private AccountToFrom GetFromToAccount(Transaction element)
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
