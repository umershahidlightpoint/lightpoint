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

            if (!String.IsNullOrEmpty(clientName) && clientName.ToLowerInvariant().Equals("cowen"))
                return new CowenSpecifics();

            if (!String.IsNullOrEmpty(clientName) && clientName.ToLowerInvariant().Equals("base"))
                return new BaseSpecifics();

            return new DefaultSpecifics();
        }

        /// <summary>
        /// Get the instance of the class specified, so classname will be grabbed from the config file, so for example
        /// <add key="Client" value="PostingEngine.ClientSpecifics.BayberrySpecifics"/>
        /// </summary>
        /// <param name="className"></param>
        /// <returns></returns>
        public static IClientSpecifics GetImplementation(string className)
        {
            var assembly = typeof(IClientSpecifics).Assembly;
            if (assembly != null)
            {
                var type = assembly.GetType(className);
                return Activator.CreateInstance(type) as IClientSpecifics;
            }

            return new DefaultSpecifics();
        }

    }
}
