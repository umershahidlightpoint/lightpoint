using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
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
        public bool Completed { get; set; }
        public PostingEngineEnvironment(SqlConnection connection, SqlTransaction transaction = null)
        {
            Connection = connection;
            Transaction = transaction;

            Messages = new Dictionary<string, int>();

            Journals = new List<Journal>();
            TaxLotStatus = new Dictionary<string, TaxLotStatus>();
        }

        public string ConnectionString { get; set; }

        public PostingEngineCallBack CallBack { get; set; }

        public string BaseCurrency { get; set; }
        public string RunId { get; internal set; }
        public string Period { get; set; }
        public DateTime ValueDate { get; set; }
        public DateTime PreviousValueDate { get; set; }
        public DateTime BusinessDate { get; set; }

        public bool SkipWeekends { get; set; }

        public DateTime RunDate { get; set; }
        public AccountCategory[] Categories { get; set; }
        public List<AccountType> Types { get; set; }

        public Transaction[] Allocations { get; set; }
        public Transaction[] Trades { get; set; }
        public Dictionary<string, Accrual> Accruals { get; set; }

        public Dictionary<string, TaxLotStatus> TaxLotStatus { get; private set; }

        internal TradeTaxRate TradeTaxRate(Transaction i)
        {
            var daysToValueDate = (ValueDate - i.TradeDate).Days;
            var isShortTerm = daysToValueDate <= (TaxRate != null ? TaxRate.ShortTermPeriod : 0);

            var shortTermPeriod = (TaxRate != null ? TaxRate.ShortTermPeriod : 0);

            var daysToLongTerm = (shortTermPeriod - daysToValueDate) > 0 ? (shortTermPeriod - daysToValueDate) : 0;

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

        // Rates are all multiplied, and we store that rate in the system
        //public Dictionary<string, MarketPrice> PrevMarketPrices { get; set; }
        //public Dictionary<string, MarketPrice> EODMarketPrices { get; set; }
        public Dictionary<string, CostBasisDto> CostBasis { get; set; }

        public Dictionary<string, IPostingRule> Rules { get; set; }

        // Map of Product type to IPostingRule, now we can run each of these in parellel, once we have the data
        // which is readonly we can spin up a number of Tasks, each responsible for processing the right product
        // type, keep the commits to the database towards the end
        public readonly Dictionary<string, IPostingRule> TradingRules = new Dictionary<string, IPostingRule>
        {
            // Common
            {"REIT", new CommonStock() },
            {"ADR", new CommonStock() },
            {"Bond", new CommonStock() },
            {"Common Stock", new CommonStock() },
            {"Open-End Fund", new CommonStock() },
            {"Unit", new CommonStock() },

            // Equity Option
            {"Equity Option", new EquityOption() },

            // Cash
            {"Cash", new CashRule() },

            // Forward Rule
            {"FORWARD", new ForwardRule() },
            {"CROSS", new ForwardRule() },

            // Default Rule
            {"Physical index future.", new DefaultRule() },
            {"Equity Swap", new DefaultRule() },
        };

        public readonly Dictionary<string, IPostingRule> JournalRules = new Dictionary<string, IPostingRule>
        {
            {"Journals", new FakeJournals() },
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
        public Dictionary<string, SecurityDetail> SecurityDetails { get; internal set; }

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

        internal List<Accrual> FindAccruals(string lpAccrualId)
        {
            var list = Accruals.Values.Where(i =>i.AccrualId != null).Where(i => i.AccrualId.Equals(lpAccrualId)).ToList();
            return list;
        }

        internal List<Transaction> FindAllocations(string lpAccrualId)
        {
            var list = Allocations.Where(i => i.AccrualId != null).Where(i => i.AccrualId.Equals(lpAccrualId)).ToList();
            return list;
        }

        internal string GetFund(Transaction trade)
        {
            // Where(i => i.ParentOrderId == element.ParentOrderId).ToList();

            var tradeAllocations = Allocations.Where(i => i.LpOrderId == trade.LpOrderId).ToList();
            if ( tradeAllocations.Count() > 0 )
            {
                return tradeAllocations[0].Fund;
            }

            return "Unknown";
        }

        /// <summary>
        /// Determine how to set the Value of the Journal, this will be based on the 
        /// </summary>
        /// <param name="debitAccount">The account from where the flow will start</param>
        /// <param name="creditAccount">The account to where the flow will end</param>
        /// <param name="debit">Is this from the perspective of the debit account</param>
        /// <param name="value">The value to be posted</param>
        /// <returns>The correct signed value</returns>
        internal double SignedValue(Account debitAccount, Account creditAccount, bool debit, double value)
        {
            if (debit)
                return value;

            if (debitAccount.Type.Category.Id == creditAccount.Type.Category.Id)
            {
                return value * -1;
            }

            if (debitAccount.Type.Category.Id == AccountCategory.AC_ASSET && creditAccount.Type.Category.Id == AccountCategory.AC_LIABILITY)
                return value;

            if (debitAccount.Type.Category.Id == AccountCategory.AC_ASSET && creditAccount.Type.Category.Id == AccountCategory.AC_ASSET)
                return value * -1;

            if (debitAccount.Type.Category.Id == AccountCategory.AC_LIABILITY && creditAccount.Type.Category.Id == AccountCategory.AC_ASSET)
                return value;

            if (debitAccount.Type.Category.Id == AccountCategory.AC_LIABILITY && creditAccount.Type.Category.Id == AccountCategory.AC_REVENUES)
                return value * -1;

            if (debitAccount.Type.Category.Id == AccountCategory.AC_REVENUES && creditAccount.Type.Category.Id == AccountCategory.AC_LIABILITY)
                return value * -1;

            if (debitAccount.Type.Category.Id == AccountCategory.AC_ASSET && creditAccount.Type.Category.Id == AccountCategory.AC_REVENUES)
                return value;

            if (debitAccount.Type.Category.Id == AccountCategory.AC_REVENUES && creditAccount.Type.Category.Id == AccountCategory.AC_ASSET)
                return value;

            return value;
        }

        /// <summary>
        /// return if the value indicates a credit or a debit 
        /// </summary>
        /// <param name="account"></param>
        /// <param name="value"></param>
        /// <returns>if the Journal entry is a credit or a debit</returns>
        /* Account      Increase    Decrease
            * Assets       Debit       Credit
            * Expences     Debit       Credit
            * Liabilities  Credit      Debit
            * Equity       Credit      Debit
            * Revenue      Credit      Debit
            */
        internal string DebitOrCredit(Account account, double value)
        {
            var creditordebit = "credit";

            switch (account.Type.Category.Id)
            {
                case AccountCategory.AC_ASSET:
                case AccountCategory.AC_EXPENCES:
                    if (value >= 0) creditordebit = "debit";
                    break;
                case AccountCategory.AC_EQUITY:
                case AccountCategory.AC_LIABILITY:
                case AccountCategory.AC_REVENUES:
                    if (value >= 0) creditordebit = "credit";
                    break;
                default:
                    break;
            }

            return creditordebit;
        }

        public class PnlData
        {
            public double Credit { get; set; }
            public double Debit { get; set; }
            public string Symbol { get; set; }
            public double Quantity { get; set; }
            public string Currency { get; set; }
            public string Fund { get; set; }
            public string Source { get; set; }
            public double FxRate { get; set; }
            public int SecurityId { get; set; }
        }

        public List<PnlData> UnsettledPnl { get; set; }

        public void GetUnsettledPnl()
        {
            this.UnsettledPnl = new List<PnlData>();

            var sql = $@"select credit, debit, symbol, quantity, fx_currency, fund, source, fxrate, security_id from vwJournal 
                         where [event] = 'unrealizedpnl' 
                         and AccountType = 'CHANGE IN UNREALIZED GAIN/(LOSS)' 
                         and fx_currency != '{BaseCurrency}'
                         and [when] < '{ValueDate.ToString("MM-dd-yyyy")}'";

            var _connection = new SqlConnection(ConnectionString);
            _connection.Open();
            var command = new SqlCommand(sql, _connection);
            //command.Transaction = env.Transaction;
            var reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                var unsettledPnl = new PnlData
                {
                    Credit = Convert.ToDouble(reader.GetFieldValue<decimal>(0)),
                    Debit = Convert.ToDouble(reader.GetFieldValue<decimal>(1)),
                    Symbol = reader.GetFieldValue<string>(2),
                    Quantity = Convert.ToDouble(reader.GetFieldValue<decimal>(3)),
                    Currency = reader.GetFieldValue<string>(4),
                    Fund = reader.GetFieldValue<string>(5),
                    Source = reader.GetFieldValue<string>(6),
                    FxRate = Convert.ToDouble(reader.GetFieldValue<decimal>(7)),
                    SecurityId = reader.GetFieldValue<int>(8),
                };

                this.UnsettledPnl.Add(unsettledPnl);
            }
        }

        /// <summary>
        /// Creates an open tax lot and also adds it to the TaxLotStatus collection
        /// </summary>
        /// <param name="element">Trade to create the tax lot</param>
        /// <param name="fxrate">FxRate for this trade</param>
        /// <returns>Generated TaxLot</returns>
        public TaxLotStatus GenerateOpenTaxLot(Transaction element, double fxrate)
        {
            var taxlotStatus = new TaxLotStatus
            {
                Trade = element,
                InvestmentAtCost = element.NetMoney * fxrate,
                FxRate = fxrate,
                TradeDate = element.TradeDate,
                BusinessDate = element.TradeDate,
                Symbol = element.Symbol,
                Side = element.Side,
                OpenId = element.LpOrderId,
                Status = "Open",
                OriginalQuantity = element.Quantity,
                Quantity = element.Quantity,
                Fund = GetFund(element),
                TradePrice = element.SettleNetPrice,
            };

            TaxLotStatus.Add(element.LpOrderId, taxlotStatus);

            return taxlotStatus;
        }
    }
}
