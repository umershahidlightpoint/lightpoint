using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Data;
using SqlDAL.Core;
using System.Data.SqlClient;
using LP.Shared.FileMetaData;

namespace LP.Finance.Common.IO
{
    public class FileManager
    {
        private string ConnectionString { get; set; }

        public FileManager(string connectionString)
        {
            ConnectionString = connectionString;
        }

        public List<FileException> MapFailedRecords(Dictionary<object, Row> failedRecords, DateTime businessDate,
    string fileName)
        {
            var records = failedRecords.Select(x => new FileException
            {
                record = JsonConvert.SerializeObject(x.Value),
                reference = Convert.ToString(x.Key),
                businessDate = businessDate,
                fileName = fileName
            }).ToList();

            return records;
        }

        public void InsertActivityAndPositionFiles(List<FileInputDto> files)
        {
            SqlHelper sqlHelper = new SqlHelper(ConnectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                foreach (var file in files)
                {
                    List<SqlParameter> fileParams = new List<SqlParameter>
                    {
                        new SqlParameter("name", file.fileName),
                        new SqlParameter("path", file.path),
                        new SqlParameter("source", file.source),
                        new SqlParameter("statistics", file.statistics),
                        new SqlParameter("business_date", file.businessDate),
                        new SqlParameter("exceptions", file.failedRecords.Count > 0 ? true : false),
                    };

                    var query = $@"INSERT INTO [file]
                               ([name]
                               ,[path]
                               ,[source]
                               ,[statistics]
                                ,[business_date]
                                ,[exceptions])
                         VALUES
                               (@name,
                               @path,
                               @source,
                               @statistics,
                                @business_date,
                                @exceptions)
                               SELECT SCOPE_IDENTITY() AS 'Identity'";

                    sqlHelper.Insert(query, CommandType.Text, fileParams.ToArray(), out int fileId);
                    file.failedRecords.ForEach(x => x.fileId = fileId);
                    new Finance.Common.SQLBulkHelper().Insert("file_exception", file.failedRecords.ToArray(),
                        sqlHelper.GetConnection(), sqlHelper.GetTransaction());

                    List<SqlParameter> fileActionParams = new List<SqlParameter>()
                    {
                        new SqlParameter("file_id", fileId),
                        new SqlParameter("action", file.action),
                        new SqlParameter("action_start_date", DateTime.UtcNow),
                        new SqlParameter("action_end_date", DateTime.UtcNow)
                    };


                    query = $@"INSERT INTO[dbo].[file_action]
                           ([file_id]
                           ,[action]
                           ,[action_start_date]
                           ,[action_end_date])
                         VALUES
                           (@file_id
                           ,@action
                           ,@action_start_date
                           ,@action_end_date)";

                    sqlHelper.Insert(query, CommandType.Text, fileActionParams.ToArray());
                }

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
            }
        }

    }
}
