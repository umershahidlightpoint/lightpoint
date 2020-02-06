using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LP.FileProcessing
{
    public interface IReport
    {
        void Generate(DataTable dt, List<string> recepeintList, string header, string content, string fromEmail, string fromName);
    }
}
