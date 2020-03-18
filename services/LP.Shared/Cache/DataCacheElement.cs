using System;

namespace LP.Shared.Cache
{
    internal class DataCacheElement
    {
        internal DateTime LastUpdate { get; set; }
        internal string Key { get; set; }
        internal object CachedModel { get; set; }
    }
}
