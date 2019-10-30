using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.PostingRules;
using PostingEngine.TaxLotMethods;
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
        public DateTime BusinessDate { get; set; }

        public DateTime RunDate { get; set; }
        public AccountCategory[] Categories { get; set; }
        public List<AccountType> Types { get; set; }

        public Transaction[] Allocations { get; set; }
        public Transaction[] Trades { get; set; }
        public Dictionary<string, Accrual> Accruals { get; set; }

        public Dictionary<string, TaxLotStatus> TaxLotStatus { get; private set; }

        internal TradeTaxRate TradeTaxRate(Transaction i)
        {
            var timeToLongTerm = (ValueDate - i.TradeDate).Days;
            var isShortTerm = timeToLongTerm <= (TaxRate != null ? TaxRate.ShortTermPeriod : 0);
            var daysToLongTerm = timeToLongTerm - (TaxRate != null ? TaxRate.ShortTermPeriod : 0) > 0 ? timeToLongTerm - (TaxRate != null ? TaxRate.ShortTermPeriod : 0) : 0;

            return new TradeTaxRate
            {
                IsShortTerm = isShortTerm,
                Rate = TaxRate != null ? (isShortTerm ? TaxRate.ShortTerm : TaxRate.LongTerm) : 0.0M,
                DaysToLongTerm = daysToLongTerm
            };
        }

        public bool IsValidAccrual(string accrualId)
        {
            return Accruals.ContainsKey(accrualId);
        }

        public List<Journal> Journals { get; set; }
        public TaxRate TaxRate { get; set; }

        public Dictionary<string, FxRate> FxRates { get; set; }
        public Dictionary<string, MarketPrice> PrevMarketPrices { get; set; }
        public Dictionary<string, MarketPrice> EODMarketPrices { get; set; }
        public Dictionary<string, CostBasisDto> CostBasis { get; set; }


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

        internal double CalculateCB(Transaction element, string symbol, string side)
        {
            if ( Journals.Count > 0)
            {
                if (side.Equals("buy"))
                {
                    var longPosition = Journals.Where(i => i.Account.Type.Name == "LONG POSITIONS AT COST" && i.Symbol.Equals(symbol));
                    if ( longPosition.Count() == 0 )
                        return element.TradePrice;
                    var cbValue = longPosition.Sum(i => i.Value);
                    var cbQuantity = longPosition.Sum(i => i.Quantity);
                    var cbCostBasis = element.TradePrice;
                    if (cbQuantity != 0)
                        cbCostBasis = cbValue / cbQuantity;

                    return Math.Abs(cbCostBasis);
                }
                else if (side.Equals("short"))
                {
                    var positions = Journals.Where(i => i.Account.Type.Name == "SHORT POSITIONS AT COST" && i.Symbol.Equals(symbol));
                    if (positions.Count() == 0)
                        return element.TradePrice;

                    var cbValue = positions.Sum(i => i.Value);
                    var cbQuantity = positions.Sum(i => i.Quantity);
                    var cbCostBasis = element.TradePrice;
                    if (cbQuantity != 0)
                        cbCostBasis = cbValue / cbQuantity;

                    return cbCostBasis;
                }
            }

            return 0;    
        }

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

        public ITaxLotMethodology Methodology { get; set; }

        /// <summary>
        /// Find the Transaction that matches this element.
        /// </summary>
        /// <param name="lpOrderId"></param>
        /// <returns></returns>
        internal Transaction FindTrade(string lpOrderId)
        {
            var trade = Trades.Where(i => i.LpOrderId.Equals(lpOrderId)).FirstOrDefault();
            return trade;
        }

        /// <summary>
        /// Determine the sign on the journal entries to reflect the following
        /// </summary>
        /// <param name="toAccount"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        /* Account      Increase    Decrease
         * Assets       Debit       Credit
         * Expences     Debit       Credit
         * Liabilities  Credit      Debit
         * Equity       Credit      Debit
         * Revenue      Credit      Debit
         */ 
        internal double DebitOrCredit(Account toAccount, double value)
        {
            return value;

            var retValue = 0.0;

            // Determine how to treat the value passed
            switch(toAccount.Type.Category.Id)
            {
                case AccountCategory.AC_ASSET:
                case AccountCategory.AC_EXPENCES:
                    if ( value > 0 )
                        retValue = value * -1;
                    else
                        retValue = value;
                    break;
                case AccountCategory.AC_EQUITY:
                case AccountCategory.AC_LIABILITY:
                case AccountCategory.AC_REVENUES:
                    retValue = value;
                    break;
                default:
                    retValue = value;
                    break;
            }

            return retValue;
        }


    }
}
