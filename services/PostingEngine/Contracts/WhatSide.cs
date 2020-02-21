﻿using LP.Finance.Common.Models;
using PostingEngine.MarketData;
using System;
using System.Collections.Generic;

namespace PostingEngine.Extensions
{
    /// <summary>
    /// Helper functions to make determining the side of the transaction easier
    /// </summary>
    public static class TransactionExtensions
    {
        private static List<string> _derivativeTypes = new List<string> {
            "CROSS".ToLowerInvariant(),
            "FORWARD".ToLowerInvariant(),
            "Physical index future.".ToLowerInvariant(),
            "Equity Swap".ToLowerInvariant()
        };

        public static double FxRate(this Transaction element, PostingEngineEnvironment env)
        {
            var fxrate = !element.SettleCurrency.Equals(env.BaseCurrency) ? Convert.ToDouble(FxRates.Find(env, env.ValueDate, element.SettleCurrency).Rate) : 1.0;
            return fxrate;
        }

        public static double Multiplier(this Transaction element, PostingEngineEnvironment env)
        {
            var multiplier = 1.0;

            if (env.SecurityDetails.ContainsKey(element.BloombergCode))
                multiplier = env.SecurityDetails[element.BloombergCode].Multiplier;

            return multiplier;
        }

        public static bool IsDerivative(this Transaction element)
        {
            return _derivativeTypes.Contains(element.SecurityType.ToLowerInvariant());
        }

        public static bool IsBuy(this Transaction transaction)
        {
            return IsBuy(transaction.Side);
        }

        public static bool IsCredit(this Transaction transaction)
        {
            return IsCredit(transaction.Side);
        }

        public static bool IsDebit(this Transaction transaction)
        {
            return IsDebit(transaction.Side);
        }

        public static bool IsSell(this Transaction transaction)
        {
            return IsSell(transaction.Side);
        }

        public static bool IsShort(this Transaction transaction)
        {
            return IsShort(transaction.Side);
        }

        public static bool IsCover(this Transaction transaction)
        {
            return IsCover(transaction.Side);
        }

        public static bool IsBuy(this string side)
        {
            if (string.IsNullOrEmpty(side)) return false;
            return side.ToLowerInvariant().Equals(BUY);
        }

        public static bool IsSell(this string side)
        {
            if (string.IsNullOrEmpty(side)) return false;
            return side.ToLowerInvariant().Equals(SELL);
        }

        public static bool IsCredit(this string side)
        {
            if (string.IsNullOrEmpty(side)) return false;
            return side.ToLowerInvariant().Equals(CREDIT);
        }

        public static bool IsDebit(this string side)
        {
            if (string.IsNullOrEmpty(side)) return false;
            return side.ToLowerInvariant().Equals(DEBIT);
        }

        public static bool IsShort(this string side)
        {
            if (string.IsNullOrEmpty(side)) return false;
            return side.ToLowerInvariant().Equals(SHORT);
        }

        public static bool IsShort(this TaxLotStatus tls)
        {
            if (string.IsNullOrEmpty(tls.Side)) return false;
            return tls.Side.ToLowerInvariant().Equals(SHORT);
        }

        public static bool IsCover(this string side)
        {
            if (string.IsNullOrEmpty(side)) return false;
            return side.ToLowerInvariant().Equals(COVER);
        }

        public static string BUY = "buy";
        public static string SHORT = "short";

        public static string SELL = "sell";
        public static string COVER = "cover";

        public static string CREDIT = "credit";
        public static string DEBIT = "debit";

    }
}
