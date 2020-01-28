using LP.Finance.Common.Models;
using System;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.ClientSpecifics
{
    public interface IClientSpecifics
    {
        Transaction[] Transform(Transaction[] trades);
    }

    public class ClientSpecificsFactory
    {
        public static IClientSpecifics Get(string clientName)
        {
            if ( !String.IsNullOrEmpty(clientName) && clientName.ToLowerInvariant().Equals("bayberry"))
                return new BayberrySpecifics();

            return new DefaultSpecifics();
        }
    }
}
