using System;
using System.Collections.Generic;
using System.Data;
using System.Reflection;

namespace LP.Shared.FileMetaData
{
    public class MetaData
    {
        public int Total { get; set; }
        public int TotalRecords { get; set; }
        public List<FilterValues> Filters { get; set; }
        public object FundsRange { get; set; }
        public int? LastRow { get; set; }
        public bool FooterSum { get; set; }
        public List<ColumnDef> Columns { get; set; }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="table">DataTable that contains the information we need to construct a grid on the UI</param>
        /// <returns></returns>
        public static MetaData ToMetaData(DataTable table)
        {
            var metaData = new MetaData
            {
                Columns = new List<ColumnDef>()
            };
            foreach (DataColumn col in table.Columns)
            {
                metaData.Columns.Add(new ColumnDef
                {
                    filter = true,
                    headerName =
                        col.ColumnName, // This will be driven by a Data Dictionary that will provide the write names in the System
                    field = col.ColumnName,
                    Type = col.DataType.ToString()
                });
            }

            return metaData;
        }

        public static MetaData ToMetaData(object table)
        {
            var metaData = new MetaData();
            metaData.Columns = new List<ColumnDef>();

            Type t = table.GetType();
            PropertyInfo[] props = t.GetProperties();

            foreach (var col in props)
            {
                metaData.Columns.Add(new ColumnDef
                {
                    filter = true,
                    headerName =
                        col.Name, // This will be driven by a Data Dictionary that will provide the write names in the System
                    field = col.Name,
                    Type = col.GetType().ToString()
                });
            }

            return metaData;
        }
    }
}