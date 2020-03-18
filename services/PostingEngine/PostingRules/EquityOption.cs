using LP.Finance.Common.Model;

namespace PostingEngine.PostingRules
{
    public class EquityOption : DefaultPostingRules, IPostingRule
    {
        public bool IsValid(PostingEngineEnvironment env, Transaction element)
        {
            return true;
        }

        /// <summary>
        /// Run for each day that the Tax Lot remains open / partially closed
        /// </summary>
        /// <param name="env"></param>
        /// <param name="element">Trade we aee interested in</param>
        public new void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            base.DailyEvent(env, element);
        }

        public new void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            base.SettlementDateEvent(env, element);
        }

        public new void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            base.TradeDateEvent(env, element);
        }
    }
}
