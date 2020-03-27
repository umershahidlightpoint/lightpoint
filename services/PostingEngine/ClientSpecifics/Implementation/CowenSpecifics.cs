using System.Collections.Generic;
using System.Linq;
using LP.Finance.Common.Model;

namespace PostingEngine.ClientSpecifics.Implementation
{
    public class CowenSpecifics : IClientSpecifics
    {
        public Transaction[] Transform(Transaction[] trades)
        {
            var finalTradeList = trades;

            const bool DEBUG_TRADE_LIST = true;
            if (DEBUG_TRADE_LIST)
            {
                var securityTypeTags = new List<string> {
                    //"FORWARD",
                    "Journals",
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
