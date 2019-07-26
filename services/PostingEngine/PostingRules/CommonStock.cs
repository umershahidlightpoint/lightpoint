using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.PostingRules
{
    public class FakeJournals : IPostingRule
    {
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }
    }

    public class CommonStock : IPostingRule
    {
        public void DailyEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }

        public void SettlementDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }

        public void TradeDateEvent(PostingEngineEnvironment env, Transaction element)
        {
            throw new NotImplementedException();
        }
    }
}
