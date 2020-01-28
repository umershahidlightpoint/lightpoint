using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    interface ILogService
    {
        object GetLogFiles();
        object DownloadLog(string path, string fileName);
    }
}
