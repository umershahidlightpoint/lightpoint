using LP.FileProcessing.MetaData;
using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Reflection;
using LP.FileProcessing.S3;

/*
* Start of a common library for generating and consuming files
*/
namespace LP.FileProcessing
{
    public class FileProcessor
    {
        // Header & Footer's required as part of the file generation
        public int GenerateFile<T>(IEnumerable<T> recordList, object headerObj, object trailerObj, string path, string fileName)
        {
            var schema = Utils.GetFile<SilverFileFormat>(fileName, "FileFormats");
            List<dynamic> record = MapFileRecord(recordList, schema.record);
            List<dynamic> header = MapFileSection(headerObj, schema.header);
            List<dynamic> trailer = MapFileSection(trailerObj, schema.trailer, record.Count());
            WritePipe(record,header,trailer, path, schema);
            return record.Count();
        }

        public object ImportFile(string path, string fileName)
        {
            var schema = Utils.GetFile<SilverFileFormat>(fileName, "FileFormats");
            var resp = ExtractPipe(path, schema);
            return resp;
        }

        private List<dynamic> MapFileRecord<T>(IEnumerable<T> transactionList, List<FileProperties> schema)
        {
            List<dynamic> sectionList = new List<dynamic>();
            foreach (var item in transactionList)
            {
                dynamic obj;
                MapItem(schema, item, out obj);
                sectionList.Add(obj);
            }

            return sectionList;
        }

        private List<dynamic> MapFileSection(object item, List<FileProperties> schema, int recordCount = 0)
        {
            List<dynamic> sectionList = new List<dynamic>();
            dynamic obj;
            MapItem(schema, item, out obj, recordCount);
            sectionList.Add(obj);
            return sectionList;
        }

        private void MapItem(List<FileProperties> schema, object item, out dynamic obj, int recordCount = 0)
        {
            obj = new ExpandoObject();
            foreach (var map in schema)
            {
                var prop = item.GetType().GetProperty(map.Source);
                var value = prop != null ? prop.GetValue(item, null) : null;

                if (!String.IsNullOrEmpty(map.Function) && !String.IsNullOrEmpty(map.Format))
                {
                    Type thisType = this.GetType();
                    MethodInfo theMethod = thisType.GetMethod(map.Function);
                    object[] parametersArray = { value, map.Format };
                    var val = theMethod.Invoke(this, parametersArray);
                    value = val;
                }
                else if (!String.IsNullOrEmpty(map.Function))
                {
                }

                if(map.Destination == "Record_Count")
                {
                    value = recordCount;
                }
                AddProperty(obj, map.Destination, value);
            }
        }

        public object GetDate(object value, string format)
        {
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
      
        public void WriteCSV(IEnumerable<dynamic> items, IEnumerable<dynamic> header, IEnumerable<dynamic> trailer, string path, SilverFileFormat properties)
        {
            WriteDelimited(items,header,trailer, path,properties);
        }

        public void WritePipe(IEnumerable<dynamic> items, IEnumerable<dynamic> header, IEnumerable<dynamic> trailer, string path, SilverFileFormat properties)
        {
            WriteDelimited(items,header,trailer, path,properties, '|');
        }

        public List<dynamic> ExtractPipe(string path, SilverFileFormat properties)
        {
            return ExtractDelimited(path, properties, '|');
        }

        private List<dynamic> ExtractDelimited(string path, SilverFileFormat properties, char v = ',')
        {
            var recordDictionary = properties.record.Select((s, i) => new { s, i }).ToDictionary(x => x.i, x => x.s.Destination);
            var headerDictionary = properties.record.Select((s, i) => new { s, i }).ToDictionary(x => x.i, x => x.s.Destination);
            var trailerDictionary = properties.record.Select((s, i) => new { s, i }).ToDictionary(x => x.i, x => x.s.Destination);

            //string test = "a|b||c|||d";
            int index = 0;
            var headerProperties = properties.header;
            int recordOffset = headerProperties.FindIndex(x => x.Source == "RECORD_COUNT");
            int? totalRecords = null;
            List<dynamic> record = new List<dynamic>();
            List<dynamic> trailer = new List<dynamic>();
            List<dynamic> header = new List<dynamic>();
            foreach (var line in System.IO.File.ReadLines(path))
            {
                int dictionaryIndex = 0;
                dynamic obj = new ExpandoObject();
                var delimited = line.Split(v);
                foreach (var item in delimited)
                {
                    if(index == 0)
                    {
                        if(dictionaryIndex == recordOffset)
                        {
                            totalRecords = Convert.ToInt32(item);
                        }

                        AddProperty(obj, headerDictionary[dictionaryIndex], item);
                    }
                    else if(totalRecords.HasValue && index == totalRecords + 1)
                    {
                        AddProperty(obj, trailerDictionary[dictionaryIndex], item);
                    }
                    else
                    {
                        AddProperty(obj, recordDictionary[dictionaryIndex], item);
                    }

                    dictionaryIndex++;
                }
                if(index == 0)
                {
                    header.Add(obj);
                }
                else if (totalRecords.HasValue && index == totalRecords + 1)
                {
                    trailer.Add(obj);
                }
                else
                {
                    record.Add(obj);
                }
                index++;
            }
            return record;
        }

        public void WriteDelimited(IEnumerable<dynamic> items, IEnumerable<dynamic> header, IEnumerable<dynamic> trailer,  string path, SilverFileFormat properties, char delim = ',')
        {
            using (var writer = new StreamWriter(path))
            {
                WriteFile(header, properties.header, delim, writer);
                WriteFile(items, properties.record, delim, writer);
                WriteFile(trailer, properties.trailer, delim, writer);
            }
        }

        private static void WriteFile(IEnumerable<dynamic> items, List<FileProperties> props, char delim, StreamWriter writer)
        {
            //writer.WriteLine(string.Join(delim.ToString(), props.Select(p => p.Destination)));

            foreach (var item in items)
            {
                var dictionary = ((IDictionary<String, Object>)item);
                writer.WriteLine(string.Join(delim.ToString(), props.Select(i => dictionary[i.Destination])));
            }
        }

        // Uploading Files to AWS S3 Bucket
        public void UploadFile(string path)
        {
            S3Endpoint.Upload(path);
        }
    }
}