using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IFileManagementService
    {
        object GetFiles(string name);
        object GenerateActivityAndPositionFilesForSilver(FileGenerationInputDto dto);
        object ImportFilesFromSilver();
        object UploadFiles();
        object DownloadFiles();
        object GetS3Files();
        object UpdateFileAction(FileActionInputDto input);
        object GetInvalidExportRecords();
        Task<object> UploadTrade(HttpRequestMessage requestMessage);
        object CommitTrade(List<Trade> trades);

        Task<object> UploadJournal(HttpRequestMessage requestMessage);
        object CommitJournal(List<RawJournal> trades);

    }
}