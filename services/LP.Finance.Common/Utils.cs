using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common
{
    public static class Utils
    {
        public static async Task<Tuple<bool, string, string>> SaveFileToServerAsync(HttpRequestMessage requestMessage,
    string folderToSave)
        {
            if (!requestMessage.Content.IsMimeMultipartContent())
                return new Tuple<bool, string, string>(false, null, null);

            var provider = new MultipartMemoryStreamProvider();
            await requestMessage.Content.ReadAsMultipartAsync(provider);

            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            Directory.CreateDirectory(currentDir + Path.DirectorySeparatorChar + folderToSave);

            var savedFilePath = "";
            var savedFileName = "";
            foreach (var file in provider.Contents)
            {
                savedFileName = file.Headers.ContentDisposition.FileName.Trim('\"');
                var buffer = await file.ReadAsByteArrayAsync();

                savedFilePath = currentDir + folderToSave + Path.DirectorySeparatorChar +
                                $"{DateTime.Now:yy-MM-dd-hh-mm-ss}-{savedFileName}";

                File.WriteAllBytes(savedFilePath, buffer);
            }

            return new Tuple<bool, string, string>(true, savedFilePath, savedFileName);
        }

    }
}
