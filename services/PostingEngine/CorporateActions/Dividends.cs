using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using PostingEngine.Extensions;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.CorporateActions
{
    public partial class Dividends
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        private readonly PostingEngineEnvironment env;
        private Dividends(PostingEngineEnvironment env)
        {
            this.env = env;

            // Lets make sure that we have all the approporiate AccountTypes
            env.FindOrCreate(AccountCategory.AC_LIABILITY, "DIVIDENDS WITHHOLDING PAYABLE");
            env.FindOrCreate(AccountCategory.AC_EXPENCES, "DIVIDENDS WITHHOLDING EXPENSE");

            env.FindOrCreate(AccountCategory.AC_LIABILITY, "DIVIDENDS WITHHOLDING PAYABLE FX TRANSLATION");
            env.FindOrCreate(AccountCategory.AC_EXPENCES, "DIVIDENDS WITHHOLDING EXPENSE FX TRANSLATION");

            /*
             * Credit Cash
             * Debit the PAYABLE / FX TRANSLATION
            */

            env.FindOrCreate(AccountCategory.AC_EXPENCES, "DIVIDEND EXPENSE FX TRANSLATION");
            env.FindOrCreate(AccountCategory.AC_LIABILITY, "DIVIDEND PAYABLE FX TRANSLATION");

            env.FindOrCreate(AccountCategory.AC_ASSET, "DIVIDEND RECEIVABLE FX TRANSLATION");
            env.FindOrCreate(AccountCategory.AC_REVENUES, "DIVIDEND INCOME FX TRANSLATION");
        }

        public static Dividends Get(PostingEngineEnvironment env)
        {
            return new Dividends(env);
        }

        public List<Journal> Process()
        {
            var result = ProcessExecutionDate();

            result.AddRange(GenerateFxTranslation());

            result.AddRange(ProcessPayDate());

            return result;
        }

        // We only want to generate the FX Translation between Ex date and PayDate as once it moves into Settled Cash
        private List<Journal> GenerateFxTranslation()
        {
            var journals = new List<Journal>();

            var dividendListForFxTranslation = _dividends.Where(i => env.ValueDate > i.ExecutionDate && env.ValueDate < i.PayDate);
            if (dividendListForFxTranslation.Count() == 0)
                return journals;

            var symbols = String.Join (",", dividendListForFxTranslation.Select(i => $"'{i.Symbol}'"));

            var sql1 = $@"SELECT source, fund, sum(quantity), AccountType, J.symbol, fx_currency, sum(credit - debit) as balance
            FROM vwJournal j
            where J.Symbol in ({symbols})
            and AccountType in ('DIVIDEND EXPENSE', 'DIVIDEND INCOME')
            and j.[when] < '{env.ValueDate.ToString("yyyy-MM-dd")}'  and fx_currency != 'USD'
            group by source, fund, j.symbol, AccountType, fx_currency
            order by source, j.Symbol";

            var connection = new SqlConnection(env.ConnectionString);
            connection.Open();

            var command = new SqlCommand(sql1, connection);
            var reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                int offset = 0;

                var element = new {
                    Source = reader.GetFieldValue<string>(offset++),
                    Fund = reader.GetFieldValue<string>(offset++),
                    Quantity = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                    AccountType = reader.GetFieldValue<string>(offset++),
                    Symbol = reader.GetFieldValue<string>(offset++),
                    FxCurrency = reader.GetFieldValue<string>(offset++),
                    Balance = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                };

                var fxrateDiff = FxRates.FxIncrement(env, element.FxCurrency);

                var fxTranslation = element.Balance * fxrateDiff;

                var from = "DIVIDEND PAYABLE FX TRANSLATION";
                var to = "DIVIDEND EXPENSE FX TRANSLATION";

                // NOw lets generate JOurnals
                if ( element.AccountType.Equals("DIVIDENDS RECEIVABLE"))
                {
                    from = "DIVIDEND RECEIVABLE FX TRANSLATION";
                    to = "DIVIDEND INCOME FX TRANSLATION";
                }

                var fromTo = new AccountUtils().GetAccounts(env, from, to, new string[] { element.FxCurrency }.ToList());
                var debit = new Journal(fromTo.From, Event.DIVIDEND, env.ValueDate)
                {
                    Source = element.Source,
                    Fund = element.Fund,
                    FxCurrency = element.FxCurrency,
                    Symbol = element.Symbol,
                    SecurityId = env.FindTrade(element.Source).SecurityId,
                    Quantity = element.Quantity,

                    FxRate = fxrateDiff,
                    StartPrice = 0,
                    EndPrice = 0,

                    Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, fxTranslation),
                    CreditDebit = env.DebitOrCredit(fromTo.From, fxTranslation),
                };

                var credit = new Journal(debit)
                {
                    Account = fromTo.To,
                    Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, fxTranslation),
                    CreditDebit = env.DebitOrCredit(fromTo.To, fxTranslation),
                };
                journals.AddRange(new[] { debit, credit });

            }
            reader.Close();

            var sql2 = $@"SELECT source, fund, sum(quantity), AccountType, J.symbol, fx_currency, sum(credit - debit) as balance
            FROM vwJournal j
            where J.Symbol in ({symbols})
            and AccountType in ('DIVIDENDS WITHHOLDING EXPENSE')
            and j.[when] < '{env.ValueDate.ToString("yyyy-MM-dd")}'  and fx_currency != 'USD'
            group by source, fund, j.symbol, AccountType, fx_currency
            order by source, j.Symbol";

            command = new SqlCommand(sql2, connection);
            reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                int offset = 0;

                var element = new
                {
                    Source = reader.GetFieldValue<string>(offset++),
                    Fund = reader.GetFieldValue<string>(offset++),
                    Quantity = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                    AccountType = reader.GetFieldValue<string>(offset++),
                    Symbol = reader.GetFieldValue<string>(offset++),
                    FxCurrency = reader.GetFieldValue<string>(offset++),
                    Balance = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                };

                var fxrateDiff = FxRates.FxIncrement(env, element.FxCurrency);

                var fxTranslation = element.Balance * fxrateDiff;

                var from = "DIVIDENDS WITHHOLDING PAYABLE FX TRANSLATION";
                var to = "DIVIDENDS WITHHOLDING EXPENSE FX TRANSLATION";

                var fromTo = new AccountUtils().GetAccounts(env, from, to, new string[] { element.FxCurrency }.ToList());
                var debit = new Journal(fromTo.From, Event.DIVIDEND, env.ValueDate)
                {
                    Source = element.Source,
                    Fund = element.Fund,
                    FxCurrency = element.FxCurrency,
                    Symbol = element.Symbol,
                    SecurityId = env.FindTrade(element.Source).SecurityId,
                    Quantity = element.Quantity,

                    FxRate = fxrateDiff,
                    StartPrice = 0,
                    EndPrice = 0,

                    Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, fxTranslation),
                    CreditDebit = env.DebitOrCredit(fromTo.From, fxTranslation),
                };

                var credit = new Journal(debit)
                {
                    Account = fromTo.To,
                    Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, fxTranslation),
                    CreditDebit = env.DebitOrCredit(fromTo.To, fxTranslation),
                };
                journals.AddRange(new[] { debit, credit });
            }

            reader.Close();
            connection.Close();

            return journals;
        }

        private static readonly List<Dividend> _dividends = new List<Dividend>();

        public static void CacheDividends(PostingEngineEnvironment env)
        {
            _dividends.Clear();

            var query = "select symbol, notice_date, execution_date, record_date, pay_date, rate, currency, withholding_rate, fx_rate from cash_dividends";

            var connection = new SqlConnection(env.ConnectionString);
            connection.Open();

            var command = new SqlCommand(query, connection);
            var reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                var offset = 0;
                var dividend = new Dividend
                {
                    Symbol = reader.GetFieldValue<string>(offset++),
                    NoticeDate = reader.GetFieldValue<DateTime>(offset++),
                    ExecutionDate = reader.GetFieldValue<DateTime>(offset++),
                    RecordDate = reader.GetFieldValue<DateTime>(offset++),
                    PayDate = reader.GetFieldValue<DateTime>(offset++),
                    Rate = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                    Ccy = reader.GetFieldValue<string>(offset++),
                    WithholdingRate = Convert.ToDouble(reader.GetFieldValue<decimal>(offset++)),
                    FxRate = reader.GetFieldValue<decimal>(offset++),
                };

                _dividends.Add(dividend);
            }
            reader.Close();
            connection.Close();
        }

        public List<Journal> ProcessExecutionDate()
        {
            return GenerateJournals(_dividends.Where(d=>d.ExecutionDate.ToString("yyyy-MM-dd").Equals(env.ValueDate.ToString("yyyy-MM-dd")) && d.Rate != 0).ToList(),false);
        }

        public List<Journal> ProcessPayDate()
        {
            return GenerateJournals(_dividends.Where(d => d.PayDate.ToString("yyyy-MM-dd").Equals(env.ValueDate.ToString("yyyy-MM-dd")) && d.Rate != 0).ToList(), true);
        }

        private static Dictionary<string, List<ExcercisedDividends>> state = new Dictionary<string, List<ExcercisedDividends>>();

        private List<Journal> GenerateJournals(IEnumerable<Dividend> dividends, bool settlement)
        {
            var multiplier = settlement ? -1 : 1;

            var journals = new List<Journal>();
            if (dividends.Count() == 0)
                return journals;

            Logger.Info($"Processing Dividends {dividends.Count()}");

            foreach ( var dividend in dividends)
            {
                var key = $"{dividend.Symbol}::{dividend.ExecutionDate.ToString("yyyy-MM-dd")}";
                if (settlement && state.ContainsKey(key))
                {
                    var entries = state[key];
                    var fxPayDateRate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, entries[0].Currency).Rate) * -1;
                    foreach (var entry in entries )
                    {
                        entry.SettleGross = entry.BaseGross * fxPayDateRate;
                        entry.SettleWithholding = entry.BaseWithholding * fxPayDateRate;
                        entry.SettleNet = entry.BaseNet * fxPayDateRate;
                    }
                    journals.AddRange( ProcessStuff(entries, settlement));

                    // Now need to reverse all of the FX Translation entries.
                    journals.AddRange( ReverseFxTranslation(fxPayDateRate, entries) );

                    // Not needed any more, as its now settled.
                    state.Remove(key);

                    continue;
                }

                // Only done on Execrcise date
                if ( !settlement ) { 
                    var taxLots = env.TaxLotStatus.Values.Where(t => t.Symbol.Equals(dividend.Symbol) && !t.Status.ToLowerInvariant().Equals("closed")).ToList();
                    if (taxLots.Count() > 0)
                    {
                        var fxRate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, taxLots.FirstOrDefault().Trade.SettleCurrency).Rate);

                        var results = taxLots.Select(t => new ExcercisedDividends()
                        {
                            Symbol = t.Symbol,
                            Quantity = t.Quantity,
                            Source = t.Trade.LpOrderId,
                            SecurityId = t.Trade.SecurityId,
                            Long = t.Trade.IsLong(),
                            FxRate = fxRate,
                            Fund = env.GetFund(t.Trade),
                            Currency = t.Trade.SettleCurrency,

                            BaseGross = t.Quantity * dividend.Rate,
                            BaseWithholding = t.Quantity * dividend.Rate * dividend.WithholdingRate,
                            BaseNet = (t.Quantity * dividend.Rate) - (t.Quantity * dividend.Rate * dividend.WithholdingRate),

                            SettleGross = t.Quantity * dividend.Rate * fxRate,
                            SettleWithholding = t.Quantity * dividend.Rate * dividend.WithholdingRate * fxRate,
                            SettleNet = (t.Quantity * dividend.Rate * fxRate) - (t.Quantity * dividend.Rate * dividend.WithholdingRate * fxRate),
                        });

                        Logger.Info($"Dividends {key} added");
                        if ( state.ContainsKey(key))
                        {

                        }
                        state.Add(key, results.ToList());
                        journals.AddRange(ProcessStuff(state[key], settlement));
                    }
                }

            }

            return journals;
        }

        private IEnumerable<Journal> ReverseFxTranslation(double fxPayDateRate, List<ExcercisedDividends> entries)
        {
            var journals = new List<Journal>();

            foreach( var entry in entries)
            {
                var OriginalSettleGross = entry.BaseGross * entry.FxRate;
                var OriginalSettleWithholding = entry.BaseWithholding * entry.FxRate;

                var NewSettleGross = Math.Abs(entry.SettleGross);
                var NewSettleWithholding = Math.Abs(entry.SettleWithholding);

                var DiffSettleGross = NewSettleGross - OriginalSettleGross;
                var DiffSettleWithholding = NewSettleWithholding - OriginalSettleWithholding;

                DiffSettleGross *= -1;
                DiffSettleWithholding *= -1;

                var from = "";
                var to = "";

                if ( entry.Long )
                {
                    from = "DIVIDEND RECEIVABLE FX TRANSLATION";
                    to = "DIVIDEND INCOME FX TRANSLATION";
                }
                else
                {
                    from = "DIVIDEND PAYABLE FX TRANSLATION";
                    to = "DIVIDEND EXPENSE FX TRANSLATION";
                }

                var fromTo = new AccountUtils().GetAccounts(env, from, to, new string[] { entry.Currency }.ToList());
                var debit = new Journal(fromTo.From, Event.DIVIDEND, env.ValueDate)
                {
                    Source = entry.Source,
                    Fund = entry.Fund,
                    FxCurrency = entry.Currency,
                    Symbol = entry.Symbol,
                    SecurityId = env.FindTrade(entry.Source).SecurityId,
                    Quantity = entry.Quantity,

                    FxRate = fxPayDateRate - entry.FxRate,
                    StartPrice = 0,
                    EndPrice = 0,

                    Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, DiffSettleGross),
                    CreditDebit = env.DebitOrCredit(fromTo.From, DiffSettleGross),
                };

                var credit = new Journal(debit)
                {
                    Account = fromTo.To,
                    Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, DiffSettleGross),
                    CreditDebit = env.DebitOrCredit(fromTo.To, DiffSettleGross),
                };
                journals.AddRange(new[] { debit, credit });

                if (DiffSettleWithholding != 0)
                {
                    var fromWithholding = "DIVIDENDS WITHHOLDING PAYABLE FX TRANSLATION";
                    var toWithholding = "DIVIDENDS WITHHOLDING EXPENSE FX TRANSLATION";

                    fromTo = new AccountUtils().GetAccounts(env, fromWithholding, toWithholding, new string[] { entry.Currency }.ToList());
                    debit = new Journal(fromTo.From, Event.DIVIDEND, env.ValueDate)
                    {
                        Source = entry.Source,
                        Fund = entry.Fund,
                        FxCurrency = entry.Currency,
                        Symbol = entry.Symbol,
                        SecurityId = env.FindTrade(entry.Source).SecurityId,
                        Quantity = entry.Quantity,

                        FxRate = fxPayDateRate - entry.FxRate,
                        StartPrice = 0,
                        EndPrice = 0,

                        Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, DiffSettleWithholding),
                        CreditDebit = env.DebitOrCredit(fromTo.From, DiffSettleWithholding),
                    };

                    credit = new Journal(debit)
                    {
                        Account = fromTo.To,
                        Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, DiffSettleWithholding),
                        CreditDebit = env.DebitOrCredit(fromTo.To, DiffSettleWithholding),
                    };
                    journals.AddRange(new[] { debit, credit });
                }
            }

            return journals;
        }

        private List<Journal> ProcessStuff(List<ExcercisedDividends> list, bool settlement)
        {
            var journals = new List<Journal>();

            // Now for each taxlot we can post a Journal Entry
            foreach (var i in list)
            {
                var from = "DIVIDENDS RECEIVABLE";
                var to = "DIVIDENDS PAYABLE";
                var withholdingFrom = "DIVIDENDS WITHHOLDING PAYABLE";
                var withholdingTo = "DIVIDENDS WITHHOLDING EXPENSE";

                if (settlement)
                {
                    withholdingFrom = "DIVIDENDS WITHHOLDING EXPENSE";
                    withholdingTo = "Settled Cash";
                }

                if (i.Long)
                {
                    if (settlement)
                    {
                        from = "DIVIDENDS RECEIVABLE";
                        to = "Settled Cash";
                    }
                    else
                    {
                        from = "DIVIDENDS RECEIVABLE";
                        to = "DIVIDEND INCOME";
                    }
                }
                else
                {
                    if (settlement)
                    {
                        from = "DIVIDENDS PAYABLE";
                        to = "Settled Cash";
                    }
                    else
                    {
                        from = "DIVIDENDS PAYABLE";
                        to = "DIVIDEND EXPENSE";
                    }
                }

                journals.AddRange(PostExcercise(i, from, to, withholdingFrom, withholdingTo));
            }

            return journals;
        }

        /*
            DIVIDENDS PAYABLE
            DIVIDEND INCOME
            */
        private List<Journal> PostExcercise(ExcercisedDividends calculatedDividend, string from, string to, string withholdingFrom, string withholdingTo)
        {
            var journals = new List<Journal>();

            var fromTo = new AccountUtils().GetAccounts(env, from, to, new string[] { calculatedDividend.Currency }.ToList());

            var fromToWithholding = new AccountUtils().GetAccounts(env, withholdingFrom, withholdingTo, new string[] { calculatedDividend.Currency }.ToList());

            var multiplier = calculatedDividend.Long ? 1 : -1;

            var debit = new Journal(fromTo.From, Event.DIVIDEND, env.ValueDate)
            {
                Source = calculatedDividend.Source,
                Fund = calculatedDividend.Fund,
                FxCurrency = calculatedDividend.Currency,
                Symbol = calculatedDividend.Symbol,
                SecurityId = calculatedDividend.SecurityId,
                Quantity = calculatedDividend.Quantity,

                FxRate = calculatedDividend.FxRate,
                StartPrice = 0,
                EndPrice = 0,

                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, calculatedDividend.SettleGross * multiplier),
                CreditDebit = env.DebitOrCredit(fromTo.From, calculatedDividend.SettleGross * multiplier),
            };

            var credit = new Journal(debit)
            {
                Account = fromTo.To,
                Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, calculatedDividend.SettleGross * multiplier),
                CreditDebit = env.DebitOrCredit(fromTo.To, calculatedDividend.SettleGross * multiplier),
            };
            journals.AddRange(new[] { debit, credit });

            if ( calculatedDividend.SettleWithholding != 0)
            {
                // Need to generate additional Journal Entries

                var withholding_debit = new Journal(fromToWithholding.From, Event.DIVIDEND, env.ValueDate)
                {
                    Source = calculatedDividend.Source,
                    Fund = calculatedDividend.Fund,
                    FxCurrency = calculatedDividend.Currency,
                    Symbol = calculatedDividend.Symbol,
                    SecurityId = calculatedDividend.SecurityId,
                    Quantity = calculatedDividend.Quantity,

                    FxRate = calculatedDividend.FxRate,
                    StartPrice = 0,
                    EndPrice = 0,

                    Value = AccountCategory.SignedValue(fromToWithholding.From, fromToWithholding.To, true, calculatedDividend.SettleWithholding),
                    CreditDebit = env.DebitOrCredit(fromToWithholding.From, calculatedDividend.SettleWithholding),
                };

                var withholding_credit = new Journal(debit)
                {
                    Account = fromToWithholding.To,
                    Value = AccountCategory.SignedValue(fromToWithholding.From, fromToWithholding.To, false, calculatedDividend.SettleWithholding),
                    CreditDebit = env.DebitOrCredit(fromToWithholding.To, calculatedDividend.SettleWithholding),
                };

                journals.AddRange(new[] { withholding_debit, withholding_credit });
            }

            return journals;
        }
    }
}
