using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Cache
{
    internal class DataCacheElement
    {
        internal DateTime LastUpdate { get; set; }
        internal string Key { get; set; }
        internal object CachedModel { get; set; }
    }
}
