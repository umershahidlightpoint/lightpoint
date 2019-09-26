using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IFileManagementService
    {
        object GetFiles(string name);
        object UploadFile();
        object GenerateActivityAndPositionFilesForSilver();
    }
}