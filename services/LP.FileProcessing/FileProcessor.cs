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
        public Tuple<Dictionary<object, Row>, int> ExportFile<T>(IEnumerable<T> recordList, object headerObj,
            object trailerObj, string path,
            string fileName, string identifierForFailedRecords)
        {
            var schema = Utils.GetFile<SilverFileFormat>(fileName, "FileFormats");
            var record = MapFileRecord(recordList, schema.record, identifierForFailedRecords);
            var header = MapFileSection(headerObj, schema.header, record.Item3 + 2);
            var trailer = MapFileSection(trailerObj, schema.trailer, record.Item3 + 2);
            WritePipe(record.Item1, header, trailer, path, schema);
            return new Tuple<Dictionary<object, Row>, int>(record.Item2, record.Item1.Count());
        }

        public Tuple<List<dynamic>, List<Row>, bool> ImportFile(string path, string fileName, string folderName,
            char delim)
        {
            var schema = Utils.GetFile<SilverFileFormat>(fileName, folderName);
            var resp = ExtractPipe(path, schema, delim);
            return resp;
        }

        private Tuple<List<dynamic>, Dictionary<object, Row>, int> MapFileRecord<T>(IEnumerable<T> transactionList,
            List<FileProperties> schema,
            string identifierForFailedRecords)
        {
            List<dynamic> sectionList = new List<dynamic>();
            var failedRecords = new Dictionary<object, Row>();
            int records = 0;
            int index = 0;
            foreach (var item in transactionList)
            {
                var result = MapItem(schema, item);
                if (result.Item3)
                {
                    sectionList.Add(result.Item1);
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
                        Row row = new Row()
                        {
                            Fields = result.Item2,
                            RowNumber = index
                        };

                        failedRecords.Add(value, row);
                    }
                }

                index++;
            }

            return new Tuple<List<dynamic>, Dictionary<object, Row>, int>(sectionList, failedRecords, records);
        }

        private List<dynamic> MapFileSection(object item, List<FileProperties> schema, int recordCount = 0)
        {
            List<dynamic> sectionList = new List<dynamic>();
            var result = MapItem(schema, item, recordCount);
            sectionList.Add(result.Item1);
            return sectionList;
        }

        private Tuple<dynamic, List<IField>, bool> MapItem(List<FileProperties> schema, object item,
            int recordCount = 0)
        {
            bool successful = true;
            var failedFields = new List<IField>();
            dynamic obj = new ExpandoObject();
            foreach (var map in schema)
            {
                var prop = item.GetType().GetProperty(map.Source);
                var value = prop?.GetValue(item, null);
                bool isValid = true;
                string message = null;

                if (map.Required.Equals("true") && value == null)
                {
                    isValid = false;
                    successful = false;
                    message = "This is a required field";
                }

                else if (!String.IsNullOrEmpty(map.Type))
                {
                    // for format validation and data conversion
                    if (!String.IsNullOrEmpty(map.Function) && !String.IsNullOrEmpty(map.Format) &&
                        !String.IsNullOrEmpty(map.Type))
                    {
                        Type thisType = this.GetType();
                        MethodInfo theMethod = thisType.GetMethod(map.Function);
                        object[] parametersArray = {value, map.Format, map.Type};
                        var val = (Tuple<object, bool, string>) theMethod.Invoke(this, parametersArray);
                        isValid = val.Item2;
                        message = val.Item3;
                        value = val.Item1;
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
                    Field record = new Field()
                    {
                        Name = map.Destination,
                        Message = message,
                        Value = value,
                        MetaData = map
                    };
                    failedFields.Add(record);
                }
            }

            return new Tuple<dynamic, List<IField>, bool>(obj, failedFields, successful);
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

        public Tuple<List<dynamic>, List<Row>, bool> ExtractPipe(string path, SilverFileFormat properties, char delim)
        {
            return ExtractDelimited(path, properties, delim);
        }

        private Tuple<List<dynamic>, List<Row>, bool> ExtractDelimited(string path, SilverFileFormat properties,
            char v = ',')
        {
            var recordDictionary = properties.record.Select((s, i) => new {s, i})
                .ToDictionary(x => x.i, x => x.s);
            var headerDictionary = properties.header.Select((s, i) => new {s, i})
                .ToDictionary(x => x.i, x => x.s);
            var trailerDictionary = properties.trailer.Select((s, i) => new {s, i})
                .ToDictionary(x => x.i, x => x.s);

            List<Row> failedFieldsList = new List<Row>();
            bool successful = true;

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
                List<IField> failedRecords = new List<IField>();
                var delimited = line.Split(v);
                bool isValid = true;
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
                        else if (!String.IsNullOrEmpty(recordDictionary[dictionaryIndex].Function) &&
                                 !String.IsNullOrEmpty(recordDictionary[dictionaryIndex].Format))
                        {
                            Type thisType = this.GetType();
                            MethodInfo theMethod = thisType.GetMethod(recordDictionary[dictionaryIndex].Function);
                            object[] parametersArray =
                            {
                                item, recordDictionary[dictionaryIndex].Format, recordDictionary[dictionaryIndex].Type
                            };
                            var val = (Tuple<object, bool, string>) theMethod.Invoke(this, parametersArray);
                            isValid = val.Item2;
                            message = val.Item3;
                        }

                        AddProperty(obj, recordDictionary[dictionaryIndex].Destination, item);
                    }

                    if (!isValid)
                    {
                        successful = false;
                        Field failedField = new Field()
                        {
                            Name = recordDictionary[dictionaryIndex].Destination,
                            Message = message,
                            Value = item,
                            MetaData = recordDictionary[dictionaryIndex]
                        };
                        failedRecords.Add(failedField);
                    }

                    dictionaryIndex++;
                }

                if (index == 0)
                {
                    header.Add(obj);
                }
                else if (totalRecords.HasValue && index == totalRecords - 1)
                {
                    trailer.Add(obj);
                }
                else
                {
                    record.Add(obj);
                }

                if (failedRecords.Count > 0)
                {
                    Row failedRow = new Row()
                    {
                        Fields = failedRecords,
                        RowNumber = index
                    };

                    failedFieldsList.Add(failedRow);
                }

                index++;
            }

            return new Tuple<List<dynamic>, List<Row>, bool>(record, failedFieldsList, successful);
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

        public Tuple<object, bool, string> GetDate(object value, string format, string type)
        {
            string exception = null;
            bool valid = true;
            DateTime? date = null;
            string convertedDate;
            if (value != null)
            {
                try
                {
                    if (value is string)
                    {
                        date = Convert.ToDateTime(value);
                    }
                    else if (value is DateTime)
                    {
                        date = (DateTime) value;
                    }
                }
                catch (Exception ex)
                {
                    valid = false;
                    exception = ex.Message;
                    return new Tuple<object, bool, string>(null, valid, exception);
                }

                try
                {
                    convertedDate = date.Value.ToString(format);
                }
                catch (Exception ex)
                {
                    valid = false;
                    exception = ex.Message;
                    return new Tuple<object, bool, string>(null, valid, exception);
                }

                return new Tuple<object, bool, string>(convertedDate, valid, exception);
            }
            else
            {
                return new Tuple<object, bool, string>(null, valid, exception);
            }
        }

        public Tuple<object, bool, string> LongShortConversion(object value, string format = null, string type = null)
        {
            bool valid = true;
            string exception = "";
            var position = (string) value;
            if (position != null)
            {
                if (position.ToLower() == "long")
                {
                    return new Tuple<object, bool, string>(true, valid, exception);
                }
                else if (position.ToLower() == "short")
                {
                    return new Tuple<object, bool, string>(false, valid, exception);
                }
                else
                {
                    valid = false;
                    exception = "Allowed values are long and short only";
                    return new Tuple<object, bool, string>(null, valid, exception);
                }
            }
            else
            {
                return new Tuple<object, bool, string>(null, valid, exception);
            }
        }

        public Tuple<object, bool, string> CheckFormat(object value, string format, string type)
        {
            bool valid = true;
            string exception = "";
            if (type == "decimal")
            {
                string val = Convert.ToString(value);
                string[] parsedVal = val.Split('.');
                string[] numeric = format.Split(',');
                int wholeNumberLength = Convert.ToInt32(numeric[0]);
                int decimalNumberLength = Convert.ToInt32(numeric[1]);
                int validWholeNumber = wholeNumberLength - decimalNumberLength;

                if (parsedVal.ElementAtOrDefault(0) != null && parsedVal.ElementAt(0).Length > validWholeNumber)
                {
                    valid = false;
                    exception = "Whole number part contains " +
                                $"{parsedVal.ElementAt(0).Length} digit(s). Only {validWholeNumber} digit(s) are allowed";
                }
                else if (parsedVal.ElementAtOrDefault(1) != null && parsedVal.ElementAt(1).Length > decimalNumberLength)
                {
                    valid = false;
                    exception = "Decimal part contains " +
                                $"{parsedVal.ElementAt(1).Length} digit(s). Only {decimalNumberLength} digit(s) are allowed";
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
                        exception = "Value contains " +
                                    $"{val.Length} character(s). Only {length} character(s) are allowed";
                        valid = false;
                    }
                }
            }

            return new Tuple<object, bool, string>(value, valid, exception);
        }

        #endregion
    }
}