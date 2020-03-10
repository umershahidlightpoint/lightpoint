using LP.Finance.Common;
using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.Extensions;
using PostingEngine.MarketData;
using PostingEngine.PostingRules;
using PostingEngine.PostingRules.Utilities;
using PostingEngine.TaxLotMethods;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace PostingEngine
{
    public static class EnvironmentFactory
    {
        public static IPostingEngineEnvironment GetEnvironment(string env)
        {
            return new PostingEngineEnvironment();
        }
    }

    // Base of the PostingEngine Environment, allow for multiple implementations
    public interface IPostingEngineEnvironment
    {
        int CollectData(List<Journal> journals);
        PostingEngineCallBack CallBack { get; set; }
        DateTime ValueDate { get; set; }
        DateTime PreviousValueDate { get; set; }
        DateTime BusinessDate { get; set; }
        string ConnectionString { get; set; }
    }

    public class PostingEngineEnvironment : IPostingEngineEnvironment
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public PostingEngineEnvironment()
        {
            Messages = new Dictionary<string, int>();

            Journals = new List<Journal>();

            TaxLotStatus = new Dictionary<string, TaxLotStatus>();
            TaxLot = new List<TaxLot>();
        }

        public PostingEngineEnvironment(string connectionString): this()
        {
            Connection = new SqlConnection(connectionString);
            Transaction = Connection.BeginTransaction();

            SetupSecurityTypeMappings();
        }

        public PostingEngineEnvironment(SqlConnection connection, SqlTransaction transaction = null) : this()
        {
            Connection = connection;
            Transaction = transaction;

            SetupSecurityTypeMappings();
        }

        private SqlConnection __connection;

        private void UpdateLocal(Journal journal)
        {
            var fxRate = FxRates.Find(this, journal.When, journal.FxCurrency).Rate;

            journal.JournalValue = new JournalValue(journal.Value / fxRate, journal.Value);
        }

        public int CollectData(List<Journal> journals)
        {
            // Lets do the nasty, and update the local values based on the fxrate
            foreach(var journal in journals)
            {
                UpdateLocal(journal);
            }

            return CollectData(ConnectionString, journals);
        }

        private int CollectData(string connectionString, List<Journal> journals)
        {

            if (__connection == null)
            {
                __connection = new SqlConnection(connectionString);
                __connection.Open();
            }


            //Logger.Info($"Commiting Journals to the database {journals.Count()}");

            //new SQLBulkHelper().Insert("journal", journals.ToArray(), __connection, transaction);
            try
            {
                if (this.Connection != null)
                    new SQLBulkHelper().Insert("journal", journals.ToArray(), this.Connection, this.Transaction);
                else
                {
                    var transaction = __connection.BeginTransaction();

                    new SQLBulkHelper().Insert("journal", journals.ToArray(), __connection, transaction);

                    transaction.Commit();
                }

            } catch (Exception ex )
            {
                Logger.Error(ex, $"Unable to save journals {this.ValueDate.ToString("yyyy-MM-dd")}");
            }
            //Logger.Info($"Completed :: Commiting Journals to the database {journals.Count()}");

            return journals.Count();
        }

        internal void FindOrCreate(int aC_EXPENCES, string v)
        {
            if (AccountType.Find(aC_EXPENCES, v, false) == null)
            {
                // Need to create the Account Type
                var createdAccountType = AccountType.FindOrCreate(aC_EXPENCES, v);
                new AccountUtils().Save(this, createdAccountType);
            }
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
        public Transaction[] Allocations { get; set; }
        public Transaction[] Trades { get; set; }
        public Dictionary<string, Accrual> Accruals { get; set; }

        /// <summary>
        /// Check to see if the Tax Lot is Still Open for this trade
        /// </summary>
        /// <param name="i"></param>
        /// <returns></returns>
        internal bool TaxLotsIsOpen(Transaction i)
        {
            if ( TaxLotStatus.ContainsKey(i.LpOrderId))
            {
                return !TaxLotStatus[i.LpOrderId].Status.Equals("closed");
            }

            return false;
        }

        internal bool IsTaxLot(Transaction i)
        {
            return TaxLotStatus.ContainsKey(i.LpOrderId);
        }

        public Dictionary<string, TaxLotStatus> TaxLotStatus { get; private set; }
        public List<TaxLot> TaxLot { get; private set; }

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

        internal TaxLotStatus FindTaxLotStatus(Transaction i)
        {
            if (TaxLotStatus.ContainsKey(i.LpOrderId))
                return TaxLotStatus[i.LpOrderId];

            return null;
        }

        public bool IsValidAccrual(string accrualId)
        {
            return Accruals.ContainsKey(accrualId);
        }

        public List<Journal> Journals { get; set; }

        public TaxRate TaxRate { get; set; }

        public Dictionary<string, IPostingRule> Rules { get; set; }

        private void SetupSecurityTypeMappings()
        {
            TradingRules = new Dictionary<string, IPostingRule>
            {
                // Common
                {"REIT", new CommonStock() },
                {"ADR", new CommonStock() },
                {"Common Stock", new CommonStock() },
                {"Open-End Fund", new CommonStock() },
                {"Unit", new CommonStock() },

                // Equity Option
                {"Equity Option", new EquityOption() },

                // Cash
                {"Cash", new CashRule() },

                // Forward Rule
                {"FORWARD", new Forward() },

                // CROSS
                {"CROSS", new Cross() },

                // Default Rule
                {"Physical index future.", new DefaultRule() },

                // Derivatives
                {"Equity Swap", new EquitySwaps() },

                // Fixed Income
                {"GLOBAL", new Bond() },
                {"FI", new Bond() },
            };

        }
        // Map of Product type to IPostingRule, now we can run each of these in parellel, once we have the data
        // which is readonly we can spin up a number of Tasks, each responsible for processing the right product
        // type, keep the commits to the database towards the end
        public Dictionary<string, IPostingRule> TradingRules = new Dictionary<string, IPostingRule>();

        public readonly Dictionary<string, IPostingRule> JournalRules = new Dictionary<string, IPostingRule>
        {
            {"Journals", new FakeJournals() },
        };

        public SqlConnection Connection { get; private set; }
        public SqlTransaction Transaction { get; private set; }


        public void AddMessage(string message)
        {
            Logger.Warn(message);

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

        internal List<Transaction> FindTradeAllocations(Transaction element)
        {
            var list = Allocations.Where(i => i.LpOrderId.Equals(element.LpOrderId)).ToList();
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

        public JournalValue SignedValue(Account fromAccount, Account toAccount, bool debit, double baseValue, double localValue)
        {
            var jv = new JournalValue(
                AccountCategory.SignedValue(fromAccount, toAccount, debit, localValue),
                AccountCategory.SignedValue(fromAccount, toAccount, debit, baseValue)
                );

            return jv;
        }

        public JournalValue SignedValueWithFx(Account fromAccount, Account toAccount, bool debit, double localValue, double fxRate)
        {
            var jv = new JournalValue(
                AccountCategory.SignedValue(fromAccount, toAccount, debit, localValue),
                AccountCategory.SignedValue(fromAccount, toAccount, debit, localValue * fxRate)
                );

            return jv;
        }

        internal string DebitOrCredit(Account account, double value)
        {
            var creditordebit = "credit";

            switch (account.Type.Category.Id)
            {
                case AccountCategory.AC_ASSET:
                case AccountCategory.AC_EXPENCES:
                    if (value >= 0) creditordebit = "debit";
                    if (value < 0) creditordebit = "credit";
                    break;
                case AccountCategory.AC_EQUITY:
                case AccountCategory.AC_LIABILITY:
                case AccountCategory.AC_REVENUES:
                    if (value < 0) creditordebit = "debit";
                    if (value >= 0) creditordebit = "credit";
                    break;
                default:
                    break;
            }

            return creditordebit;
        }

        public class PnlData
        {
            public DateTime When { get; set; }
            public double Credit { get; set; }
            public double Debit { get; set; }
            public double LocalCredit { get; set; }
            public double LocalDebit { get; set; }

            public string Symbol { get; set; }
            public double Quantity { get; set; }
            public string Currency { get; set; }
            public string Fund { get; set; }
            public string Source { get; set; }
            public string SecurityType { get; set; }
            public double FxRate { get; set; }
            public int SecurityId { get; set; }
        }

        public List<PnlData> UnsettledPnl { get; private set; }

        public void GetUnsettledPnl(DateTime valueDate)
        {
            // TODO: Need to ensure that we are getting the right data from this list
            if (UnsettledPnl == null)
                UnsettledPnl = new List<PnlData>();

            var sql = $@"select [when], credit, debit, local_credit, local_debit, symbol, quantity, fx_currency, fund, source, fxrate, security_id, SecurityType from vwWorkingJournals 
                         where [event] in ('unrealizedpnl', 'daily-unrealizedpnl')
                         and AccountCategory = 'Revenues'
                         -- and AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)', 'Change in Unrealized Derivatives Contracts at Fair Value') 
                         and fx_currency != '{BaseCurrency}'
                         and [when] = '{valueDate.ToString("MM-dd-yyyy")}'";

            using (var _connection = new SqlConnection(ConnectionString))
            {
                _connection.Open();
                var command = new SqlCommand(sql, _connection);
                //command.Transaction = env.Transaction;
                var reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var offset = 0;
                    var unsettledPnl = new PnlData
                    {
                        When = reader.GetFieldValue<DateTime>(offset++),
                        Credit = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                        Debit = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                        LocalCredit = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                        LocalDebit = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                        Symbol = reader.GetFieldValue<string>(offset++),
                        Quantity = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                        Currency = reader.GetFieldValue<string>(offset++),
                        Fund = reader.GetFieldValue<string>(offset++),
                        Source = reader.GetFieldValue<string>(offset++),
                        FxRate = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                        SecurityId = reader.GetFieldValue<int>(offset++),
                        SecurityType = reader.GetFieldValue<string>(offset++),
                    };

                    this.UnsettledPnl.Add(unsettledPnl);
                }

                reader.Close();
                _connection.Close();
            }
        }

        /// <summary>
        /// Creates an open tax lot and also adds it to the TaxLotStatus collection
        /// </summary>
        /// <param name="element">Trade to create the tax lot</param>
        /// <param name="fxrate">FxRate for this trade</param>
        /// <returns>Generated TaxLot</returns>
        public TaxLotStatus GenerateOpenTaxLotStatus(Transaction element, double fxrate)
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
                TradePrice = element.FactoredSettleNetPrice(),
            };

            TaxLotStatus.Add(element.LpOrderId, taxlotStatus);

            return taxlotStatus;
        }

        public string CodeMap(string symbol)
        {
            return _codeMap.ContainsKey(symbol) ? _codeMap[symbol] : symbol;
        }

        internal static Dictionary<string, string> _codeMap = new Dictionary<string, string>() {
            { "ZZ_AUDIT_FEE", "Audit Fee" },
            { "ZZ_MANAGEMENT_FEES", "Management Fees" },
            { "ZZ_ACCOUNTING_FEES", "Acounting Fees" },
            { "ZZ_ADMINISTRATIVE_FEES", "Administritive Fees" },
            { "ZZ_CUSTODY_FEES", "Custody Fees" },
            { "ZZ_LEGAL_FEES", "Legal Fees" },
            { "ZZ_STOCK_BORROW_FEES", "Stock Borrow Fees" },
            { "ZZ_BANK_SERVICE_FEES", "Bank Service Fees" },
            { "ZZ_INVESTOR_CONTRIBUTIONS", "Investor Contributions" },
            { "ZZ_FINANCING_EXPENSE", "Finance Expense" },
            { "ZZ_DIRECTORS_FEE", "Directors Fees" },
            { "ZZ_DNO_INSURANCE", "DNO Insurance" },
            { "ZZ_TAX_FEE", "Tax Fees" },
            { "ZZ_AML_FEES", "AML Fees" },
            { "ZZ_ORGANIZATION_COSTS", "Organization Costs" },
            { "ZZ_OPERATING_FEE", "Operating Fees" },
            { "ZZ_RESEARCH_COSTS", "Research Costs" },
            { "ZZ_INSURANCE_FEES", "Insurance Fees" },
        };
    }
}
