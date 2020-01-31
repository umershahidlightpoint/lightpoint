using System;
using System.Collections.Generic;
using System.Data;
using System.Text;

namespace LP.FileProcessing
{
    public interface IReport
    {
        void Generate(DataTable dt);
    }
}
