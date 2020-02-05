using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.ClientSpecifics
{
    public class BayberrySpecifics : IClientSpecifics
    {
        public Transaction[] Transform(Transaction[] trades)
        {
            // This is specific to BayBerry
            var finalTradeList = trades.Where(t => t.TradeDate >= new DateTime(2019, 4, 1)).ToArray();

            //var finalTradeList = localTradeList.ToArray();

            // THis is required for MSUXX as we have a mix of both Cash / Open-end fund
            var update = finalTradeList.Where(t => t.Symbol.Equals("MSUXX")).ToArray();
            foreach (var t in update) { t.SecurityType = "Open-End Fund"; }

            // REALLY REALLY HACKY
            update = finalTradeList.Where(t => t.Symbol.Equals("TWE AU EQUITY SWAP")).ToArray();
            foreach (var t in update) { t.Symbol = "TWE AU SWAP"; t.SecurityId = 32669; }

            var sec = finalTradeList.Where(t => t.Symbol.Equals("DUE GY")).FirstOrDefault();

            update = finalTradeList.Where(t => t.Symbol.Equals("DUE GR")).ToArray();
            foreach (var t in update) { t.Symbol = sec.Symbol; t.SecurityId = sec.SecurityId; }

            const bool DEBUG_TRADE_LIST = true;
            if (DEBUG_TRADE_LIST)
            {
                var securityTypeTags = new List<string> {
                    //"FORWARD",
                    "Equity Swap"
                    };

                var symbolTags = new List<string>
                {
                    //"BGA AU SWAP",
                    //"GIL",
                    //"LW",
                    //"GBP/USD 12/18/2019",
                    //"USD/CAD 3/18/2020"
                };

                if ( securityTypeTags.Count() > 0 )
                    finalTradeList = finalTradeList.Where(t => securityTypeTags.Contains(t.SecurityType)).ToArray();

                if (symbolTags.Count() > 0)
                    finalTradeList = finalTradeList.Where(t => symbolTags.Contains(t.Symbol)).ToArray();
            }

            var excludeTrade = new List<string>
                {
                    "ae551383-1c97-42e9-8650-0785ed20044f",
                    "aa17610f-5403-4bd4-99c5-4100126aa655",
                    "a213f4f3-2e5f-4529-8f7c-a2e7d4b4368a"
                };

            var includeTrade = new List<string>
                {
                    //"0b9749d1-abe6-4bab-ad7d-65dccf17017b"
                };

            finalTradeList = finalTradeList.Where(t => !excludeTrade.Contains(t.LpOrderId)).ToArray();

            if ( includeTrade.Count() > 0)
                finalTradeList = finalTradeList.Where(t => includeTrade.Contains(t.LpOrderId)).ToArray();

            return finalTradeList;
        }
    }
}
