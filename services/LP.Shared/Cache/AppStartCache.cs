using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Cache
{
    public class AppStartCache
    {
        static AppStartCache()
        {
            CachedResults = new Dictionary<string, object>();
        }

        private static Dictionary<string, object> CachedResults { get; set; }

        public static void CacheData(string key, object value)
        {
            CachedResults.Add(key, value);
        }

        public static Tuple<bool, object> GetCachedData(string key)
        {
            object data;
            bool exists = CachedResults.TryGetValue(key, out data);
            return new Tuple<bool, object>(exists, data);
        }
    }
}
