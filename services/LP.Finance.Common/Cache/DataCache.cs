using System;
using System.Collections.Generic;

namespace LP.Finance.Common.Cache
{
    public class DataCache
    {
        private static object lockHandle = "DataCache_lock";

        static DataCache()
        {
            CachedResults = new Dictionary<string, DataCacheElement>();
        }

        private static Dictionary<string, DataCacheElement> CachedResults { get; set; }

        /// <summary>
        /// ONly caches the data for 5 mins
        /// </summary>
        /// <param name="key"></param>
        /// <param name="p"></param>
        /// <returns></returns>
        public static object Results(string key, Func<object> p)
        {
            lock (lockHandle)
            {
                if (!CachedResults.ContainsKey(key))
                {
                    CachedResults.Add(key, new DataCacheElement
                    {
                        CachedModel = p(),
                        LastUpdate = DateTime.Now,
                        Key = key
                    });
                }
                else
                {
                    var element = CachedResults[key];
                    if (DateTime.Now > element.LastUpdate.AddMinutes(5))
                    {
                        element.CachedModel = p();
                        element.LastUpdate = DateTime.Now;
                    }
                }

                return CachedResults[key].CachedModel;
            }
        }
    }
}