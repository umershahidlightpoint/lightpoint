using LP.Finance.Common;
using LP.Finance.Common.Model;
using PostingEngine.Contracts;
using PostingEngine.MarketData;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using PostingEngine.Utilities;

namespace PostingEngine.PostingRules
{
    /*
     * Dealing with the Posting of Fx changes
     */
    internal class FxPosting
    {
        private readonly static List<Tag> _TAGS = new List<Tag> {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
            };

        internal static List<Journal> ReverseFxPosting(PostingEngineEnvironment env,
            string fromAccount,
            string toAccount,
            string tradeEvent,
            TaxLotStatus taxlotStatus,
            TaxLot closingTaxLot)
        {
            if (tradeEvent.Equals(Event.TRADE_DATE))
                return new List<Journal>();

            var element = closingTaxLot.Trade;
            var currency = element.SettleCurrency;

            // Check to see if the BaseCurrency == SettleCurrency because if it is then no need to do the FX translation
            if (env.BaseCurrency.Equals(currency))
                return new List<Journal>();

            var prevEodFxRate = Convert.ToDouble(FxRates.Find(env, env.PreviousValueDate, currency).Rate);
            var eodFxRate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, currency).Rate);
            var effectiveRate = eodFxRate - prevEodFxRate;


            var openQuantity = Math.Abs(closingTaxLot.Trade.Quantity);
            var closeQuantity = Math.Abs(closingTaxLot.Quantity);
            var percentage = closeQuantity / openQuantity;

            var closingTrade = env.FindTrade(closingTaxLot.ClosingLotId);

            var usdEquivalent = Math.Abs(closingTrade.NetMoney) * Math.Abs(effectiveRate);

            if (element.IsBuy())
            {
                if (effectiveRate < 0) // We are increasing what we owe so a debit ?
                {
                    usdEquivalent *= -1;
                }
            }
            else if (element.IsShort())
            {
                if (effectiveRate > 0)
                {
                    usdEquivalent *= -1;
                }
            }
            else if (element.IsCover())
            {
                usdEquivalent = element.NetMoney * effectiveRate;
            }
            else // SELL
            {
                usdEquivalent = element.NetMoney * effectiveRate;
            }

            // We are inverting so
            // usdEquivalent *= -1;

            usdEquivalent *= percentage;

            // Get accounts
            var toFrom = new AccountUtils().GetAccounts(env, fromAccount, toAccount, _TAGS, element);

            var debit = new Journal(taxlotStatus.Trade, toFrom.From, $"{tradeEvent}-unrealizedpnl-fx", env.ValueDate)
            {
                Quantity = closeQuantity,
                FxRate = effectiveRate,
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = env.GetFund(taxlotStatus.Trade),

                Value = AccountCategory.SignedValue(toFrom.From, toFrom.To, true, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.From, usdEquivalent),
            };

            var credit = new Journal(taxlotStatus.Trade, toFrom.To, $"{tradeEvent}-unrealizedpnl-fx", env.ValueDate)
            {
                Quantity = closeQuantity,
                FxRate = effectiveRate,
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = env.GetFund(taxlotStatus.Trade),

                Value = AccountCategory.SignedValue(toFrom.From, toFrom.To, false, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.To, usdEquivalent),
            };


