using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using LP.Finance.Common;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace LP.FileProcessing.Report_Generation
{
    public class SpreadSheet : IReport
    {
        public void Generate(DataTable dt, List<string> recepeintList, string header, string content, string fromEmail, string fromName)
        {
            MemoryStream ms;
            using (ExcelPackage pck = new ExcelPackage())
            {
                ExcelWorksheet ws = pck.Workbook.Worksheets.Add(header);
                ws.Cells["A1"].LoadFromDataTable(dt, true);
                ms = new MemoryStream(pck.GetAsByteArray());
                //Task.Run(() => {});
                LP.Shared.Utils.SendEmailWithSpreadSheet(fromEmail, fromName, recepeintList, null, null, header, content, ms, false);
            }
        }        
    }
}
