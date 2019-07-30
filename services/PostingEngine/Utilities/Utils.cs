using LP.Finance.Common.Models;

namespace PostingEngine.PostingRules.Utilities
{
    static class Utils
    {
        public static void Save(this Journal[] entries, PostingEngineEnvironment env)
        {
            foreach (var i in entries)
                i.Save(env.Connection, env.Transaction);
        }
    }
}
