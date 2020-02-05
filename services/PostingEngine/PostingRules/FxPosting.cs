using LP.Finance.Common;
using LP.Finance.Common.Model;
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
        /// <param name="element">Transaction</param>
        /// <returns>a list of the created journal entries</returns>
        internal static List<Journal> CreateFx(PostingEngineEnvironment env,
            string fromAccount, 
            string toAccount,
            string tradeEvent,
            double quantity,
            TaxLotStatus taxlotStatus,
            Transaction element)
        {
            if (tradeEvent.Equals(Event.TRADE_DATE))
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

            var usdEquivalent = element.NetMoney * effectiveRate;

            if ( element.IsBuy())
            {
                usdEquivalent *= -1;
            }
            else if (element.IsShort())
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

        internal static List<Journal> CreateFx(PostingEngineEnvironment env,
    string tradeEvent,
    double quantity,
    TaxLotStatus taxlotStatus,
    Transaction element)
        {
            if ( element.LpOrderId.Equals("5686b2f0-b811-4614-b44d-5d0480370441"))
            {

            }

            if (tradeEvent.Equals(Event.TRADE_DATE))
                return new List<Journal>();

            var riskCurrency = element.SettleCurrency;

            if ( element.SecurityType.Equals("FORWARD"))
            {
                var split = element.Symbol.Split(new char[] { '/', ' ' });
                var baseCurrency = split[0];
                riskCurrency = split[1];
            }

            // Check to see if the BaseCurrency == SettleCurrency because if it is then no need to do the FX translation
            if (env.BaseCurrency.Equals(riskCurrency))
                return new List<Journal>();

            var prevPrice = Convert.ToDouble(MarketPrices.GetPrice(env, env.PreviousValueDate, element).Price);
            var eodPrice = Convert.ToDouble(MarketPrices.GetPrice(env, env.ValueDate, element).Price);

            var prevEodFxRate = Convert.ToDouble(FxRates.Find(env.PreviousValueDate, riskCurrency).Rate);
            var eodFxRate = Convert.ToDouble(FxRates.Find(env.ValueDate, riskCurrency).Rate);
            var effectiveRate = eodFxRate - prevEodFxRate;

            var usdEquivalent = element.Quantity * (eodPrice - prevPrice) * effectiveRate;

            var fromAccount = "Mark to Market Derivatives Contracts due to FX (Liabilities)";
            var toAccount = "Change in Unrealized Derivatives Contracts due to FX";

            if ( usdEquivalent > 0)
            {
                fromAccount = "Mark to Market Derivatives Contracts due to FX (Assets)";
            }

            // Get accounts
            var toFrom = new AccountUtils().GetAccounts(env, fromAccount, toAccount, _TAGS, element);

            var fund = env.GetFund(element);

            var debit = new Journal(element, toFrom.From, $"{tradeEvent}-unrealizedpnl-fx", env.ValueDate)
            {
                Quantity = quantity,
                FxRate = effectiveRate,
                StartPrice = prevEodFxRate,
                FxCurrency = riskCurrency,
                EndPrice = eodFxRate,
                Fund = fund,
                Value = env.SignedValue(toFrom.From, toFrom.To, true, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.From, usdEquivalent),
            };

            var credit = new Journal(element, toFrom.To, $"{tradeEvent}-unrealizedpnl-fx", env.ValueDate)
            {
                Quantity = quantity,
                FxRate = effectiveRate,
                FxCurrency = riskCurrency,
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = fund,

                Value = env.SignedValue(toFrom.From, toFrom.To, false, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.To, usdEquivalent),
            };


            return new List<Journal>(new[] { debit, credit });
        }

        internal double CreateFxUnsettled(PostingEngineEnvironment env, Transaction element)
        {
            var journals = new List<Journal>();

            // TBD: Needs to be optimized, get all data upfront for a ValueDate and drop into the env
            //env.CallBack?.Invoke($"Create Fx Unsettled {element.SettleCurrency} -- {element.LpOrderId}");

            var unsettledPnls = env.UnsettledPnl.Where(i => i.Source.Equals(element.LpOrderId)).ToList();

            var fxChange = 0.0;

            if ( unsettledPnls.Count() == 0 )
            {
                return 0.0;
            }

            var prevRate = FxRates.Find(env.PreviousValueDate, unsettledPnls[0].Currency).Rate;
            var eodRate = FxRates.Find(env.ValueDate, unsettledPnls[0].Currency).Rate;

            if ( element.SecurityType.Equals("FORWARD") || element.SecurityType.Equals("CROSS"))
            {
                prevRate = MarketPrices.GetPrice(env, env.PreviousValueDate, element).Price;
                eodRate = MarketPrices.GetPrice(env, env.ValueDate, element).Price;
            }

            unsettledPnls.ForEach(unsettledPnl => {
                

                var change = eodRate - prevRate;
                var fxCashCredit = change * (unsettledPnl.Credit / unsettledPnl.FxRate);
                var fxCashDebit = change * (unsettledPnl.Debit / unsettledPnl.FxRate);
                var fxCash = fxCashCredit - fxCashDebit;

                if (element.SecurityType.Equals("FORWARD") || element.SecurityType.Equals("CROSS"))
                {
                    var when = unsettledPnl.When;
                    var price = MarketPrices.GetPrice(env, when, element).Price;

                    if (price == 0.0)
                        price = 1;

                    fxCashCredit = change * (unsettledPnl.Credit / price);
                    fxCashDebit = change * (unsettledPnl.Debit / price);
                    fxCash = fxCashCredit - fxCashDebit;
                }

                var from = "";
                var to = "";

                if (element.IsDerivative())
                {
                    from = fxCash > 0 ? "Mark to Market Derivatives Contracts due to FX Translation (Assets)" : "Mark to Market Derivatives Contracts due to FX  Translation (Liabilities)";

                    if (from.Contains("(Liabilities)"))
                    {
                        fxCash *= -1;
                    }

                    to = "Change in Unrealized Derivatives Contracts due to FX Translation";
                }
                else
                {
                    var m2mtranslation = "Mark to Market longs fx translation gain or loss";
                    if (element.IsShort() || element.IsCover())
                        m2mtranslation = "Mark to Market shorts fx translation gain or loss";

                    from = m2mtranslation;
                    to = "change in unrealized do to fx translation";
                }

                // Get accounts
                var fromTo = new AccountUtils().GetAccounts(env, from, to, new string[] { unsettledPnl.Currency }.ToList());

                var debit = new Journal(fromTo.From, Event.UNREALIZED_FX_TRANSLATION, env.ValueDate)
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

                var credit = new Journal(fromTo.To, Event.UNREALIZED_FX_TRANSLATION, env.ValueDate)
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

        /// <summary>
        /// Create Fx entries for unrealizedpnl entries
        /// </summary>
        /// <param name="env"></param>
        /// <returns></returns>
        [Obsolete]
        internal void CreateFxUnsettled(PostingEngineEnvironment env)
        {
            var sql = $@"select credit, debit, symbol, quantity, fx_currency, fund, source, fxrate, security_id, side from vwWorkingJournals 
                         where [event] = 'unrealizedpnl' 
                         and AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)', 'Change in Unrealized Derivatives Contracts at Fair Value')
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
                    Side = reader.GetFieldValue<string>(9),
                };

                if (unsettledPnl.Currency.Equals(env.BaseCurrency))
                    continue;

                var prevRate = FxRates.Find(env.PreviousValueDate, unsettledPnl.Currency).Rate;
                var eodRate = FxRates.Find(env.ValueDate, unsettledPnl.Currency).Rate;

                var change = eodRate - prevRate;
                var fxCashCredit = change * (unsettledPnl.Credit / unsettledPnl.FxRate);
                var fxCashDebit = change * (unsettledPnl.Debit / unsettledPnl.FxRate);
                var fxCash = fxCashCredit - fxCashDebit;

                var m2mtranslation = "Mark to Market longs fx translation gain or loss";

                if (unsettledPnl.Side.ToLowerInvariant().Equals("short") || unsettledPnl.Side.ToLowerInvariant().Equals("cover"))
                    m2mtranslation = "Mark to Market shorts fx translation gain or loss";

                // Get accounts
                var fromTo = new AccountUtils().GetAccounts(env, m2mtranslation, "change in unrealized do to fx translation", new string[] { unsettledPnl.Currency }.ToList());

                var debit = new Journal(fromTo.From, Event.UNREALIZED_FX_TRANSLATION, env.ValueDate)
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

                var credit = new Journal(fromTo.To, Event.UNREALIZED_FX_TRANSLATION, env.ValueDate)
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
