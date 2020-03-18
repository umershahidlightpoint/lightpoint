using System.Collections.Generic;
using System.Data;

namespace LP.FileProcessing.Report_Generation
{
    public interface IReport
    {
        void Generate(DataTable dt, List<string> recepeintList, string header, string content, string fromEmail, string fromName);
    }
}
