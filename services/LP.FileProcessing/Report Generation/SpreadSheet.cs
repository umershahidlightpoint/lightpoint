using OfficeOpenXml;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace LP.FileProcessing.Report_Generation
{
    public class SpreadSheet : IReport
    { 
        public async void Generate(DataTable dt)
        {
            MemoryStream ms;
            using (ExcelPackage pck = new ExcelPackage())
            {
                ExcelWorksheet ws = pck.Workbook.Worksheets.Add("TaxLotReport");
                ws.Cells["A1"].LoadFromDataTable(dt, true);
                ms = new MemoryStream(pck.GetAsByteArray());
                await SendEmailAsync("hammad.zia@techverx.com", "hammad", "hammadzia000@gmail.com", null, null, "TaxLotReport", "this is an excel sheet", ms, false);
            }


        }

        //TODO extract this out to utils
        public static async Task<bool> SendEmailAsync(string from, string fromName, string to, string cc, string bcc,
            string subject,
            string body, MemoryStream attachment, bool isHtml)
        {
            try
            {
                var message = new MailMessage { From = new MailAddress(@from, fromName) };
                message.To.Add(new MailAddress(to));

                if (!string.IsNullOrEmpty(cc))
                {
                    message.CC.Add(cc);
                }

                if (!string.IsNullOrEmpty(bcc))
                {
                    message.Bcc.Add(bcc);
                }

                message.Subject = subject;
                message.Body = body;
                message.Attachments.Add(new Attachment(attachment, "TaxLotReport.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
                message.IsBodyHtml = isHtml;

                using (var smtp = new SmtpClient())
                {
                    await smtp.SendMailAsync(message);
                    await Task.FromResult(0);
                }

                return true;
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return false;
            }
        }
    }
}
