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
    public class Dividends
    {
        private readonly PostingEngineEnvironment env;
        private Dividends(PostingEngineEnvironment env)
        {
            this.env = env;
        }

        public static Dividends Get(PostingEngineEnvironment env)
        {
            return new Dividends(env);
        }

        public List<Journal> Process()
        {
            var result = ProcessExecutionDate();
            result.AddRange(ProcessPayDate());

            return result;
        }

        public List<Journal> ProcessExecutionDate()
        {
            return GenerateJournals($"select symbol, notice_date, execution_date, record_date, pay_date, rate, currency, withholding_rate, fx_rate from cash_dividends where execution_date = '{env.ValueDate.ToString("yyyy-MM-dd")}'",
                false);
        }

        public List<Journal> ProcessPayDate()
        {
            return GenerateJournals($"select symbol, notice_date, execution_date, record_date, pay_date, rate, currency, withholding_rate, fx_rate from cash_dividends where pay_date = '{env.ValueDate.ToString("yyyy-MM-dd")}'",
                true);
        }

        private List<Journal> GenerateJournals(string query, bool settlement)
        {
            var multiplier = settlement ? -1 : 1;

            var journals = new List<Journal>();

            var connection = new SqlConnection(env.ConnectionString);
            connection.Open();

            var command = new SqlCommand(query, connection);
            var reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                var offset = 0;
                var dividend = new
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

                var taxLots = env.TaxLotStatus.Values.Where(t => t.Symbol.Equals(dividend.Symbol) && !t.Status.ToLowerInvariant().Equals("closed")).ToList();
                if ( taxLots.Count() > 0)
                {
                    var fxRate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, taxLots.FirstOrDefault().Trade.SettleCurrency).Rate);

                    var results = taxLots.Select(t => new
                    {
                        t.Symbol,
                        t.Quantity,
                        Source = t.Trade.LpOrderId,
                        t.Trade.SecurityId,
                        Long = t.Trade.IsShort(),
                        FxRate = fxRate,
                        Fund = env.GetFund(t.Trade),
                        Currency = t.Trade.SettleCurrency,

                        BaseGross = t.Quantity * dividend.Rate,
                        BaseWithholding = t.Quantity * dividend.Rate * dividend.WithholdingRate,
                        BaseNet = (t.Quantity * dividend.Rate) - (t.Quantity * dividend.Rate * dividend.WithholdingRate),

                        SettleGross = t.Quantity * dividend.Rate * fxRate * multiplier,
                        SettleWithholding = t.Quantity * dividend.Rate * dividend.WithholdingRate * fxRate * multiplier,
                        SettleNet = (t.Quantity * dividend.Rate * fxRate * multiplier) - (t.Quantity * dividend.Rate * dividend.WithholdingRate * fxRate * multiplier),
                    });

                    // Validate that the Types exist in the system.
                    if (AccountType.Find(AccountCategory.AC_LIABILITY, "DIVIDENDS WITHHOLDING PAYABLE", false) == null)
                    {
                        // Need to create the Account Type
                        var createdAccountType = AccountType.FindOrCreate(AccountCategory.AC_LIABILITY, "DIVIDENDS WITHHOLDING PAYABLE");
                        new AccountUtils().Save(env, createdAccountType);
                    }

                    if (AccountType.Find(AccountCategory.AC_EXPENCES, "DIVIDENDS WITHHOLDING EXPENSE", false) == null)
                    {
                        // Need to create the Account Type
                        var createdAccountType = AccountType.FindOrCreate(AccountCategory.AC_EXPENCES, "DIVIDENDS WITHHOLDING EXPENSE");
                        new AccountUtils().Save(env, createdAccountType);
                    }

                    // Now for each taxlot we can post a Journal Entry
                    foreach ( var i in results)
                    {
                        var from = "DIVIDENDS RECEIVABLE";
                        var to = "DIVIDENDS PAYABLE";
                        var withholdingFrom = "DIVIDENDS WITHHOLDING PAYABLE";
                        var withholdingTo = "DIVIDENDS WITHHOLDING EXPENSE";

                        if ( settlement )
                        {
                            withholdingFrom = "DIVIDENDS WITHHOLDING EXPENSE";
                            withholdingTo = "Settled Cash";
                        }

                        if ( i.Long )
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
                            if (settlement) {
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
                }

            }

            reader.Close();
            command.Dispose();
            connection.Close();

            return journals;
        }

        /*
         DIVIDENDS PAYABLE
         DIVIDEND INCOME
         */
        private List<Journal> PostExcercise(dynamic calculatedDividend, string from, string to, string withholdingFrom, string withholdingTo)
        {
            var journals = new List<Journal>();

            var fromTo = new AccountUtils().GetAccounts(env, from, to, new string[] { calculatedDividend.Currency }.ToList());

            var fromToWithholding = new AccountUtils().GetAccounts(env, withholdingFrom, withholdingTo, new string[] { calculatedDividend.Currency }.ToList());

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

                Value = env.SignedValue(fromTo.From, fromTo.To, true, calculatedDividend.SettleGross),
                CreditDebit = env.DebitOrCredit(fromTo.From, calculatedDividend.SettleGross),
            };

            var credit = new Journal(debit)
            {
                Account = fromTo.To,
                Value = env.SignedValue(fromTo.From, fromTo.To, false, calculatedDividend.SettleGross),
                CreditDebit = env.DebitOrCredit(fromTo.To, calculatedDividend.SettleGross),
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

                    Value = env.SignedValue(fromToWithholding.From, fromToWithholding.To, true, calculatedDividend.SettleWithholding),
                    CreditDebit = env.DebitOrCredit(fromToWithholding.From, calculatedDividend.SettleWithholding),
                };

                var withholding_credit = new Journal(debit)
                {
                    Account = fromToWithholding.To,
                    Value = env.SignedValue(fromToWithholding.From, fromToWithholding.To, false, calculatedDividend.SettleWithholding),
                    CreditDebit = env.DebitOrCredit(fromToWithholding.To, calculatedDividend.SettleWithholding),
                };

                journals.AddRange(new[] { withholding_debit, withholding_credit });
            }

            return journals;
        }
    }
}
