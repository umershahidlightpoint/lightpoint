﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;

namespace LP.Finance.Common
{
    public class ColumnDef
    {
        public string field { get; set; }
        public string headerName { get; set; }
        public bool filter { get; set; }

        public string Type { get; set; }
    }
    public class MetaData
    {
        public int Total { get; set; }

        public List<ColumnDef> Columns { get;set;}
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
        public static object Wrap(bool status, object payload, object metaData, string message = null)
        {
            return new
            {
                when = DateTime.Now,
                by = "",
                isSuccessful = status,
                message = message ?? (status ? "The Request was Successful" : "The Request Failed! Try Again"),
                payload,
                meta = metaData
            };
        }

        public static object Wrap(bool status, string message = null)
        {
            return new
            {
                when = DateTime.Now,
                by = "",
                isSuccessful = status,
                message = message ?? (status ? "The Request was Successful" : "The Request Failed! Try Again"),
            };
        }

        public static object GridWrap(object payload)
        {
            return new
            {
                when = DateTime.Now,
                by = "",
                data = payload,
            };
        }

        public static object GridWrap(object payload, object metaData, object stats)
        {
            return new
            {
                when = DateTime.Now,
                by = "",
                data = payload,
                meta = metaData,
                stats = stats
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

        public static T GetFile<T>(string filename)
        {
            var content = "{}";

            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var folder = currentDir + "MockData" + Path.DirectorySeparatorChar + $"{filename}.json";
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
            return json.Count > 0 ? Utils.Wrap(status, json, metaData) : Utils.Wrap(status);
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