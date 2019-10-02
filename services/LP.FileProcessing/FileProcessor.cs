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
        public int GenerateFile<T>(IEnumerable<T> recordList, object headerObj, object trailerObj, string path,
            string fileName)
        {
            int recordCount;
            var schema = Utils.GetFile<SilverFileFormat>(fileName, "FileFormats");
            List<dynamic> record = MapFileRecord(recordList, schema.record, out recordCount);
            List<dynamic> header = MapFileSection(headerObj, schema.header, recordCount + 2);
            List<dynamic> trailer = MapFileSection(trailerObj, schema.trailer, recordCount + 2);
            WritePipe(record, header, trailer, path, schema);
            return record.Count();
        }

        public object ImportFile(string path, string fileName)
        {
            var schema = Utils.GetFile<SilverFileFormat>(fileName, "FileFormats");
            var resp = ExtractPipe(path, schema);
            return resp;
        }

        private List<dynamic> MapFileRecord<T>(IEnumerable<T> transactionList, List<FileProperties> schema, out int records)
        {
            List<dynamic> sectionList = new List<dynamic>();
            bool valid = true;
            records = 0;
            foreach (var item in transactionList)
            {
                dynamic obj;
                valid = MapItem(schema, item, out obj);
                if (valid)
                {
                    sectionList.Add(obj);
                    records++;
                }
                else
                {
                    //TODO
                    //Skip the record and store it in the FileException table with lporderid and a json of all failed fields. 
                }
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

        private bool MapItem(List<FileProperties> schema, object item, out dynamic obj, int recordCount = 0)
        {
            obj = new ExpandoObject();
            foreach (var map in schema)
            {
                var prop = item.GetType().GetProperty(map.Source);
                var value = prop != null ? prop.GetValue(item, null) : null;
                bool valid = true;
                bool isValid = true;
                if (!String.IsNullOrEmpty(map.Function) && !String.IsNullOrEmpty(map.Format) && !String.IsNullOrEmpty(map.Type))
                {
                    Type thisType = this.GetType();
                    MethodInfo theMethod = thisType.GetMethod(map.Function);
                    object[] parametersArray = {value, map.Format, map.Type, valid};
                    var val = theMethod.Invoke(this, parametersArray);
                    isValid = (bool)parametersArray[3];
                    var returnType = theMethod.ReturnType;
                    if (returnType != typeof(void))
                    {
                        value = val;
                    }
                }
                else if (!String.IsNullOrEmpty(map.Function))
                {
                    Type thisType = this.GetType();
                    MethodInfo theMethod = thisType.GetMethod(map.Function);
                    object[] parametersArray = { value};
                    var val = theMethod.Invoke(this, parametersArray);
                    var returnType = theMethod.ReturnType;
                    if (returnType != typeof(void))
                    {
                        value = val;
                    }
                }

                if (map.Destination == "Record_Count")
                {
                    value = recordCount;
                }

                if (isValid)
                {
                    AddProperty(obj, map.Destination, value);
                }
                else
                {
                    return false;
                }
            }
            return true;
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

        public void WriteCSV(IEnumerable<dynamic> items, IEnumerable<dynamic> header, IEnumerable<dynamic> trailer,
            string path, SilverFileFormat properties)
        {
            WriteDelimited(items, header, trailer, path, properties);
        }

        public void WritePipe(IEnumerable<dynamic> items, IEnumerable<dynamic> header, IEnumerable<dynamic> trailer,
            string path, SilverFileFormat properties)
        {
            WriteDelimited(items, header, trailer, path, properties, '|');
        }

        public List<dynamic> ExtractPipe(string path, SilverFileFormat properties)
        {
            return ExtractDelimited(path, properties, '|');
        }

        private List<dynamic> ExtractDelimited(string path, SilverFileFormat properties, char v = ',')
        {
            var recordDictionary = properties.record.Select((s, i) => new {s, i})
                .ToDictionary(x => x.i, x => x.s.Destination);
            var headerDictionary = properties.record.Select((s, i) => new {s, i})
                .ToDictionary(x => x.i, x => x.s.Destination);
            var trailerDictionary = properties.record.Select((s, i) => new {s, i})
                .ToDictionary(x => x.i, x => x.s.Destination);

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
                    if (index == 0)
                    {
                        if (dictionaryIndex == recordOffset)
                        {
                            totalRecords = Convert.ToInt32(item);
                        }

                        AddProperty(obj, headerDictionary[dictionaryIndex], item);
                    }
                    else if (totalRecords.HasValue && index == totalRecords + 1)
                    {
                        AddProperty(obj, trailerDictionary[dictionaryIndex], item);
                    }
                    else
                    {
                        AddProperty(obj, recordDictionary[dictionaryIndex], item);
                    }

                    dictionaryIndex++;
                }

                if (index == 0)
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

        public void WriteDelimited(IEnumerable<dynamic> items, IEnumerable<dynamic> header,
            IEnumerable<dynamic> trailer, string path, SilverFileFormat properties, char delim = ',')
        {
            using (var writer = new StreamWriter(path))
            {
                WriteFile(header, properties.header, delim, writer);
                WriteFile(items, properties.record, delim, writer);
                WriteFile(trailer, properties.trailer, delim, writer);
            }
        }

        private static void WriteFile(IEnumerable<dynamic> items, List<FileProperties> props, char delim,
            StreamWriter writer)
        {
            //writer.WriteLine(string.Join(delim.ToString(), props.Select(p => p.Destination)));

            foreach (var item in items)
            {
                var dictionary = ((IDictionary<String, Object>) item);
                writer.WriteLine(string.Join(delim.ToString(), props.Select(i => dictionary[i.Destination])));
            }
        }

        // Uploading Files to AWS S3 Bucket
        public bool UploadFile(string path)
        {
            return S3Endpoint.Upload(path);
        }

        // Downloading Files from AWS S3 Bucket
        public bool DownloadFile(string path)
        {
            return S3Endpoint.Download(path);
        }

        // List of Files from AWS S3 Bucket
        public List<object> GetFiles()
        {
            return S3Endpoint.List();
        }

        #region Helper Functions for data pre-processing

        public object GetDate(object value, string format, string type, out bool valid)
        {
            valid = true;
            var date = (DateTime)value;
            return date.ToString(format);
        }
        
        public object LongShortConversion(object value)
        {
            var position = (string)value;
            if (position != null)
            {
                if (position.ToLower() == "long")
                {
                    return true;
                }
                else if (position.ToLower() == "short")
                {
                    return false;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        public void CheckFormat(object value, string format, string type, out bool valid)
        {
            valid = true;
            if(type == "decimal")
            {
                string val = Convert.ToString(value);
                string[] parsedVal = val.Split('.');
                string[] numeric = format.Split(',');
                int wholeNumberLength = Convert.ToInt32(numeric[0]);
                int decimalNumberLength = Convert.ToInt32(numeric[1]);
                int validWholeNumber = wholeNumberLength - decimalNumberLength;
                
                if((parsedVal.ElementAtOrDefault(0) != null && parsedVal.ElementAt(0).Length > validWholeNumber) || (parsedVal.ElementAtOrDefault(1) != null && parsedVal.ElementAt(1).Length > decimalNumberLength))
                {
                    valid = false;
                    return;
                }
            }
            else if(type == "char")
            {
                string val = (string)value;
                if (val != null)
                {
                    int length = Convert.ToInt32(format);
                    if (val.Length > length)
                    {
                        valid = false;
                        return;
                    }
                }
            }
        }
        #endregion
    }
}