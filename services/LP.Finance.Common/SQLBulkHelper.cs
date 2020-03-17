using System.Data;
using System.Data.SqlClient;
using System.Collections.Concurrent;

namespace LP.Finance.Common
{
    public class SQLBulkHelper
    {
        private static ConcurrentDictionary<string, DataTable> cachedMetaData = new ConcurrentDictionary<string, DataTable>();

        public void Insert(string tablename, IDbModel[] models, SqlConnection connection, SqlTransaction transaction,
            bool fireTriggers = false, bool checkConstraints = false)
        {
            if (models.Length == 0)
                return;

            DataTable table = null;

            if ( cachedMetaData.ContainsKey(tablename))
            {
                table = cachedMetaData[tablename].Clone();
            }
            else
            {
                table = models[0].MetaData(connection);
                cachedMetaData.TryAdd(tablename, table.Clone());
            }

            foreach (var model in models)
            {
                var row = table.NewRow();
                model.PopulateRow(row);
                table.Rows.Add(row);
            }


            SqlBulkCopyOptions options;
            if (fireTriggers && checkConstraints)
            {
                options = SqlBulkCopyOptions.FireTriggers | SqlBulkCopyOptions.CheckConstraints;
            }
            else if (fireTriggers)
            {
                options = SqlBulkCopyOptions.FireTriggers;
            }
            else if (checkConstraints)
            {
                options = SqlBulkCopyOptions.CheckConstraints;
            }
            else
            {
                options = SqlBulkCopyOptions.Default;
            }

            // Do not put this in a transaction
            using (var bulk = new SqlBulkCopy(connection.ConnectionString,
                options))
            {
                bulk.BulkCopyTimeout = 60*10;
                bulk.BatchSize = 100000;
                bulk.DestinationTableName = tablename;

                foreach (DataColumn c in table.Columns)
                {
                    bulk.ColumnMappings.Add(c.ColumnName, c.ColumnName);
                }

                bulk.WriteToServer(table);
            }
        }

        public void Insert(string tablename, DataTable sourceData, SqlConnection connection, SqlTransaction transaction,
            bool fireTriggers = false, bool checkConstraints = false)
        {
            if (sourceData.Rows.Count == 0)
                return;

            SqlBulkCopyOptions options;
            if (fireTriggers && checkConstraints)
            {
                options = SqlBulkCopyOptions.FireTriggers | SqlBulkCopyOptions.CheckConstraints;
            }
            else if (fireTriggers)
            {
                options = SqlBulkCopyOptions.FireTriggers;
            }
            else if (checkConstraints)
            {
                options = SqlBulkCopyOptions.CheckConstraints;
            }
            else
            {
                options = SqlBulkCopyOptions.Default;
            }

            using (var bulk = new SqlBulkCopy(connection,
                options, transaction))
            {
                bulk.BulkCopyTimeout = 60 * 10;
                bulk.BatchSize = 100000;
                bulk.DestinationTableName = tablename;

                foreach (DataColumn c in sourceData.Columns)
                {
                    bulk.ColumnMappings.Add(c.ColumnName, c.ColumnName);
                }

                bulk.WriteToServer(sourceData);
            }
        }

    }
}