using LP.Finance.Common.Models;

namespace PostingEngine.ClientSpecifics
{
    public class DefaultSpecifics : IClientSpecifics
    {
        public Transaction[] Transform(Transaction[] trades)
        {
            return trades;
        }
    }
}
