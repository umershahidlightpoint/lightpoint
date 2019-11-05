using LP.Finance.Common.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace LP.Finance.Common
{
    public class ColumnDef
    {
        public string field { get; set; }
        public string headerName { get; set; }
        public bool filter { get; set; }
        public string Type { get; set; }
    }

    public class Response
    {
        public DateTime when { get; set; }
        public string by { get; set; }
        public bool isSuccessful { get; set; }
        public string message { get; set; }
        public object payload { get; set; }
        public object meta { get; set; }
        public object stats { get; set; }
        public object statusCode { get; set; }
    }

    public class MetaData
    {
        public int Total { get; set; }
        public List<ColumnDef> Columns { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="table">DataTable that contains the information we need to construct a grid on the UI</param>
        /// <returns></returns>
        public static MetaData ToMetaData(DataTable table)
        {
            var metaData = new MetaData();
            metaData.Columns = new List<ColumnDef>();
            foreach (DataColumn col in table.Columns)
            {
                metaData.Columns.Add(new ColumnDef
                {
                    filter = true,
                    headerName =
                        col.ColumnName, // This will be driven by a data dictionary that will provide the write names in the System
                    field = col.ColumnName,
                    Type = col.DataType.ToString()
                });
            }

            return metaData;
        }
    }

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
        public static async Task<string> GetWebApiData(string webURI)
        {
            Task<string> result = null;

            var client = new HttpClient();

            var referenceDataWebApi = ConfigurationManager.AppSettings["ReferenceDataWebApi"];

            var url = $"{referenceDataWebApi}{webURI}";

            HttpResponseMessage response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }

        public static async Task<string> GetWebApiData(string webApi, string webUri)
        {
            Task<string> result = null;

            var client = new HttpClient();

            var projectWebApi = ConfigurationManager.AppSettings[webApi];

            var url = $"{projectWebApi}{webUri}";

            HttpResponseMessage response = await client.GetAsync(url);
            if (response.IsSuccessStatusCode)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }

        public static async Task<string> PostWebApi(string webApi, string webUri, object webContent)
        {
            Task<string> result = null;

            var client = new HttpClient();
            string projectWebApi = ConfigurationManager.AppSettings[webApi];
            var url = $"{projectWebApi}{webUri}";

            var content = new StringContent(JsonConvert.SerializeObject(webContent), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PostAsync(url, content);
            if (response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest)
            {
                result = response.Content.ReadAsStringAsync();
            }

            return await result;
        }

        public static async Task<string> PostWebApi(string webApi, string webUri, object webContent, string baseURL)
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

        public static async Task<string> PutWebApi(string webApi, string webUri, object webContent)
        {
            Task<string> result = null;

            var client = new HttpClient();
            string projectWebApi = ConfigurationManager.AppSettings[webApi];
            var url = $"{projectWebApi}{webUri}";

            var content = new StringContent(JsonConvert.SerializeObject(webContent), Encoding.UTF8, "application/json");

            HttpResponseMessage response = await client.PutAsync(url, content);
            if (response.IsSuccessStatusCode || response.StatusCode == HttpStatusCode.BadRequest)
            {
                result = response.Content.ReadAsStringAsync();
            }

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

        //public static object Wrap(bool status, string message = null, object statusCode = null)
        //{
        //    return new
        //    {
        //        when = DateTime.Now,
        //        by = "",
        //        isSuccessful = status,
        //        status = statusCode,
        //        message = message ?? (status ? "The Request was Successful" : "The Request Failed! Try Again"),
        //    };
        //}

        public static object GridWrap(object payload, object metaData = null, object stats = null,
            object statusCode = null, object message = null)
        {
            return new
            {
                when = DateTime.Now,
                by = "",
                data = payload,
                meta = metaData,
                stats = stats,
                status = statusCode,
                message = message
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
                Console.WriteLine(ex);
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

        private static string _lockHandle = "Uniquie Handle";

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

                var result = JsonConvert.SerializeObject(state.json);

                try
                {
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

        public static async Task<Tuple<bool, string, string>> SaveFileToServerAsync(HttpRequestMessage requestMessage,
            string folderToSave)
        {
            if (!requestMessage.Content.IsMimeMultipartContent())
                return new Tuple<bool, string, string>(false, null, null);

            var provider = new MultipartMemoryStreamProvider();
            await requestMessage.Content.ReadAsMultipartAsync(provider);

            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            Directory.CreateDirectory(currentDir + Path.DirectorySeparatorChar + folderToSave);

            var savedFilePath = "";
            var savedFileName = "";
            foreach (var file in provider.Contents)
            {
                savedFileName = file.Headers.ContentDisposition.FileName.Trim('\"');
                var buffer = await file.ReadAsByteArrayAsync();

                savedFilePath = currentDir + folderToSave + Path.DirectorySeparatorChar +
                                $"{DateTime.Now:yy-MM-dd-hh-mm-ss}-{savedFileName}";

                File.WriteAllBytes(savedFilePath, buffer);
            }

            return new Tuple<bool, string, string>(true, savedFilePath, savedFileName);
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
            return json.Count > 0 ? Utils.Wrap(status, json, null, null, metaData) : Utils.Wrap(status);
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

    public class SQLBulkHelper
    {
        public void Insert(string tablename, IDbModel[] models, SqlConnection connection, SqlTransaction transaction,
            bool fireTriggers = false)
        {
            if (models.Length == 0)
                return;

            var table = models[0].MetaData(connection);

            foreach (var model in models)
            {
                var row = table.NewRow();
                model.PopulateRow(row);
                table.Rows.Add(row);
            }

            using (var bulk = new SqlBulkCopy(connection,
                fireTriggers ? SqlBulkCopyOptions.FireTriggers : SqlBulkCopyOptions.Default, transaction))
            {
                bulk.BatchSize = 1000;
                bulk.DestinationTableName = tablename;

                foreach (DataColumn c in table.Columns)
                {
                    bulk.ColumnMappings.Add(c.ColumnName, c.ColumnName);
                }

                bulk.WriteToServer(table);
            }
        }
    }

    public static class HelperFunctions
    {
        public static DataTable Join<T>(DataTable dataTable, Dictionary<string, T> elements, string key)
        {
            var properties = typeof(Transaction).GetProperties();
            foreach (var prop in properties)
            {
                dataTable.Columns.Add(prop.Name, prop.PropertyType);
            }

            // Get the Columns we Need to Generate the UI Grid
            foreach (var element in dataTable.Rows)
            {
                var dataRow = element as DataRow;

                var source = dataRow[key].ToString();

                if (!elements.ContainsKey(source))
                    continue;

                var found = elements[source];

                if (found != null)
                {
                    // Copy Data to the Row
                    foreach (var prop in properties)
                    {
                        dataRow[prop.Name] = prop.GetValue(found);
                    }
                }
            }

            return dataTable;
        }
    }
}