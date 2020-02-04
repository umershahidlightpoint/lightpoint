﻿using OfficeOpenXml;
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
        public void Generate(DataTable dt, List<string> recepeintList)
        {
            MemoryStream ms;
            using (ExcelPackage pck = new ExcelPackage())
            {
                ExcelWorksheet ws = pck.Workbook.Worksheets.Add("TaxLotReport");
                ws.Cells["A1"].LoadFromDataTable(dt, true);
                ms = new MemoryStream(pck.GetAsByteArray());

                //Task.Run(() => {
                //    SendEmail("hammad.zia@techverx.com", "hammad", "hammad.zia@techverx.com", null, null, "TaxLotReport", "this is an excel sheet", ms, false);
                //});

                SendEmail("hammad.zia@techverx.com", "hammad", "hammad.zia@techverx.com", null, null, "TaxLotReport", "this is an excel sheet", ms, false);
            }
        }

        //TODO extract this out to utils
        public static void SendEmail(string from, string fromName, string to, string cc, string bcc,
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
                    smtp.Send(message);
                    //smtp.SendMailAsync(message);
                    //await Task.FromResult(0);
                }

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
            }
        }
    }
}