            return new List<Journal>(new[] { debit, credit });

        }

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
            Transaction element,
            bool invert = false)
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

            var prevEodFxRate = Convert.ToDouble(FxRates.Find(env, env.PreviousValueDate, currency).Rate);
            var eodFxRate = Convert.ToDouble(FxRates.Find(env, env.ValueDate, currency).Rate);
            var effectiveRate = eodFxRate - prevEodFxRate;

            var usdEquivalent = Math.Abs(element.NetMoney) * Math.Abs(effectiveRate);

            if ( element.IsBuy())
            {
                if ( effectiveRate < 0 ) // We are increasing what we owe so a debit ?
                {
                    usdEquivalent *= -1;
                }
                else
                {
                }
            }
            else if ( element.IsShort())
            {
                if (effectiveRate > 0)
                {
                    usdEquivalent *= -1;
                }
                else
                {
                }
            } else
            {
                // No Idea
                if ( element.IsSell() || element.IsCover())
                {
                    usdEquivalent = element.NetMoney * effectiveRate * -1;
                }
            }

            if (invert)
                usdEquivalent *= -1;

            // Get accounts
            var toFrom = new AccountUtils().GetAccounts(env, fromAccount, toAccount, _TAGS, element);

            var debit = new Journal(element, toFrom.From, $"{tradeEvent}-unrealizedpnl-fx", env.ValueDate)
            {
                Quantity = quantity,
                FxRate = effectiveRate,
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = env.GetFund(element),

                Value = AccountCategory.SignedValue(toFrom.From, toFrom.To, true, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.From, usdEquivalent),
            };

            var credit = new Journal(element, toFrom.To, $"{tradeEvent}-unrealizedpnl-fx", env.ValueDate)
            {
                Quantity = quantity,
                FxRate = effectiveRate,
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = env.GetFund(element),

                Value = AccountCategory.SignedValue(toFrom.From, toFrom.To, false, usdEquivalent),
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

            var prevRate = FxRates.Find(env, env.PreviousValueDate, unsettledPnls[0].Currency).Rate;
            var eodRate = FxRates.Find(env, env.ValueDate, unsettledPnls[0].Currency).Rate;

            if ( element.SecurityType.Equals("FORWARD") || element.SecurityType.Equals("CROSS"))
            {
                prevRate = MarketPrices.GetPrice(env, env.PreviousValueDate, element).Price;
                eodRate = MarketPrices.GetPrice(env, env.ValueDate, element).Price;
            }

            unsettledPnls.ForEach(unsettledPnl => {
                

                var change = eodRate - prevRate;
                var fxCashCredit = change * (unsettledPnl.LocalCredit);
                var fxCashDebit = change * (unsettledPnl.LocalDebit);
                var fxCash = fxCashCredit - fxCashDebit;

                if (element.SecurityType.Equals("FORWARD") || element.SecurityType.Equals("CROSS"))
                {
                    var when = unsettledPnl.When;
                    var price = MarketPrices.GetPrice(env, when, element).Price;

                    if (price == 0.0)
                        price = 1;

                    fxCashCredit = change * (unsettledPnl.Credit / price);
                    fxCashDebit = change * (unsettledPnl.Debit / price);
                    fxCash = fxCashDebit - fxCashCredit;
                }

                var from = "";
                var to = "";

                if (element.IsDerivative())
                {
                    from = fxCash > 0 ? AccountType.M2M_DERIVATIVES_FXTRANSLATION_ASSETS : AccountType.M2M_DERIVATIVES_FXTRANSLATION_LIABILITIES;

                    if (from.Contains("(Liabilities)"))
                    {
                        fxCash *= -1;
                    }

                    to = AccountType.CUDCFX_TRANSLATION;

                }
                else
                {
                    var m2mtranslation = AccountType.M2M_LONGS_FXTRANSLATION;
                    if (element.IsShort() || element.IsCover())
                        m2mtranslation = AccountType.M2M_SHORTS_FXTRANSLATION;

                    from = m2mtranslation;
                    to = AccountType.CHANGE_UNREALIZED_FXTRANSLATION;

                    if (element.IsShort())
                        fxCash *= -1;
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

                    Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, true, fxCash),
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

                    Value = AccountCategory.SignedValue(fromTo.From, fromTo.To, false, fxCash),
                    CreditDebit = env.DebitOrCredit(fromTo.To, fxCash),
                };

                journals.AddRange(new List<Journal>(new[] { debit, credit }));
            });

            //connection.Close();
            env.Journals.AddRange(journals);

            return fxChange;
        }
    }
}
