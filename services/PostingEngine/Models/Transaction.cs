﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ConsoleApp1.Models
{
    public class Transaction
    {
        public string LpOrderId { get; set; }
        public string Action { get; set; }
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
    }
}
