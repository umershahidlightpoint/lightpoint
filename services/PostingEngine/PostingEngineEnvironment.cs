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
            TaxLotStatus = new Dictionary<string, TaxLotStatus>();
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

        public Dictionary<string, TaxLotStatus> TaxLotStatus { get; private set; }
        public bool IsValidAccrual(string accrualId)
        {
            return Accruals.ContainsKey(accrualId);
        }

        public List<Journal> Journals { get; set; }
        public Dictionary<string, FxRate> FxRates { get; set; }
        public Dictionary<string, MarketPrice> PrevMarketPrices { get; set; }
        public Dictionary<string, MarketPrice> EODMarketPrices { get; set; }

        // Map of Product type to IPostingRule, now we can run each of these in parellel, once we have the data
        // which is readonly we can spin up a number of Tasks, each responsible for processing the right product
        // type, keep the commits to the database towards the end
        public Dictionary<string, IPostingRule> rules = new Dictionary<string, IPostingRule>
        {
            {"Common Stock", new CommonStock() },
            {"Journals", new FakeJournals() },
            //{"Cross", new Cross() },
            {"Cash", new Cash() },
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
                && (i.Side.ToLowerInvariant().Equals("buy") || i.Side.ToLowerInvariant().Equals("short"))
                )
                .OrderBy(i=>i.TradeDate)
                .ToList();

            return openLots;
        }
    }
}
