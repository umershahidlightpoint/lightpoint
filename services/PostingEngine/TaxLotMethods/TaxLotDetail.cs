using LP.Finance.Common.Models;
using PostingEngine.MarketData;

namespace PostingEngine.TaxLotMethods
{
    public class TaxLotDetail
    {
        public Transaction Trade { get; set; }
        public TaxLotStatus TaxLotStatus { get; set; }
        public TradeTaxRate TaxRate { get; set; }
        public double PotentialPnl { get; set; }
        public double TaxLiability { get; set; }
        public double TradePrice { get; set; }
    }

}
