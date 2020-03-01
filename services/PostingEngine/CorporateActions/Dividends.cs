using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
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
        private PostingEngineEnvironment env;
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
                "DIVIDENDS RECEIVABLE", "DIVIDENDS PAYABLE");
        }

        public List<Journal> ProcessPayDate()
        {
            return GenerateJournals($"select symbol, notice_date, execution_date, record_date, pay_date, rate, currency, withholding_rate, fx_rate from cash_dividends where pay_date = '{env.ValueDate.ToString("yyyy-MM-dd")}'",
                "DIVIDENDS PAYABLE", "DIVIDEND INCOME");
        }

        private List<Journal> GenerateJournals(string query, string from, string to)
        {
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
                        Symbol = t.Symbol,
                        Quantity = t.Quantity,
                        Source = t.Trade.LpOrderId,
                        SecurityId = t.Trade.SecurityId,
                        FxRate = fxRate,
                        Currency = t.Trade.SettleCurrency,
                        BaseGross = t.Quantity * dividend.Rate,
                        BaseWithholding = t.Quantity * dividend.Rate * dividend.WithholdingRate,
                        BaseNet = (t.Quantity * dividend.Rate) - (t.Quantity * dividend.Rate * dividend.WithholdingRate),
                        SettleGross = t.Quantity * dividend.Rate * fxRate,
                        SettleWithholding = t.Quantity * dividend.Rate * dividend.WithholdingRate * fxRate,
                        SettleNet = (t.Quantity * dividend.Rate * fxRate) - (t.Quantity * dividend.Rate * dividend.WithholdingRate * fxRate),
                    });

                    // Now for each taxlot we can post a Journal Entry
                    foreach( var i in results)
                    {
                        journals.AddRange(Post(i, from, to));
                    }
                }

            }

            reader.Close();
            connection.Close();

            return journals;
        }

        /*
         DIVIDENDS PAYABLE
         DIVIDEND INCOME
         */
        private List<Journal> Post(dynamic calculatedDividend, string from, string to)
        {
            var fromTo = new AccountUtils().GetAccounts(env, from, to, new string[] { calculatedDividend.Currency }.ToList());

            var debit = new Journal(fromTo.From, Event.DIVIDEND, env.ValueDate)
            {
                Source = calculatedDividend.Source,
                //Fund = env.GetFund(element),
                FxCurrency = calculatedDividend.Currency,
                Symbol = calculatedDividend.Symbol,
                SecurityId = calculatedDividend.SecurityId,
                Quantity = calculatedDividend.Quantity,

                FxRate = calculatedDividend.FxRate,
                StartPrice = 0,
                EndPrice = 0,

                Value = env.SignedValue(fromTo.From, fromTo.To, true, calculatedDividend.SettleNet),
                CreditDebit = env.DebitOrCredit(fromTo.From, calculatedDividend.SettleNet),
            };

            var credit = new Journal(debit)
            {
                Account = fromTo.To,
                Value = env.SignedValue(fromTo.From, fromTo.To, false, calculatedDividend.SettleNet),
                CreditDebit = env.DebitOrCredit(fromTo.To, calculatedDividend.SettleNet),
            };


            return new List<Journal>(new[] { debit, credit });

        }
    }
}
