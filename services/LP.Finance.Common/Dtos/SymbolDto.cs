using LP.Shared;
using LP.Shared.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
    public interface IElement
    {
        bool Find(object value);

        int Id { get; }
    }

    public class SymbolDto : IElement
    {
        public int SecurityId { get; set; }
        public string SecurityCode { get; set; }
        public string EzeTicker { get; set; }
        public string BbergCode { get; set; }
        public string PricingSymbol { get; set; }
        public int Id { get => SecurityId; }

        private string ValueOf(string value)
        {
            if (String.IsNullOrEmpty(value)) return String.Empty;
            return value;
        }

        public bool IsValid(string securityCode)
        {
            if (ValueOf(PricingSymbol).Equals(securityCode))
                return true;

            if (ValueOf(EzeTicker).Equals(securityCode))
                return true;

            if (ValueOf(BbergCode).Equals(securityCode))
                return true;

            if (ValueOf(SecurityCode).Equals(securityCode))
                return true;

            return false;
        }

        public bool Find(object value)
        {
            return IsValid(value as String);
        }

        public static Tuple<object, bool, string> IsValidSymbol(object value, string format = null, string type = null)
        {
            var symbolMap = AppStartCache.GetCachedData("symbol");
            var exception = "";
            var valid = true;
            var symbolValue = (string)value;
            if (symbolMap.Item1)
            {
                var symbol = (Dictionary<IElement, int>)symbolMap.Item2;
                var find = symbol.Keys.Where(i => i.Find(symbolValue));

                if (find.Count() > 0)
                {
                    valid = true;
                    return new Tuple<object, bool, string>(value, valid, exception);
                }
                else
                {
                    valid = false;
                    exception = "Invalid symbol";
                    return new Tuple<object, bool, string>(value, valid, exception);
                }
            }
            else
            {
                valid = false;
                exception = "Data not found to validate symbol";
                return new Tuple<object, bool, string>(value, valid, exception);
            }
        }

        public static Tuple<object, bool, string> IsValidCurrency(object value, string format, string type)
        {
            var currencyMap = AppStartCache.GetCachedData("currency");
            var exception = "";
            var valid = true;
            var currencyValue = (string)value;
            if (currencyMap.Item1)
            {
                var currency = (Dictionary<string, string>)currencyMap.Item2;
                if (currency.ContainsKey(currencyValue))
                {
                    valid = true;
                    return new Tuple<object, bool, string>(value, valid, exception);
                }
                else
                {
                    valid = false;
                    exception = "Invalid currency";
                    return new Tuple<object, bool, string>(value, valid, exception);
                }
            }
            else
            {
                valid = false;
                exception = "Data not found to validate currency";
                return new Tuple<object, bool, string>(value, valid, exception);
            }
        }

    }
}
