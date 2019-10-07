using LP.Finance.Common.Models;
using PostingEngine.PostingRules;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace PostingEngine
{
    public class PostingEngineEnvironment
    {
        public PostingEngineEnvironment(SqlConnection connection, SqlTransaction transaction)
        {
            Connection = connection;
            Transaction = transaction;

            Messages = new Dictionary<string, int>();

            Journals = new List<Journal>();
            TaxLots = new Dictionary<string, TaxLotStatus>();
        }

        public string BaseCurrency { get; set; }
        public string RunId { get; internal set; }
        public string Period { get; set; }
        public DateTime ValueDate { get; set; }
        public DateTime RunDate { get; set; }
        public AccountCategory[] Categories { get; set; }
        public List<AccountType> Types { get; set; }

        public Transaction[] Allocations { get; set; }
        public Transaction[] Trades { get; set; }
        public Dictionary<string, Accrual> Accruals { get; set; }

        public Dictionary<string, TaxLotStatus> TaxLots { get; private set; }
        public bool IsValidAccrual(string accrualId)
        {
            return Accruals.ContainsKey(accrualId);
        }

        public List<Journal> Journals { get; set; }
        public Dictionary<string, FxRate> FxRates { get; set; }

        // Map of Product type to IPostingRule
        public Dictionary<string, IPostingRule> rules = new Dictionary<string, IPostingRule>
        {
            {"Common Stock", new CommonStock() },
            //{"Cross", new Cross() },
            // {"Cash", new Cash() },
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

        /// <summary>
        /// Get a list of the open tax lots for the passed trade
        /// </summary>
        /// <param name="element">Closing Tax Lot</param>
        /// <returns>List of matched open Lots</returns>
        internal List<Transaction> GetOpenLots(Transaction element)
        {
            var openLots = this.Trades.Where(i => 
                i.TradeDate.Date <= element.TradeDate.Date 
                && i.Symbol == element.Symbol
                && i.LpOrderId != element.LpOrderId
                && (i.Side.ToLowerInvariant().Equals("buy") || i.Side.ToLowerInvariant().Equals("cover"))
                )
                .OrderBy(i=>i.TradeDate)
                .ToList();

            return openLots;
        }
    }
}
