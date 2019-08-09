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
        public PostingEngineEnvironment(SqlConnection connection, SqlTransaction transaction)
        {
            Connection = connection;
            Transaction = transaction;

            Messages = new Dictionary<string, int>();
        }

        public DateTime ValueDate { get; set; }
        public DateTime RunDate { get; set; }
        public AccountCategory[] Categories { get; internal set; }
        public List<AccountType> Types { get; internal set; }

        public Transaction[] Allocations { get; internal set; }

        public Dictionary<string, FxRate> FxRates { get; set; }

        // Map of Product type to IPostingRule
        public Dictionary<string, IPostingRule> rules = new Dictionary<string, IPostingRule>
        {
            {"Common Stock", new CommonStock() },
            //{"Cash", new Cash() },
            //{"Journals", new FakeJournals() }
        };

        public SqlConnection Connection { get; private set; }
        public SqlTransaction Transaction { get; private set; }

        public void AddMessage(string message)
        {
            if ( Messages.ContainsKey(message))
            {
                Messages[message] = Messages[message] + 1;
            } else
            {
                Messages.Add(message, 1);
            }
        }
        public Dictionary<string, int> Messages { get; private set; }
    }

    class Posting
    {
        /// <summary>
        /// Based on the environment we need to determine what to do.
        /// </summary>
        /// <param name="env">The Posting Environment</param>
        /// <param name="element">The Trade to process</param>
        public void Process (PostingEngineEnvironment env, Transaction element)
        {
            // Find me the rule
            var rule = env.rules.Where(i => i.Key.Equals(element.SecurityType)).FirstOrDefault().Value;

            if ( rule == null )
            {
                env.AddMessage($"No rule associated with {element.SecurityType}");
                return;
            }

            if ( !element.TradeType.ToLower().Equals("trade"))
            {
                env.AddMessage($"Skipping Trade {element.TradeType}");
                return;
            }

            if ( env.ValueDate == element.TradeDate.Date)
            {
                try
                {
                    rule.TradeDateEvent(env, element);
                }
                catch (Exception ex)
                {
                    env.AddMessage($"Unable to process the Event for Trade Date {ex.Message}");
                }
            }
            else if ( env.ValueDate == element.SettleDate.Date)
            {
                try
                {
                    rule.SettlementDateEvent(env, element);
                }
                catch ( Exception ex )
                {
                    env.AddMessage($"Unable to process the Event for Settlement Date {ex.Message}");
                }
            }
            else if ( env.ValueDate > element.TradeDate.Date && env.ValueDate < element.SettleDate.Date)
            {
                try
                {
                    rule.DailyEvent(env, element);
                }
                catch (Exception ex)
                {
                    env.AddMessage($"Unable to process the Event for Daily Event {ex.Message}");
                }

            }
            else
            {
                //env.AddMessage($"Trade ignored ValueDate = {env.ValueDate}, TradeDate = {element.TradeDate.Date}, Settledate = {element.SettleDate.Date}");
            }
        }

        private Journal[] GetJournals(Transaction element)
        {
            return new Journal[] { };
        }


        private Account FindAccount( string accountName, Transaction element)
        {
            var accountType = AccountType.All.Where(i => i.Name.ToLowerInvariant().Equals(accountName.ToLowerInvariant())).FirstOrDefault();

            // Now we have the account type, so now need to create the account details
            var account = new Account { Type = accountType };

            return null;
        }
    }
}
