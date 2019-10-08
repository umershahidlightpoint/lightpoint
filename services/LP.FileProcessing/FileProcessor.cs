using LP.FileProcessing.MetaData;
using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Reflection;

/*
* Start of a common library for generating and consuming files
*/
namespace LP.FileProcessing
{
    public class FileProcessor
    {
        // Header & Footer's required as part of the file generation
        public int GenerateFile<T>(IEnumerable<T> recordList, object headerObj, object trailerObj, string path,
            string fileName, string identifierForFailedRecords, out Dictionary<object, dynamic> failedRecords)
        {
            int recordCount;
            var schema = Utils.GetFile<SilverFileFormat>(fileName, "FileFormats");
            List<dynamic> record = MapFileRecord(recordList, schema.record, identifierForFailedRecords,
                out failedRecords, out recordCount);
            List<dynamic> header = MapFileSection(headerObj, schema.header, recordCount + 2);
            List<dynamic> trailer = MapFileSection(trailerObj, schema.trailer, recordCount + 2);
            WritePipe(record, header, trailer, path, schema);
            return record.Count();
        }

        public object ImportFile(string path, string fileName, out List<dynamic> failedFieldsList, out bool successful)
        {
            var schema = Utils.GetFile<SilverFileFormat>(fileName, "FileFormats");
            var resp = ExtractPipe(path, schema, out failedFieldsList, out successful);
            return resp;
        }

        private List<dynamic> MapFileRecord<T>(IEnumerable<T> transactionList, List<FileProperties> schema,
            string identifierForFailedRecords, out Dictionary<object, dynamic> failedRecords, out int records)
        {
            List<dynamic> sectionList = new List<dynamic>();
            failedRecords = new Dictionary<object, dynamic>();
            records = 0;
            int index = 0;
            foreach (var item in transactionList)
            {
                dynamic obj;
                List<dynamic> failedFields;
                dynamic record = new ExpandoObject();
                bool valid;
                MapItem(schema, item, out obj, out failedFields, out valid);
                if (valid)
                {
                    sectionList.Add(obj);
                    records++;
                }
                else
                {
                    //TODO
                    //Skip the record and store it in a dictionary in order to persist it in the FileException table with an indentifier and a json of all failed fields.
                    var prop = item.GetType().GetProperty(identifierForFailedRecords);
                    var value = prop?.GetValue(item, null);
                    if (value != null)
                    {
                        //AddProperty(failedFields, "index", index);
                        AddProperty(record, "Record", failedFields);
                        AddProperty(record, "RowNumber", index);
                        failedRecords.Add(value, record);
                    }
                }

                index++;
            }

            return sectionList;
        }

        private List<dynamic> MapFileSection(object item, List<FileProperties> schema, int recordCount = 0)
        {
            List<dynamic> sectionList = new List<dynamic>();
            dynamic obj;
            List<dynamic> failedFields;
            bool valid;
            MapItem(schema, item, out obj, out failedFields, out valid, recordCount);
            sectionList.Add(obj);
            return sectionList;
        }

