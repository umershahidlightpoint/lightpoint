using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.CorporateActions
{
    class StockSplits
    {
        private readonly PostingEngineEnvironment env;
        private StockSplits(PostingEngineEnvironment env)
        {
            this.env = env;
        }

        public static object Get(PostingEngineEnvironment env)
        {
            return new StockSplits(env);
        }

        public bool Process()
        {
            // Run thru the Open Tax Lots and generate for each Open tax lot an appropriate DIVIDEND
            return true;
        }
    }
}
