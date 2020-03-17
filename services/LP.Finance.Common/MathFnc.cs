using System;

namespace LP.Finance.Common
{
    public class MathFnc
    {
        public static decimal Truncate(decimal value, int decimals)
        {
            decimal factor = (decimal) Math.Pow(10, decimals);
            decimal result = Math.Truncate(factor * value) / factor;
            return result;
        }
    }
}