using LP.Finance.Common.Models;

namespace PostingEngine.PostingRules
{
    /// <summary>
    /// Posting Rules driven by Product Type, so for each product Type we will impelement the necessary rules on specified events
    /// </summary>
    public interface IPostingRule
    {
        /// <summary>
        /// Trade Date processing
        /// </summary>
        /// <param name="element"></param>
        void TradeDateEvent(PostingEngineEnvironment env, Transaction element);

        /// <summary>
        /// Settlement Date processing
        /// </summary>
        /// <param name="element"></param>
        void SettlementDateEvent(PostingEngineEnvironment env, Transaction element);
        /// <summary>
        /// Daily event
        /// </summary>
        /// <param name="element"></param>
        void DailyEvent(PostingEngineEnvironment env, Transaction element);
    }
}
