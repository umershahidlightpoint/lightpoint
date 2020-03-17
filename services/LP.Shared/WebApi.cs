using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using LP.Finance.Common.Model;
using System.Globalization;
using System.Net.Mail;
using LP.Finance.Common;

namespace LP.Shared
{

    public class WebApi
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public static async Task<string> GetWebApiData(string webURI, string referenceDataWebApi)
        {
            Task<string> result = null;

            var client = new HttpClient();

            var url = $"{referenceDataWebApi}{webURI}";

            HttpResponseMessage response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsStringAsync();
            }
            response.Dispose();

            return await result;
        }

        public static async Task<string> GetWebApiData(string webApi, string webUri, string projectWebApi)
        {
            Task<string> result = null;

            var client = new HttpClient();

            //var projectWebApi = ConfigurationManager.AppSettings[webApi];

            var url = $"{projectWebApi}{webUri}";

            HttpResponseMessage response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }

        public static async Task<string> PostWebApi(string webApi, string webUri, object webContent, string projectWebApi)
        {
            Task<string> result = null;

            var client = new HttpClient();
            //string projectWebApi = ConfigurationManager.AppSettings[webApi];
            var url = $"{projectWebApi}{webUri}";

            var content = new StringContent(JsonConvert.SerializeObject(webContent), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(url, content);
            if (response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }

        public static async Task<string> PostWebApi(string webUri, object webContent, string baseURL)
        {
            Task<string> result = null;

            var client = new HttpClient();
            string projectWebApi = baseURL;
            var url = $"{projectWebApi}{webUri}";

            var content = new StringContent(JsonConvert.SerializeObject(webContent), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(url, content);
            if (response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }

        public static async Task<string> PostFileApi(string webApi, string webUri, string filePath, string projectWebApi)
        {
            Task<string> result = null;

            //string projectWebApi = ConfigurationManager.AppSettings[webApi];
            var url = $"{projectWebApi}{webUri}";

            var bytes = File.ReadAllBytes(filePath);
            using (var client = new HttpClient())
            {
                using (var content =
                    new MultipartFormDataContent("Upload-" + DateTime.Now.ToString(CultureInfo.InvariantCulture)))
                {
                    content.Add(new StreamContent(new MemoryStream(bytes)), Path.GetFileNameWithoutExtension(filePath),
                        Path.GetFileName(filePath));

                    using (var response = await client.PostAsync(url, content))
                    {
                        if (response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest)
                        {
                            result = response.Content.ReadAsStringAsync();
                        }
                    }
                }
            }

            return await result;
        }

        public static async Task<string> PutWebApi(string webApi, string webUri, object webContent, string projectWebApi)
        {
            Task<string> result = null;

            var client = new HttpClient();
            //string projectWebApi = ConfigurationManager.AppSettings[webApi];
            var url = $"{projectWebApi}{webUri}";

            var content = new StringContent(JsonConvert.SerializeObject(webContent), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PutAsync(url, content);
            if (response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }

        public static async Task<string> DeleteWebApi(string webApi, string webUri, string projectWebApi)
        {
            Task<string> result = null;

            var client = new HttpClient();
            //string projectWebApi = ConfigurationManager.AppSettings[webApi];
            var url = $"{projectWebApi}{webUri}";

            HttpResponseMessage response = await client.DeleteAsync(url);
            if (response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest)
            {
                result = response.Content.ReadAsStringAsync();
            }

            response.Dispose();

            return await result;
        }

        public static object Wrap(bool status, object payload = null, object statusCode = null, string message = null,
            object metaData = null, object stats = null)
        {
            return new
            {
                when = DateTime.Now,
                by = "",
                isSuccessful = status,
                message = message ?? (status ? "The Request was Successful" : "The Request Failed! Try Again"),
                payload,
                meta = metaData,
                stats,
                statusCode,
            };
        }

//        public static object Wrap(bool status, string message = null, object statusCode = null)
//        {
//            return new
//            {
//                when = DateTime.Now,
//                by = "",
//                isSuccessful = status,
//                status = statusCode,
//                message = message ?? (status ? "The Request was Successful" : "The Request Failed! Try Again"),
//            };
//        }

        public static object GridWrap(object payload, object metaData = null, object stats = null,
            object statusCode = null, object message = null)
        {
            return new
            {
                when = DateTime.Now,
                by = "",
                data = payload,
                meta = metaData,
                stats,
                status = statusCode,
                message
            };
        }

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
                Logger.Debug(ex, "");
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
    }
}