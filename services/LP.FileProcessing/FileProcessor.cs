using LP.FileProcessing.MetaData;
using LP.Finance.Common.Models;
using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Xml.Linq;
using Microsoft.CSharp;
/*
* Start of a common library for generating and consuming files
*/
namespace LP.FileProcessing
{
    public class FileProcessor
    {
        // Header & Footer's required as part of the file generation
        public object GenerateFile<T>(IEnumerable<T> transactionList, string path, string fileName)
        {
            var schema = Utils.GetFile<SilverFileFormat>(fileName);
            List<dynamic> activityList = MapRecord(transactionList, schema.record);
            WritePipe(activityList,path, schema.record);
            return activityList;
        }

        private List<dynamic> MapRecord<T>(IEnumerable<T> transactionList, List<FileProperties> schema)
        {
            List<dynamic> activityList = new List<dynamic>();
            foreach (var item in transactionList)
            {
                dynamic obj = new ExpandoObject();
                foreach (var map in schema)
                {
                    var prop = item.GetType().GetProperty(map.Source);
                    var value = prop != null ? prop.GetValue(item, null) : null;

                    if (!String.IsNullOrEmpty(map.Function) && !String.IsNullOrEmpty(map.Format))
                    {
                        Type thisType = this.GetType();
                        MethodInfo theMethod = thisType.GetMethod(map.Function);
                        object[] parametersArray = {value, map.Format};
                        var val = theMethod.Invoke(this, parametersArray);
                        value = val;
                    }
                    else if (!String.IsNullOrEmpty(map.Function))
                    {
                    }

                    AddProperty(obj, map.Destination, value);
                }

                activityList.Add(obj);
            }

            return activityList;
        }

        public object GetDate(object value,string format)
        {
            format = "yyyy-MM-dd";
            var date = (DateTime) value;
            return date.ToString(format);
        }

        public static void AddProperty(ExpandoObject expando, string propertyName, object propertyValue)
        {
            // ExpandoObject supports IDictionary so we can extend it like this
            var expandoDict = expando as IDictionary<string, object>;
            if (expandoDict.ContainsKey(propertyName))
            {
                expandoDict[propertyName] = propertyValue;
            }
            else
            {
                expandoDict.Add(propertyName, propertyValue);
            }
        }
        public object PositionFile()
        {
            List<SilverMetaDataForPosition> positionMetaData = new List<SilverMetaDataForPosition>();
            for (var i = 0; i < 10; i++)
            {
                SilverMetaDataForPosition met = new SilverMetaDataForPosition
                {
                    Security_Currency = "USD",
                    Security_ID = "1234567",
                    Symbol = "USD"
                };

                positionMetaData.Add(met);
            }
            return positionMetaData;
        }

        public void WriteCSV(IEnumerable<dynamic> items, string path, List<FileProperties> properties)
        {
            WriteDelimited(items, path,properties);
        }

        public void WritePipe(IEnumerable<dynamic> items, string path, List<FileProperties> properties)
        {
            WriteDelimited(items, path,properties, '|');
        }

        public void WriteDelimited(IEnumerable<dynamic> items, string path, List<FileProperties> props, char delim = ',')
        {
            using (var writer = new StreamWriter(path))
            {
                writer.WriteLine(string.Join(delim.ToString(), props.Select(p => p.Destination)));

                foreach (var item in items)
                {
                    var dictionary = ((IDictionary<String, Object>)item);
                    writer.WriteLine(string.Join(delim.ToString(), props.Select(i=> dictionary[i.Destination])));
                }
            }
        }

    }

}
