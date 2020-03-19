using System;
using System.Collections.Generic;
using System.Dynamic;
using System.IO;
using System.Linq;
using System.Reflection;
using LP.Shared.FileMetaData;

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
            var schema = LP.Shared.Utils.GetFile<FileFormat>(fileName, "ExportFormats");
            var record = MapFileRecord(recordList, schema.record, identifierForFailedRecords);
            var header = MapFileSection(headerObj, schema.header, record.Item3 + 2);
            var trailer = MapFileSection(trailerObj, schema.trailer, record.Item3 + 2);
            WritePipe(record.Item1, header, trailer, path, schema);
            return new Tuple<Dictionary<object, Row>, int>(record.Item2, record.Item1.Count());
        }
        /// <summary>Used to import contents of a file.
        /// <para>A meta data json file is required which defines the data that is being uploaded.</para>
        /// The param <paramref name="path"/> takes in the complete path of the uploaded file.
        /// The param <paramref name="fileName"/> takes in name of the meta data json file. For e.g if the file name is Trade.json, you will pass in Trade.
        /// The param <paramref name="folderName"/> takes in name of the folder which contains the meta data json file.
        /// The param <paramref name="delim"/> takes in a character which represents the delimited file for e.g in case it is a csv file, you will pass in ','.
        /// The param <paramref name="firstLineHasHeadings"/> takes in a boolean which siginifies if the uploaded file contains headings or not. Default value is false.
        /// </summary>
        /// <returns>Returns a tuple with the first item being list of uploaded content, 
        /// second item contains a list of exceptions for each row,
        /// and the last item is a boolean tells whether the whole import process was successful or not</returns>
        public Tuple<List<dynamic>, List<Row>, bool> ImportFile(string path, string fileName, string folderName,
            char delim, bool firstLineHasHeadings = false)
        {
            var schema = LP.Shared.Utils.GetFile<FileFormat>(fileName, folderName);
            var resp = ExtractPipe(path, schema, delim, firstLineHasHeadings);
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
                    if (map.Function.Count > 0 && !String.IsNullOrEmpty(map.Format) &&
                        !String.IsNullOrEmpty(map.Type))
                    {
                        foreach (var func in map.Function)
                        {
                            Type thisType = Type.GetType(func.Assembly); ;
                            MethodInfo theMethod = thisType.GetMethod(func.Name);
                            object[] parametersArray = { value, map.Format, map.Type };
                            var val = (Tuple<object, bool, string>)theMethod.Invoke(this, parametersArray);
                            isValid = val.Item2;
                            message = val.Item3;
                            value = val.Item1;
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
                    var record = new Field()
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
            string path, FileFormat properties)
        {
            WriteDelimited(items, header, trailer, path, properties);
        }

        public void WritePipe(IEnumerable<dynamic> items, IEnumerable<dynamic> header, IEnumerable<dynamic> trailer,
            string path, FileFormat properties)
        {
            WriteDelimited(items, header, trailer, path, properties, '|');
        }

        public Tuple<List<dynamic>, List<Row>, bool> ExtractPipe(string path, FileFormat properties, char delim, bool firstLineHasHeadings = false)
        {
            return ExtractDelimited(path, properties, delim, firstLineHasHeadings);
        }

        private Tuple<List<dynamic>, List<Row>, bool> ExtractDelimited(string path, FileFormat properties,
            char v = ',', bool firstLineHasHeadings = false)
        {
            try
            {
                var recordDictionary = properties.record.Select((s, i) => new { s, i })
                    .ToDictionary(x => x.i, x => x.s);
                var headerDictionary = properties.header.Select((s, i) => new { s, i })
                    .ToDictionary(x => x.i, x => x.s);
                var trailerDictionary = properties.trailer.Select((s, i) => new { s, i })
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
                    if (firstLineHasHeadings && index == 0)
                    {
                        index++;
                        continue;
                    }

                    int dictionaryIndex = 0;
                    dynamic obj = new ExpandoObject();
                    List<IField> failedRecords = new List<IField>();
                    var delimited = line.Split(v);
                    bool isValid = true;
                    foreach (var item in delimited)
                    {
                        string value = item;
                        if (index == 0 && headerDictionary.Count > 0)
                        {
                            if (dictionaryIndex == recordOffset)
                            {
                                totalRecords = Convert.ToInt32(value);
                            }

                            AddProperty(obj, headerDictionary[dictionaryIndex].Destination, value);
                        }
                        else if (totalRecords.HasValue && index == totalRecords - 1)
                        {
                            AddProperty(obj, trailerDictionary[dictionaryIndex].Destination, value);
                        }
                        else
                        {
                            if (!string.IsNullOrEmpty(value) && !string.IsNullOrEmpty(recordDictionary[dictionaryIndex].Type))
                            {
                                Type thisType = Type.GetType("LP.Shared.FileProcessingUtils,LP.Shared");
                                MethodInfo theMethod = thisType.GetMethod("IsValidDataType");
                                object[] parametersArray =
                                {
                                            value, recordDictionary[dictionaryIndex].Type
                                        };
                                var val = (Tuple<object, bool, string>)theMethod.Invoke(this, parametersArray);
                                value = (string)val.Item1;
                                isValid = val.Item2;
                                message = val.Item3;
                            }

                            if (String.IsNullOrEmpty(recordDictionary[dictionaryIndex].Type))
                            {
                                isValid = false;
                                message = "Type not specified in meta data definition";
                            }
                            else if (!string.IsNullOrEmpty(recordDictionary[dictionaryIndex].Required) && recordDictionary[dictionaryIndex].Required.Equals("true") && string.IsNullOrEmpty(value))
                            {
                                isValid = false;
                                message = "This is a required field";
                            }
                            
                            else if (recordDictionary[dictionaryIndex].Function.Count > 0)
                            {
                                foreach (var func in recordDictionary[dictionaryIndex].Function)
                                {
                                    if (!string.IsNullOrEmpty(func.Assembly) && !string.IsNullOrEmpty(func.Name))
                                    {
                                        Type thisType = Type.GetType(func.Assembly);
                                        MethodInfo theMethod = thisType.GetMethod(func.Name);
                                        object[] parametersArray =
                                        {
                                            value, recordDictionary[dictionaryIndex].Format, recordDictionary[dictionaryIndex].Type
                                        };
                                        var val = (Tuple<object, bool, string>)theMethod.Invoke(this, parametersArray);
                                        value = (string)val.Item1;
                                        isValid = val.Item2;
                                        message = val.Item3;
                                    }
                                    else if (string.IsNullOrEmpty(func.Assembly))
                                    {
                                        isValid = false;
                                        message = "Assemmbly name not specified";
                                    }
                                    else
                                    {
                                        isValid = false;
                                        message = "Function name not specified";
                                    }

                                    //continue execution of the next function only if the previous function returns true.
                                    if (isValid)
                                    {
                                        continue;
                                    }
                                    else
                                    {
                                        break;
                                    }
                                }
                            }
                          
                            AddProperty(obj, recordDictionary[dictionaryIndex].Destination, value);
                        }

                        if (!isValid)
                        {
                            successful = false;
                            isValid = true;
                            Field failedField = new Field()
                            {
                                Name = recordDictionary[dictionaryIndex].Destination,
                                Message = message,
                                Value = value,
                                MetaData = recordDictionary[dictionaryIndex]
                            };
                            failedRecords.Add(failedField);
                        }

                        dictionaryIndex++;
                    }

                    if (index == 0 && headerDictionary.Count > 0)
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
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void WriteDelimited(IEnumerable<dynamic> items, IEnumerable<dynamic> header,
            IEnumerable<dynamic> trailer, string path, FileFormat properties, char delim = ',')
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
    }
}