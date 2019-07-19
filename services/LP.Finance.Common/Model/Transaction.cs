using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Models
{
    public class Transaction
    {
        public string LpOrderId { get; set; }
        public string Action { get; set; }
        public string TradeCurrency { get; set; }
        public string SettleCurrency { get; set; }
        public double OrderedQuantity { get; set; }
        public double FilledQuantity { get; set; }
        public string TradeType { get; set; }
        public string OrderSource { get; set; }
        public double TradePrice { get; set; }
        public double NetPrice { get; set; }
        public double SettleNetPrice { get; set; }
        //public double LocalNetNotional { get; set; }
        //public double ContractSize { get; set; }

        public string Symbol { get; set; }
        public string Side { get; set; }
        public double Quantity { get; set; }
        public string SecurityType { get; set; }

        // Determines the Bank
        public string CustodianCode { get; set; }

        public string ExecutionBroker { get; set; }
        public string TradeId { get; set; }
        public string Fund { get; set; }
        public string PMCode { get; set; }
        public string PortfolioCode { get; set; }

        public DateTime TradeDate { get; set; }
        public DateTime SettlementDate { get; set; }

        public double Commission { get; set; }
        public double Fees { get; set; }
        public string Status { get; set; }
        public string TransactionType { get; set; }

        public string Long
        {
            get
            {
                if (Quantity < 0) return "Long";
                return "Short";
            }
        }
    }
}
