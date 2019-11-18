using LP.Finance.Common.Models;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.PostingRules
{
    internal class CommonRules
    {
        /// <summary>
        /// Create the entries for Unsettled Fx gain / loss
        /// </summary>
        /// <param name="env">Environment</param>
        /// <param name="taxlotStatus"></param>
        /// <param name="tradeEvent"></param>
        /// <param name="notional">Local Currency</param>
        /// <param name="element">Transaction</param>
        /// <returns>a list of the created journal entries</returns>
        internal List<Journal> CreateFx(PostingEngineEnvironment env, 
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

            var currency = element.SettleCurrency;

            var prevEodFxRate = Convert.ToDouble(env.PrevFxRates[currency].Rate);
            var eodFxRate = Convert.ToDouble(env.EODFxRates[currency].Rate);

            var effectiveRate = eodFxRate - prevEodFxRate;
            if (effectiveRate == 0)
                return new List<Journal>();

            var usdEquivalent = notional * effectiveRate;

            var tags = new List<Tag> {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
            };

            // Get accounts
            var toFrom = GetAccounts(env, "DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )", "fx gain or loss on unsettled balance", tags, element);

            var debit = new Journal(toFrom.From, "unrealizedpnl-fx", env.ValueDate)
            {
                Source = element.LpOrderId,
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                Quantity = quantity,
                FxRate = effectiveRate,
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = element.Fund,

                Value = env.SignedValue(toFrom.From, toFrom.To, true, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.From, usdEquivalent),
            };

            var credit = new Journal(toFrom.To, "unrealizedpnl-fx", env.ValueDate)
            {
                Source = element.LpOrderId,
                FxCurrency = element.SettleCurrency,
                FxRate = effectiveRate,
                Symbol = element.Symbol,
                Quantity = quantity,
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = element.Fund,

                Value = env.SignedValue(toFrom.From, toFrom.To, false, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.To, usdEquivalent),
            };


            return new List<Journal>(new[] { debit, credit });
        }

        internal AccountToFrom GetAccounts(PostingEngineEnvironment env, string fromType, string toType, List<Tag> tags, Transaction element)
        {
            var fromAccount = new AccountUtils().CreateAccount(AccountType.Find(fromType), tags, element);
            var toAccount = new AccountUtils().CreateAccount(AccountType.Find(toType), tags, element);

            new AccountUtils().SaveAccountDetails(env, fromAccount);
            new AccountUtils().SaveAccountDetails(env, toAccount);

            return new AccountToFrom { From = fromAccount, To = toAccount };
        }

        internal AccountToFrom GetAccounts(PostingEngineEnvironment env, string fromType, string toType, List<string> tags)
        {
            var fromAccount = new AccountUtils().CreateAccount(AccountType.Find(fromType), tags);
            var toAccount = new AccountUtils().CreateAccount(AccountType.Find(toType), tags);

            new AccountUtils().SaveAccountDetails(env, fromAccount);
            new AccountUtils().SaveAccountDetails(env, toAccount);

            return new AccountToFrom { From = fromAccount, To = toAccount };
        }

    }
}
