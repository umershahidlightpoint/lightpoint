using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common
{
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
        public static object GetFile(string filename)
        {
            var content = "{}";

            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var folder = currentDir + "Data" + Path.DirectorySeparatorChar + $"{filename}.json";
            if (File.Exists(folder))
                content = File.ReadAllText(folder);

            dynamic json = JsonConvert.DeserializeObject(content);

            return json;
        }

        public static void Save(object json, string filename)
        {
            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            var folder = currentDir + "Data" + Path.DirectorySeparatorChar + $"{filename}.json";

            if (File.Exists(folder))
                File.Delete(folder);

            var result = JsonConvert.SerializeObject(json);

            File.WriteAllText(folder, result);
        }

    }
}
