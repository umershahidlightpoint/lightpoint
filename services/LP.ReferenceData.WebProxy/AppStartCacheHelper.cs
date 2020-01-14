using LP.Finance.Common.Cache;
using LP.ReferenceData.WebProxy.WebAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.ReferenceData.WebProxy
{
    public class AppStartCacheHelper
    {
        static AppStartCacheHelper()
        {

        }

        public static void CacheReferenceData()
        {
            IRefData refData = new RefDataService();
            AppStartCache.CacheData("fund", refData.Data("fund"));
            AppStartCache.CacheData("custodian", refData.Data("fund"));
            AppStartCache.CacheData("portfolio", refData.Data("fund"));
            AppStartCache.CacheData("broker", refData.Data("fund"));
        }
    }
}
