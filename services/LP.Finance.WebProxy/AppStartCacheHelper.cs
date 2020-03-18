using LP.Shared.Cache;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy
{
    public class AppStartCacheHelper
    {
        static AppStartCacheHelper()
        {
            
        }

        public static void CacheServerSideMetaInfo()
        {
            IJournalService journalService = new JournalService();
            JournalMetaInputDto dto = new JournalMetaInputDto();
            dto.GridName = "Journals Ledgers";
            var result = journalService.GetJournalsMetaData(dto);
            AppStartCache.CacheData(dto.GridName, result);
        }
    }
}
