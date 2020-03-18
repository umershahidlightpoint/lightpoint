﻿using LP.Shared.Cache;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace LP.Shared.FileProcessing
{
    public class FileProcessingUtils
    {
        public static Tuple<object, bool, string> GetDate(object value, string format, string type)
        {
            string exception = null;
            bool valid = true;
            DateTime? date = null;
            string convertedDate;
            if (value != null)
            {
                try
                {
                    if (value is string)
                    {
                        date = Convert.ToDateTime(value);
                    }
                    else if (value is DateTime)
                    {
                        date = (DateTime)value;
                    }
                }
                catch (Exception ex)
                {
                    valid = false;
                    exception = ex.Message;
                    return new Tuple<object, bool, string>(null, valid, exception);
                }

                try
                {
                    convertedDate = date.Value.ToString(format);
                }
                catch (Exception ex)
                {
                    valid = false;
                    exception = ex.Message;
                    return new Tuple<object, bool, string>(null, valid, exception);
                }

                return new Tuple<object, bool, string>(convertedDate, valid, exception);
            }
            else
            {
                return new Tuple<object, bool, string>(null, valid, exception);
            }
        }

        public static Tuple<object, bool, string> LongShortConversion(object value, string format = null, string type = null)
        {
            bool valid = true;
            string exception = "";
            var position = (string)value;
            if (position != null)
            {
                if (position.ToLower() == "long")
                {
                    return new Tuple<object, bool, string>(true, valid, exception);
                }
                else if (position.ToLower() == "short")
                {
                    return new Tuple<object, bool, string>(false, valid, exception);
                }
                else
                {
                    valid = false;
                    exception = "Allowed values are long and short only";
                    return new Tuple<object, bool, string>(null, valid, exception);
                }
            }
            else
            {
                return new Tuple<object, bool, string>(null, valid, exception);
            }
        }

        public static Tuple<object, bool, string> CheckFormat(object value, string format, string type)
        {
            bool valid = true;
            string exception = "";
            if (type == "decimal")
            {
                string val = Convert.ToString(value);
                string[] parsedVal = val.Split('.');
                string[] numeric = format.Split(',');
                int wholeNumberLength = Convert.ToInt32(numeric[0]);
                int decimalNumberLength = Convert.ToInt32(numeric[1]);
                int validWholeNumber = wholeNumberLength - decimalNumberLength;

                if (parsedVal.ElementAtOrDefault(0) != null && parsedVal.ElementAt(0).Length > validWholeNumber)
                {
                    valid = false;
                    exception = "Whole number part contains " +
                                $"{parsedVal.ElementAt(0).Length} digit(s). Only {validWholeNumber} digit(s) are allowed";
                }
                else if (parsedVal.ElementAtOrDefault(1) != null && parsedVal.ElementAt(1).Length > decimalNumberLength)
                {
                    valid = false;
                    exception = "Decimal part contains " +
                                $"{parsedVal.ElementAt(1).Length} digit(s). Only {decimalNumberLength} digit(s) are allowed";
                }
            }
            else if (type == "char")
            {
                string val = (string)value;
                if (val != null)
                {
                    int length = Convert.ToInt32(format);
                    if (val.Length > length)
                    {
                        exception = "Value contains " +
                                    $"{val.Length} character(s). Only {length} character(s) are allowed";
                        valid = false;
                    }
                }
            }

            return new Tuple<object, bool, string>(value, valid, exception);
        }

        public static Tuple<object, bool, string> IsValidSymbol(object value)
        {
            var symbolMap = AppStartCache.GetCachedData("symbol");
            var exception = "";
            var valid = true;
            var symbolValue = (string)value;
            if (symbolMap.Item1)
            {
                var symbol = (Dictionary<string, int>)symbolMap.Item2;
                if (symbol.ContainsKey(symbolValue))
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

        public static Tuple<object, bool, string> IsValidCurrency(object value)
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
