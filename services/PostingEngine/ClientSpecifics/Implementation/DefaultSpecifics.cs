using LP.Finance.Common.Model;

namespace PostingEngine.ClientSpecifics.Implementation
{
    public class DefaultSpecifics : IClientSpecifics
    {
        public Transaction[] Transform(Transaction[] trades)
        {
            return trades;
        }
    }
}
