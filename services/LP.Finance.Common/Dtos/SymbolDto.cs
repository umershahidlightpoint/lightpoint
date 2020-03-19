using LP.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Dtos
{
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
    }
}
