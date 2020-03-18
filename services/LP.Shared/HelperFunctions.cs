using System.Collections.Generic;
using System.Data;

namespace LP.Shared
{
    public static class HelperFunctions
    {
        public static DataTable Join<T>(DataTable dataTable, Dictionary<string, T> elements, string key)
        {
            var skipColumns = new List<string>();

            var properties = typeof(T).GetProperties();
            foreach (var prop in properties)
            {
                if (!dataTable.Columns.Contains(prop.Name))
                    dataTable.Columns.Add(prop.Name, prop.PropertyType);
                else
                    skipColumns.Add(prop.Name);
            }

            // Get the Columns we Need to Generate the UI Grid
            foreach (var element in dataTable.Rows)
            {
                var dataRow = element as DataRow;

                var source = dataRow[key].ToString();

                if (!elements.ContainsKey(source))
                    continue;

                var found = elements[source];

                if (found != null)
                {
                    // Copy Data to the Row
                    foreach (var prop in properties)
                    {
                        if (!skipColumns.Contains(prop.Name))
                            dataRow[prop.Name] = prop.GetValue(found);
                    }
                }
            }

            return dataTable;
        }
    }
}