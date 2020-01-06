using LP.Finance.Common;
using LP.Finance.Common.Models;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.PostingRules
{
    /*
     * Dealing with the Posting of Fx changes
     */
    internal class FxPosting
    {
        private static List<Tag> _TAGS = new List<Tag> {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
            };

        /// <summary>
        /// Create the entries for Unsettled Fx gain / loss
        /// </summary>
        /// <param name="env">Environment</param>
        /// <param name="taxlotStatus"></param>
        /// <param name="tradeEvent"></param>
        /// <param name="notional">Local Currency</param>
        /// <param name="element">Transaction</param>
        /// <returns>a list of the created journal entries</returns>
        internal static List<Journal> CreateFx(PostingEngineEnvironment env,
            string fromAccount, 
            string toAccount,
            string tradeEvent,
            double notional,
            double quantity,
            TaxLotStatus taxlotStatus,
            Transaction element)
        {
            if (tradeEvent.Equals("tradedate"))
                return new List<Journal>();

            // TBD: THIS IS FOR BOBBY
            if (element.SecurityType.Equals("FORWARD"))
                return new List<Journal>();

            // Check to see if the BaseCurrency == SettleCurrency because if it is then no need to do the FX translation
            if ( env.BaseCurrency.Equals(element.SettleCurrency))
                return new List<Journal>();

            var currency = element.SettleCurrency;

            var prevEodFxRate = Convert.ToDouble(FxRates.Find(env.PreviousValueDate, currency).Rate);
            var eodFxRate = Convert.ToDouble(FxRates.Find(env.ValueDate, currency).Rate);
            var effectiveRate = eodFxRate - prevEodFxRate;

            var usdEquivalent = Math.Abs(notional) * effectiveRate;

            if ( element.IsBuy() || element.IsShort())
            {
                usdEquivalent *= -1;
            }
            else
            {

            }

            // Get accounts
            var toFrom = new AccountUtils().GetAccounts(env, fromAccount, toAccount, _TAGS, element);

            var debit = new Journal(element, toFrom.From, $"{tradeEvent}-unrealizedpnl-fx", env.ValueDate)
            {
                Quantity = quantity,
                FxRate = effectiveRate,
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = env.GetFund(element),
                Value = env.SignedValue(toFrom.From, toFrom.To, true, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.From, usdEquivalent),
            };

            var credit = new Journal(element, toFrom.To, $"{tradeEvent}-unrealizedpnl-fx", env.ValueDate)
            {
                Quantity = quantity,
                FxRate = effectiveRate,
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = env.GetFund(element),

                Value = env.SignedValue(toFrom.From, toFrom.To, false, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.To, usdEquivalent),
            };


            return new List<Journal>(new[] { debit, credit });
        }

        private static SqlConnection _connection;

        internal double CreateFxUnsettled(PostingEngineEnvironment env, Transaction element)
        {
            var journals = new List<Journal>();

            // TBD: Needs to be optimized, get all data upfront for a ValueDate and drop into the env
            //env.CallBack?.Invoke($"Create Fx Unsettled {element.SettleCurrency} -- {element.LpOrderId}");

            var unsettledPnls = env.UnsettledPnl.Where(i => i.Source.Equals(element.LpOrderId)).ToList();

            var fxChange = 0.0;

            unsettledPnls.ForEach(unsettledPnl => {
                var prevRate = FxRates.Find(env.PreviousValueDate, unsettledPnl.Currency).Rate;
                var eodRate = FxRates.Find(env.ValueDate, unsettledPnl.Currency).Rate;

                var change = eodRate - prevRate;
                var fxCashCredit = change * (unsettledPnl.Credit / unsettledPnl.FxRate);
                var fxCashDebit = change * (unsettledPnl.Debit / unsettledPnl.FxRate);
                var fxCash = fxCashCredit - fxCashDebit;

                // Get accounts
                var fromTo = new AccountUtils().GetAccounts(env, "Mark to Market longs fx translation gain or loss", "change in unrealized do to fx translation", new string[] { unsettledPnl.Currency }.ToList());

                var debit = new Journal(fromTo.From, "unrealized-cash-fx", env.ValueDate)
                {
                    Source = unsettledPnl.Source,
                    Fund = unsettledPnl.Fund,
                    FxCurrency = unsettledPnl.Currency,
                    Symbol = unsettledPnl.Symbol,
                    SecurityId = unsettledPnl.SecurityId,
                    Quantity = Convert.ToDouble(unsettledPnl.Quantity),

                    FxRate = change,
                    StartPrice = prevRate,
                    EndPrice = eodRate,

                    Value = env.SignedValue(fromTo.From, fromTo.To, true, fxCash),
                    CreditDebit = env.DebitOrCredit(fromTo.From, fxCash),
                };

                fxChange += debit.Value;

                var credit = new Journal(fromTo.To, "unrealized-cash-fx", env.ValueDate)
                {
                    Source = unsettledPnl.Source,
                    Fund = unsettledPnl.Fund,
                    FxCurrency = unsettledPnl.Currency,
                    Symbol = unsettledPnl.Symbol,
                    SecurityId = unsettledPnl.SecurityId,
                    Quantity = Convert.ToDouble(unsettledPnl.Quantity),

                    FxRate = change,
                    StartPrice = prevRate,
                    EndPrice = eodRate,

                    Value = env.SignedValue(fromTo.From, fromTo.To, false, fxCash),
                    CreditDebit = env.DebitOrCredit(fromTo.To, fxCash),
                };

                journals.AddRange(new List<Journal>(new[] { debit, credit }));
            });

            //connection.Close();
            env.Journals.AddRange(journals);

            return fxChange;
        }

        internal void CreateFxUnsettledEx(PostingEngineEnvironment env, Transaction element)
        {
            var journals = new List<Journal>();

            // TBD: Needs to be optimized, get all data upfront for a ValueDate and drop into the env
            //env.CallBack?.Invoke($"Create Fx Unsettled {element.SettleCurrency} -- {element.LpOrderId}");

            var sql = $@"select credit, debit, symbol, quantity, fx_currency, fund, source, fxrate, security_id from vwJournal 
                         where [event] = 'unrealizedpnl' 
                         and AccountType = 'CHANGE IN UNREALIZED GAIN/(LOSS)' 
                         and fx_currency != '{env.BaseCurrency}'
                         and [when] < '{env.ValueDate.ToString("MM-dd-yyyy")}'
                         and [source] = '{element.LpOrderId}'";

            if (_connection == null)
            {
                _connection = new SqlConnection(env.ConnectionString);
                _connection.Open();
            }
            var command = new SqlCommand(sql, _connection);
            //command.Transaction = env.Transaction;
            var reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                var unsettledPnl = new
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

                var prevRate = FxRates.Find(env.PreviousValueDate, unsettledPnl.Currency).Rate;
                var eodRate = FxRates.Find(env.ValueDate, unsettledPnl.Currency).Rate;

                var change = eodRate - prevRate;
                var fxCashCredit = change * (unsettledPnl.Credit / unsettledPnl.FxRate);
                var fxCashDebit = change * (unsettledPnl.Debit / unsettledPnl.FxRate);
                var fxCash = fxCashCredit - fxCashDebit;

                // Get accounts
                var fromTo = new AccountUtils().GetAccounts(env, "Mark to Market longs fx translation gain or loss", "change in unrealized do to fx translation", new string[] { unsettledPnl.Currency }.ToList());

                var debit = new Journal(fromTo.From, "unrealized-cash-fx", env.ValueDate)
                {
                    Source = unsettledPnl.Source,
                    Fund = unsettledPnl.Fund,
                    FxCurrency = unsettledPnl.Currency,
                    Symbol = unsettledPnl.Symbol,
                    SecurityId = unsettledPnl.SecurityId,
                    Quantity = Convert.ToDouble(unsettledPnl.Quantity),

                    FxRate = change,
                    StartPrice = prevRate,
                    EndPrice = eodRate,

                    Value = env.SignedValue(fromTo.From, fromTo.To, true, fxCash),
                    CreditDebit = env.DebitOrCredit(fromTo.From, fxCash),
                };

                var credit = new Journal(fromTo.To, "unrealized-cash-fx", env.ValueDate)
                {
                    Source = unsettledPnl.Source,
                    Fund = unsettledPnl.Fund,
                    FxCurrency = unsettledPnl.Currency,
                    Symbol = unsettledPnl.Symbol,
                    SecurityId = unsettledPnl.SecurityId,
                    Quantity = Convert.ToDouble(unsettledPnl.Quantity),

                    FxRate = change,
                    StartPrice = prevRate,
                    EndPrice = eodRate,

                    Value = env.SignedValue(fromTo.From, fromTo.To, false, fxCash),
                    CreditDebit = env.DebitOrCredit(fromTo.To, fxCash),
                };

                journals.AddRange(new List<Journal>(new[] { debit, credit }));
            }
            reader.Close();

            //connection.Close();
            env.Journals.AddRange(journals);
        }

        /// <summary>
        /// Create Fx entries for unrealizedpnl entries
        /// </summary>
        /// <param name="env"></param>
        /// <returns></returns>
        internal void CreateFxUnsettled(PostingEngineEnvironment env)
        {
            var sql = $@"select credit, debit, symbol, quantity, fx_currency, fund, source, fxrate, security_id from vwJournal 
                         where [event] = 'unrealizedpnl' 
                         and AccountType = 'CHANGE IN UNREALIZED GAIN/(LOSS)' 
                         and fx_currency != '{env.BaseCurrency}'
                         and [when] < '{env.ValueDate.ToString("MM-dd-yyyy")}'";

            env.CallBack?.Invoke("FX for Mark to Market Calculation Started");

            var connection = new SqlConnection(env.ConnectionString);
            connection.Open();
            var command = new SqlCommand(sql, connection);
            command.Transaction = env.Transaction;
            var reader = command.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                var unsettledPnl = new
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

                if (unsettledPnl.Currency.Equals(env.BaseCurrency))
                    continue;

                var prevRate = FxRates.Find(env.PreviousValueDate, unsettledPnl.Currency).Rate;
                var eodRate = FxRates.Find(env.ValueDate, unsettledPnl.Currency).Rate;

                var change = eodRate - prevRate;
                var fxCashCredit = change * (unsettledPnl.Credit / unsettledPnl.FxRate);
                var fxCashDebit = change * (unsettledPnl.Debit / unsettledPnl.FxRate);
                var fxCash = fxCashCredit - fxCashDebit;
                
                // Get accounts
                var fromTo = new AccountUtils().GetAccounts(env, "Mark to Market longs fx translation gain or loss", "change in unrealized do to fx translation", new string[] { unsettledPnl.Currency }.ToList());

                var debit = new Journal(fromTo.From, "unrealized-cash-fx", env.ValueDate)
                {
                    Source = unsettledPnl.Source,
                    Fund = unsettledPnl.Fund,
                    FxCurrency = unsettledPnl.Currency,
                    Symbol = unsettledPnl.Symbol,
                    SecurityId = unsettledPnl.SecurityId,
                    Quantity = Convert.ToDouble(unsettledPnl.Quantity),

                    FxRate = change,
                    StartPrice = prevRate,
                    EndPrice = eodRate,

                    Value = env.SignedValue(fromTo.From, fromTo.To, true, fxCash),
                    CreditDebit = env.DebitOrCredit(fromTo.From, fxCash),
                };

                var credit = new Journal(fromTo.To, "unrealized-cash-fx", env.ValueDate)
                {
                    Source = unsettledPnl.Source,
                    Fund = unsettledPnl.Fund,
                    FxCurrency = unsettledPnl.Currency,
                    Symbol = unsettledPnl.Symbol,
                    SecurityId = unsettledPnl.SecurityId,
                    Quantity = Convert.ToDouble(unsettledPnl.Quantity),

                    FxRate = change,
                    StartPrice = prevRate,
                    EndPrice = eodRate,

                    Value = env.SignedValue(fromTo.From, fromTo.To, false, fxCash),
                    CreditDebit = env.DebitOrCredit(fromTo.To, fxCash),
                };
                env.Journals.AddRange(new List<Journal>(new[] { debit, credit }));


            }

            connection.Close();
        }
    }
}
