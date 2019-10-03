using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LP.Finance.Common.Model;

namespace LP.Finance.Common.Dtos
{
    public class FileInputDto
    {
        public FileInputDto(string path, string fileName, int stats, string source, string action, List<FileException> invalidRecords, DateTime? businessDate = null)
        {
            this.fileName = fileName;
            this.path = path;
            this.statistics = stats;
            this.source = source;
            this.action = action;
            this.businessDate = businessDate;
            failedRecords = invalidRecords;
        }
        public string path { get; set; }
        public string fileName { get; set; }
        public int statistics { get; set; }
        public string source { get; set; }
        public string action { get; set; }
        public DateTime? businessDate { get; set; }
        public List<FileException> failedRecords;
    }
}
