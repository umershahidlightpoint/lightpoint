using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LP.Finance.Common.Models;

namespace LP.Finance.Common.Model
{
    public static class Event
    {
        public static readonly string UNREALIZED_CASH_FX = "unrealized-cash-fx";

        public static readonly string REALIZED_CASH_FX = "realized-cash-fx";

        public static readonly string UNREALIZED_FX_TRANSLATION = "unrealized-fx-translation";

        public static readonly string TRADE_DATE = "tradedate";
        public static readonly string SETTLEMENT = "settlement";

        public static readonly string REALIZED_PNL = "realizedpnl";

        [Obsolete]
        public static readonly string UNREALIZED_PNL = "unrealizedpnl";

        public static readonly string DAILY_UNREALIZED_PNL = "daily-unrealizedpnl";
        public static readonly string REVERSE_UNREALIZED_PNL = "reverse-unrealizedpnl";

        public static readonly string CASH_PAYMENT = "cash-payment";


        public static readonly string SETTLED_CASH = "settled-cash";

        public static readonly string JOURNAL = "journal";

        // Year End CloseOut
        public static readonly string YEAR_END = "year-end";

        // DIVIDENDS
        public static readonly string DIVIDEND = "dividend";
    }
}
