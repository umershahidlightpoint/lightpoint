using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common
{
    public class metaData
    {
        public int total { get; set; }
        
    }
    public class MathFnc
    {
        public static decimal Truncate(decimal value, int decimals)
        {
            decimal factor = (decimal)Math.Pow(10, decimals);
            decimal result = Math.Truncate(factor * value) / factor;
            return result;
        }
    }

    public class Utils
    {
        public static object Wrap(object payload,object metaData)
        {
            return new
            {
                when = DateTime.Now,
                by = "",
                payload = payload,
                meta = metaData
            };
        }

        public static object GridWrap(object payload, object metaData)
        {
            return new
            {
                when = DateTime.Now,
                by = "",
                data = payload,
                meta = metaData
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
            } catch ( Exception ex )
            {
                Console.WriteLine(ex);
            }
        }

        public static object RunQuery(string connection, string query, SqlParameter[] paramters =null )
        {
            var content = "{}";
            var metaData = new metaData();
            using (var con = new SqlConnection(connection))
            {
                var sda = new SqlDataAdapter(query, con);
                if (paramters != null)  { sda.SelectCommand.Parameters.AddRange(paramters); }
                var dataTable = new DataTable();
                con.Open();
                sda.Fill(dataTable);
                con.Close();
               
                var jsonResult = JsonConvert.SerializeObject(dataTable);
                content = jsonResult;              
            }

            dynamic json = JsonConvert.DeserializeObject(content);

            /// This wraps the results into an envelope that contains additional metadata
            return Utils.Wrap(json, metaData);
        }
         

        public static object GetTable (string connection, string tablename)
        {
            var query = $@"select * from {tablename} nolock";

            return RunQuery(connection, query);
        }

    }
}
