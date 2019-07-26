using ConsoleApp1;
using LP.Finance.Common.Models;
using PostingEngine.PostingRules;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace PostingEngine
{
    public class PostingEngineEnvironment
    {
        public DateTime ValueDate { get; set; }
        public AccountCategory[] Categories { get; internal set; }
        public List<AccountType> Types { get; internal set; }

        // Map of Product type to IPostingRule
        public Dictionary<string, IPostingRule> rules = new Dictionary<string, IPostingRule>
        {
            {"Common Stock", new CommonStock() },
            {"Journals", new FakeJournals() }
        };
    }

    class Posting
    {
        private readonly SqlConnection _connection;
        private readonly SqlTransaction _transaction;

        public Posting(SqlConnection connection, SqlTransaction transaction)
        {
            _connection = connection;
            _transaction = transaction;
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

        public void ProcessTradeEvent(PostingEngineEnvironment env, Transaction element)
        {
            var accountToFrom = GetFromToAccount(element);

            SaveAccountDetails(accountToFrom.From);
            SaveAccountDetails(accountToFrom.To);

            if (element.NetMoney != 0.0)
            {
                var debit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    Value = element.NetMoney * -1,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                debit.Save(_connection, _transaction);

                var credit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    Value = element.NetMoney,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };
                credit.Save(_connection, _transaction);
            }
        }

        public void ProcessSettlementEvent(PostingEngineEnvironment env, Transaction element)
        {
            var accountToFrom = GetFromToAccount(element);

            SaveAccountDetails(accountToFrom.From);
            SaveAccountDetails(accountToFrom.To);

            if (element.NetMoney != 0.0)
            {
                var debit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = env.ValueDate,
                    Value = element.NetMoney * -1,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                debit.Save(_connection, _transaction);

                var credit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.To,
                    When = env.ValueDate,
                    Value = element.NetMoney,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };
                credit.Save(_connection, _transaction);
            }
        }
        public void ProcessPnl(PostingEngineEnvironment env, Transaction element)
        {
        }

        public void ProcessLegacyJournalEvent(PostingEngineEnvironment env, Transaction element)
        {
            var accountToFrom = GetFromToAccount(element);

            SaveAccountDetails(accountToFrom.From);
            SaveAccountDetails(accountToFrom.To);

            var debit = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.From,
                When = env.ValueDate,
                Value = element.LocalNetNotional * -1,
                GeneratedBy = "system",
                Fund = element.Fund,
            };
            debit.Save(_connection, _transaction);

            var credit = new Journal
            {
                Source = element.LpOrderId,
                Account = accountToFrom.To,
                When = env.ValueDate,
                Value = element.LocalNetNotional,
                GeneratedBy = "system",
                Fund = element.Fund,
            };
            credit.Save(_connection, _transaction);
        }

        /// <summary>
        /// Based on the environment we need to determine what to do.
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element"></param>
        public void Process (PostingEngineEnvironment env, Transaction element)
        {
            // Find me the rule
            var rule = env.rules.Where(i => i.Key.Equals(element.SecurityType)).FirstOrDefault().Value;

            if ( env.ValueDate == element.TradeDate.Date)
            {
                if (rule != null) rule.TradeDateEvent(env, element);

                if (element.SecurityType.Equals("Journals"))
                {
                    ProcessLegacyJournalEvent(env, element);
                    return;
                }
                // Initial amount Cash and Asset
                ProcessTradeEvent(env, element);
            } else if ( env.ValueDate == element.SettleDate.Date)
            {
                if (element.SecurityType.Equals("Common Stock"))
                {
                    new CommonStock().SettlementDateEvent(env, element);
                }

                ProcessSettlementEvent(env, element);
                // We are settling so we need to do move from unrealized to realized
            } else if ( env.ValueDate > element.TradeDate.Date && env.ValueDate < element.SettleDate.Date)
            {
                ProcessPnl(env, element);
                // Determine change in the price and post a P&L
            } else
            {
                //Console.WriteLine($"Trade ignored {element.TradeDate}");
            }
        }

        private Journal[] GetJournals(Transaction element)
        {
            return new Journal[] { };
        }

        // Collect a list of accounts that are generated
        private static readonly Dictionary<string, Account> accounts = new Dictionary<string, Account>();

        private Account FindAccount( string accountName, Transaction element)
        {
            var accountType = AccountType.All.Where(i => i.Name.ToLowerInvariant().Equals(accountName.ToLowerInvariant())).FirstOrDefault();

            // Now we have the account type, so now need to create the account details
            var account = new Account { Type = accountType };

            return null;
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

            // Lets check to see if we have created this account already
            if ( accounts.ContainsKey(name))
            {
                Console.WriteLine($"Using an existing account {name}");

                return accounts[name];
            }

            var account = new Account {
                // Need to revisit this ASAP
                //Type = def.AccountCategory,
                Description = name, Name = name };

            account.Tags = tags;

            accounts.Add(name, account);

            return account;
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
