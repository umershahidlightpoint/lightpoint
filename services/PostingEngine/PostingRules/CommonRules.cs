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
        /// Create the entries for Fx gain / loss
        /// </summary>
        /// <param name="env">Environment</param>
        /// <param name="taxlotStatus"></param>
        /// <param name="tradeEvent"></param>
        /// <param name="pnl">Local Currency Pnl</param>
        /// <param name="element">Transaction</param>
        /// <returns>a list of the created journal entries</returns>
        internal List<Journal> CreateFx(PostingEngineEnvironment env, 
            string tradeEvent, 
            double pnl, 
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

            var usdEquivalent = pnl * effectiveRate;

            var tags = new List<Tag> {
                Tag.Find("SecurityType"),
                Tag.Find("CustodianCode")
            };

            // Get accounts
            var toFrom = GetAccounts(env, "DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )", "fx gain or loss on unsettled balance", tags, element);

            var debit = new Journal
            {
                Source = element.LpOrderId,
                Account = toFrom.From,
                When = env.ValueDate,
                FxCurrency = element.SettleCurrency,
                Symbol = element.Symbol,
                Quantity = quantity,
                FxRate = effectiveRate,
                Value = env.SignedValue(toFrom.From, toFrom.To, true, usdEquivalent),
                StartPrice = prevEodFxRate,
                CreditDebit = env.DebitOrCredit(toFrom.From, usdEquivalent),
                EndPrice = eodFxRate,
                Event = "unrealizedpnl-fx",
                Fund = element.Fund,
            };

            var credit = new Journal
            {
                Source = element.LpOrderId,
                Account = toFrom.To,
                When = env.ValueDate,
                FxCurrency = element.SettleCurrency,
                FxRate = effectiveRate,
                Symbol = element.Symbol,
                Quantity = quantity,
                Value = env.SignedValue(toFrom.From, toFrom.To, false, usdEquivalent),
                CreditDebit = env.DebitOrCredit(toFrom.To, usdEquivalent),
                Event = "unrealizedpnl-fx",
                StartPrice = prevEodFxRate,
                EndPrice = eodFxRate,
                Fund = element.Fund,
            };


            return new List<Journal>(new[] { debit, credit });
        }

        AccountToFrom GetAccounts(PostingEngineEnvironment env, string from, string toType, List<Tag> tags, Transaction element)
        {
            var fromAccount = new AccountUtils().CreateAccount(AccountType.Find(from), tags, element);
            var toAccount = new AccountUtils().CreateAccount(AccountType.Find(toType), tags, element);

            new AccountUtils().SaveAccountDetails(env, fromAccount);
            new AccountUtils().SaveAccountDetails(env, toAccount);

            return new AccountToFrom { From = fromAccount, To = toAccount };
        }
    }
}