        private void MapItem(List<FileProperties> schema, object item, out dynamic obj, out List<dynamic> failedFieldsList, out bool successful, int recordCount = 0)
        {
            successful = true;
            List<dynamic> failedMetaData = new List<dynamic>();
            failedFieldsList = new List<dynamic>();
            obj = new ExpandoObject();
            foreach (var map in schema)
            {
                var prop = item.GetType().GetProperty(map.Source);
                var value = prop != null ? prop.GetValue(item, null) : null;
                bool valid = true;
                bool isValid = true;
                string message = null;

                if (map.Required.Equals("true") && value != null)
                {
                    isValid = false;
                    successful = false;
                    message = "This is a required field";
                }

                else if (!String.IsNullOrEmpty(map.Type))
                {

                    // for format validation
                    if (!String.IsNullOrEmpty(map.Function) && !String.IsNullOrEmpty(map.Format) &&
                        !String.IsNullOrEmpty(map.Type))
                    {
                        Type thisType = this.GetType();
                        MethodInfo theMethod = thisType.GetMethod(map.Function);
                        object[] parametersArray = { value, map.Format, map.Type, valid, message };
                        var val = theMethod.Invoke(this, parametersArray);
                        isValid = (bool)parametersArray[3];
                        message = (string)parametersArray[4];
                        var returnType = theMethod.ReturnType;
                        if (returnType != typeof(void))
                        {
                            value = val;
                        }
                    }

                    // for data conversion
                    else if (!String.IsNullOrEmpty(map.Function))
                    {
                        Type thisType = this.GetType();
                        MethodInfo theMethod = thisType.GetMethod(map.Function);
                        object[] parametersArray = { value, valid, message };
                        var val = theMethod.Invoke(this, parametersArray);
                        isValid = (bool)parametersArray[1];
                        message = (string)parametersArray[2];
                        var returnType = theMethod.ReturnType;
                        if (returnType != typeof(void))
                        {
                            value = val;
                        }
                    }
                }
                else
                {
                    isValid = false;
                    successful = false;
                    message = "Type not specified in meta data definition";
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
                    successful = false;
                    dynamic failedFields = new ExpandoObject();
                    AddProperty(failedFields, "Name", map.Destination);
                    AddProperty(failedFields, "Value", value);
                    AddProperty(failedFields, "Message", message);
                    AddProperty(failedFields, "MetaData", map);
                    failedFieldsList.Add(failedFields);
                    //AddProperty(failedFields, "MetaData", map);
                    //failedMetaData.Add(map);
                }
            }

            if (!successful)
            {
                //AddProperty(failedFields, "MetaData", failedMetaData);
            }
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

        public List<dynamic> ExtractPipe(string path, SilverFileFormat properties, out List<dynamic> failedFieldsList, out bool successful)
        {
            return ExtractDelimited(path, properties, out failedFieldsList, out successful, '|');
        }

        private List<dynamic> ExtractDelimited(string path, SilverFileFormat properties, out List<dynamic> failedFieldsList, out bool successful, char v = ',')
        {
            var recordDictionary = properties.record.Select((s, i) => new {s, i})
                .ToDictionary(x => x.i, x => x.s);
            var headerDictionary = properties.record.Select((s, i) => new {s, i})
                .ToDictionary(x => x.i, x => x.s);
            var trailerDictionary = properties.record.Select((s, i) => new {s, i})
                .ToDictionary(x => x.i, x => x.s);

            failedFieldsList = new List<dynamic>();
            successful = true;

            //string test = "a|b||c|||d";
            int index = 0;
            var headerProperties = properties.header;
            int recordOffset = headerProperties.FindIndex(x => x.Source == "RECORD_COUNT");
            int? totalRecords = null;
            string message = null;
            List<dynamic> record = new List<dynamic>();
            List<dynamic> trailer = new List<dynamic>();
            List<dynamic> header = new List<dynamic>();
            foreach (var line in System.IO.File.ReadLines(path))
            {
                int dictionaryIndex = 0;
                dynamic obj = new ExpandoObject();
                List<dynamic> objList = new List<dynamic>();
                var delimited = line.Split(v);
                bool isValid = true;
                bool valid = true;
                foreach (var item in delimited)
                {
                    if (index == 0)
                    {
                        if (dictionaryIndex == recordOffset)
                        {
                            totalRecords = Convert.ToInt32(item);
                        }

                        AddProperty(obj, headerDictionary[dictionaryIndex].Destination, item);
                    }
                    else if (totalRecords.HasValue && index == totalRecords + 1)
                    {
                        AddProperty(obj, trailerDictionary[dictionaryIndex].Destination, item);
                    }
                    else
                    {
                        if (String.IsNullOrEmpty(recordDictionary[dictionaryIndex].Type))
                        {
                            isValid = false;
                            message = "Type not specified in meta data definition";
                        }
                        else if(!String.IsNullOrEmpty(recordDictionary[dictionaryIndex].Function) && !String.IsNullOrEmpty(recordDictionary[dictionaryIndex].Format))
                        {
                            Type thisType = this.GetType();
                            MethodInfo theMethod = thisType.GetMethod(recordDictionary[dictionaryIndex].Function);
                            object[] parametersArray = { item, recordDictionary[dictionaryIndex].Format, recordDictionary[dictionaryIndex].Type, valid, message };
                            var val = theMethod.Invoke(this, parametersArray);
                            isValid = (bool)parametersArray[3];
                            message = (string)parametersArray[4];
                        }
                        AddProperty(obj, recordDictionary[dictionaryIndex].Destination, item);
                    }

                    if (!isValid)
                    {
                        successful = false;
                        dynamic failedFields = new ExpandoObject();
                        AddProperty(failedFields, "Name", recordDictionary[dictionaryIndex].Destination);
                        AddProperty(failedFields, "Value", item);
                        AddProperty(failedFields, "Message", message);
                        AddProperty(failedFields, "MetaData", recordDictionary[dictionaryIndex]);
                        objList.Add(failedFields);
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

                if (objList.Count > 0)
                {
                    failedFieldsList.Add(objList);
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

        #region Helper Functions for data pre-processing

        public object GetDate(object value, string format, string type, out bool valid, out string exception)
        {
            exception = null;
            valid = true;
            if (value != null)
            {
                var date = (DateTime)value;
                return date.ToString(format);
            }
            else
            {
                return null;
            }
        }
        
        public object LongShortConversion(object value, out bool valid, out string exception)
        {
            valid = true;
            exception = "";
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
                    valid = false;
                    exception = "Allowed values are long and short only";
                    return null;
                }
            }
            else
            {
                return null;
            }
        }

        public void CheckFormat(object value, string format, string type, out bool valid, out string exception)
        {
            valid = true;
            exception = "";
            if(type == "decimal")
            {
                string val = Convert.ToString(value);
                string[] parsedVal = val.Split('.');
                string[] numeric = format.Split(',');
                int wholeNumberLength = Convert.ToInt32(numeric[0]);
                int decimalNumberLength = Convert.ToInt32(numeric[1]);
                int validWholeNumber = wholeNumberLength - decimalNumberLength;
                
                if(parsedVal.ElementAtOrDefault(0) != null && parsedVal.ElementAt(0).Length > validWholeNumber)
                {
                    valid = false;
                    exception = "Whole number part contains " + $"{parsedVal.ElementAt(0).Length} digit(s). Only {validWholeNumber} digit(s) are allowed";
                    return;
                }
                else if (parsedVal.ElementAtOrDefault(1) != null && parsedVal.ElementAt(1).Length > decimalNumberLength)
                {
                    valid = false;
                    exception = "Decimal part contains " + $"{parsedVal.ElementAt(1).Length} digit(s). Only {decimalNumberLength} digit(s) are allowed";
                    return;
                }
            }
            else if (type == "char")
            {
                string val = (string) value;
                if (val != null)
                {
                    int length = Convert.ToInt32(format);
                    if (val.Length > length)
                    {
                        exception = "Value contains " + $"{val.Length} character(s). Only {length} character(s) are allowed";
                        valid = false;
                        return;
                    }
                }
            }
        }

        #endregion
    }
}