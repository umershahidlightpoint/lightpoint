﻿using LP.Finance.Common.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface IAnalysisService
    {
        object GetSummarizedJournal(List<GridLayoutDto> layout);
        object GetJournalDetails(JournalGridMain obj);

    }
}
