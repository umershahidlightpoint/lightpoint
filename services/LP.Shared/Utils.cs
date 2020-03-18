using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Globalization;
using System.Net.Mail;
using System.Collections.Concurrent;
using System.Data.SqlClient;
using System.Data;
using LP.Shared.FileMetaData;

namespace LP.Shared
{

    public class MathFnc
    {
        public static decimal Truncate(decimal value, int decimals)
        {
            decimal factor = (decimal) Math.Pow(10, decimals);
            decimal result = Math.Truncate(factor * value) / factor;
            return result;
        }
    }

    public class Utils
    {
        public static object GetFile(string filename)
        {
            var content = "{}";

            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var folder = currentDir + "MockData" + Path.DirectorySeparatorChar + $"{filename}.json";
            if (File.Exists(folder))
                content = File.ReadAllText(folder);

            dynamic json = JsonConvert.DeserializeObject(content);

            return json;
        }

        public static string GetString(string filename)
        {
            var content = "{}";

            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var folder = currentDir + "MockData" + Path.DirectorySeparatorChar + $"{filename}.json";
            if (File.Exists(folder))
                content = File.ReadAllText(folder);

            return content;
        }

        public static T GetFile<T>(string filename, string folderName = "MockData")
        {
            var content = "{}";

            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var folder = currentDir + folderName + Path.DirectorySeparatorChar + $"{filename}.json";
            if (File.Exists(folder))
                content = File.ReadAllText(folder);

            T json = JsonConvert.DeserializeObject<T>(content);

            return json;
        }

        public static void Save(object json, string filename)
        {
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var dir = currentDir + "MockData";
            var file = dir + Path.DirectorySeparatorChar + $"{filename}.json";

            if (!Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            if (File.Exists(file))
                File.Delete(file);

            var result = JsonConvert.SerializeObject(json);

            try
            {
                File.WriteAllText(file, result);
            }
            catch (Exception ex)
            {
                //Logger.Debug(ex, "");
            }
        }

        public static void SaveString(string json, string filename)
        {
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var dir = currentDir + "MockData";
            var file = dir + Path.DirectorySeparatorChar + $"{filename}.json";

            if (!Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            if (File.Exists(file))
                File.Delete(file);

            try
            {
                File.WriteAllText(file, json);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
            }
        }

        private readonly static string _lockHandle = "Uniquie Handle";

        private static void Save(dynamic state)
        {
            lock (_lockHandle)
            {
                var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

                var dir = currentDir + "MockData";
                var file = dir + Path.DirectorySeparatorChar + $"{state.filename}.json";

                if (!Directory.Exists(dir))
                    Directory.CreateDirectory(dir);

                if (File.Exists(file))
                    File.Delete(file);

                try
                {
                    var result = JsonConvert.SerializeObject(state.json);
                    File.WriteAllText(file, result);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                }
            }
        }

        public static void SaveAsync(object json, string filename)
        {
            ThreadPool.QueueUserWorkItem(new WaitCallback(Save), new {json, filename});
        }

        public static void SendEmailWithSpreadSheet(string from, string fromName, List<string> to, string cc, string bcc,
            string subject,
            string body, MemoryStream attachment, bool isHtml)
        {
            try
            {
                var message = new MailMessage { From = new MailAddress(@from, fromName) };
                foreach (var emailAddress in to)
                {
                    message.To.Add(new MailAddress(emailAddress));
                }

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
                message.Attachments.Add(new Attachment(attachment, $"{subject}.xlsx", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
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

        public static object RunQuery(string connection, string query, SqlParameter[] parameters = null)
        {
            var status = false;
            var content = "{}";
            var metaData = new MetaData();
            using (var con = new SqlConnection(connection))
            {
                var sda = new SqlDataAdapter(query, con);
                if (parameters != null)
                {
                    sda.SelectCommand.Parameters.AddRange(parameters);
                }

                try
                {
                    var dataTable = new DataTable();
                    con.Open();
                    sda.Fill(dataTable);
                    con.Close();

                    metaData.Total = GetMetaData(dataTable);
                    var jsonResult = JsonConvert.SerializeObject(dataTable);
                    content = jsonResult;
                    status = true;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"RunQuery Exception :: {ex}");
                }
            }

            dynamic json = JsonConvert.DeserializeObject(content);

            // This Wraps the Results into an Envelope that Contains Additional Metadata
            return json.Count > 0 ? WebApi.Wrap(status, json, null, null, metaData) : WebApi.Wrap(status);
        }

        public static object GetTable(string connection, string tablename)
        {
            var query = $@"select * from {tablename} nolock";

            return RunQuery(connection, query);
        }

        private static int GetMetaData(DataTable dataTable)
        {
            var total = dataTable.Columns.Contains("total") && dataTable.Rows.Count > 0
                ? Convert.ToInt32(dataTable.Rows[0]["total"])
                : 0;

            if (dataTable.Columns.Contains("total"))
                dataTable.Columns.Remove("total");

            return total;
        }

    }
}