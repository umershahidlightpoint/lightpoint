using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Model
{
    public static class Event
    {
        public static string TRADE_DATE = "tradedate";
        public static string SETTLEMENT = "settlement";

        public static string REALIZED_PNL = "realizedpnl";
        public static string UNREALIZED_PNL = "unrealizedpnl";

        public static string SETTLED_CASH = "settled-cash";

        public static string JOURNAL = "journal";

    }
}
