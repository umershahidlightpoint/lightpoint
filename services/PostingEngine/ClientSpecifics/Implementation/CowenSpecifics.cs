using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace PostingEngine.ClientSpecifics
{
    public class CowenSpecifics : IClientSpecifics
    {
        public Transaction[] Transform(Transaction[] trades)
        {
            // This is specific to BayBerry
            //var finalTradeList = trades.Where(t => t.TradeDate >= new DateTime(2019, 11, 1)).ToArray();

            var finalTradeList = trades;

            // Do not exclude the TEST BROKER TRades for the moment
            // finalTradeList = finalTradeList.Where(t => !t.ExecutionBroker.Equals("TEST BROKER")).ToArray();

            const bool DEBUG_TRADE_LIST = false;
            if (DEBUG_TRADE_LIST)
            {
                var securityTypeTags = new List<string> {
                    "FORWARD",
                    //"Equity Swap"
                    };

                var symbolTags = new List<string>
                {
                    //"NXT LN SWAP",
                    //"BGA AU SWAP",
                    //"GBP/USD 3/18/2020",
                    //"USD/CAD 3/18/2020"
                };

                if ( securityTypeTags.Count() > 0 )
                    finalTradeList = finalTradeList.Where(t => securityTypeTags.Contains(t.SecurityType)).ToArray();

                if (symbolTags.Count() > 0)
                    finalTradeList = finalTradeList.Where(t => symbolTags.Contains(t.Symbol)).ToArray();
            }

            var excludeTrade = new List<string>
                {
                };

            var includeTrade = new List<string>
                {
                };

            if (excludeTrade.Count() > 0)
                finalTradeList = finalTradeList.Where(t => !excludeTrade.Contains(t.LpOrderId)).ToArray();

            if ( includeTrade.Count() > 0)
                finalTradeList = finalTradeList.Where(t => includeTrade.Contains(t.LpOrderId)).ToArray();

            return finalTradeList;
        }
    }
}
