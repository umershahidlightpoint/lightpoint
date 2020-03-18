using System.Collections.Generic;

namespace LP.Shared.FileMetaData
{
    public class FileFormat
    {
        public List<FileProperties> header { get; set; }
        public List<FileProperties> trailer { get; set; }
        public List<FileProperties> record { get; set; }
    }
}