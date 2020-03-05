using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.ClientSpecifics
{
    /// <summary>
    /// Used to isolate the trades that are to be processed, this will depend on client.  Each client will need to implement
    /// IClientSpecifics and add an entry in the config file, indicating which client it is.
    /// 
    /// Ideal this should be the name of the Class impletming the IClientSpefics, that needs to be implemented.
    /// </summary>
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

            // MAP DUE GR TO DUE GY
            var sec = finalTradeList.Where(t => t.Symbol.Equals("DUE GY")).FirstOrDefault();

            update = finalTradeList.Where(t => t.Symbol.Equals("DUE GR")).ToArray();
            foreach (var t in update) { t.Symbol = sec.Symbol; t.SecurityId = sec.SecurityId; }

            const bool DEBUG_TRADE_LIST = false;
            if (DEBUG_TRADE_LIST)
            {
                var securityTypeTags = new List<string> {
                    //"FORWARD",
                    //"Common Stock",
                    //"Equity Swap",
                    //"Journals",
                    //"Cash"
                    };

                var symbolTags = new List<string>
                {
                    //"TWE AU 05/30/19 P16.5",
                    "NLFSK DC",
                    //"WTE CN",
                    //"ALD FP",
                    //"GNS LN",
                    //"ROST",
                    //"AEO",
                    //"OSW",
                    "TOY CN",
                    "DF",
                    "HCSG",
                    "DLTR",
                    //"BURL",
                    //"9142 JP",
                    //"MC FP"
                    //"BGA AU SWAP",
                    //"MAREL NA",
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
                    // REAL
                    "32987dd4-1d47-4f93-8eed-2ff88e89547b",
                    "2bc838d5-a002-4970-8c80-b8a666ebb5cf",
                    "48f6696f-a007-48ec-92c7-f168a67e65a9",

                    // Others
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
