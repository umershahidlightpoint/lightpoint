using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Text;
using LP.Shared.FileMetaData;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class DataGridService : IDataGridService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public object SaveDataGridStatus(DataGridStatusDto oDataGridStatusDto)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();

                StringBuilder DataGridInsert = new StringBuilder();
                List<SqlParameter> DataGridParameters;

                if (oDataGridStatusDto.Id > 0)
                {
                    DataGridParameters = new List<SqlParameter>
                    {
                        new SqlParameter("id", oDataGridStatusDto.Id),
                        new SqlParameter("pivot_mode", oDataGridStatusDto.PivotMode),
                        new SqlParameter("column_state", oDataGridStatusDto.ColumnState),
                        new SqlParameter("group_state", oDataGridStatusDto.GroupState),
                        new SqlParameter("sort_state", oDataGridStatusDto.SortState),
                        new SqlParameter("filter_state", oDataGridStatusDto.FilterState),
                        new SqlParameter("external_filter_state", oDataGridStatusDto.ExternalFilterState)
                    };

                    DataGridInsert = new StringBuilder($@"UPDATE [data_grid_layouts] 
                                                        SET [pivot_mode] = @pivot_mode,[column_state]= @column_state  
                                                        ,[group_state]  = @group_state ,[sort_state] = @sort_state
                                                        ,[filter_state] = @filter_state, [external_filter_state] = @external_filter_state
                                                        WHERE  id= @id; SELECT   @@ROWCOUNT;");
                }
                else
                {
                    DataGridParameters = new List<SqlParameter>
                    {
                        new SqlParameter("id", oDataGridStatusDto.Id),
                        new SqlParameter("gridId", oDataGridStatusDto.GridId),
                        new SqlParameter("grid_name", oDataGridStatusDto.GridName),
                        new SqlParameter("grid_layout_name", oDataGridStatusDto.GridLayoutName),
                        new SqlParameter("userId", oDataGridStatusDto.UserId),
                        new SqlParameter("pivot_mode", oDataGridStatusDto.PivotMode),
                        new SqlParameter("column_state", oDataGridStatusDto.ColumnState),
                        new SqlParameter("group_state", oDataGridStatusDto.GroupState),
                        new SqlParameter("sort_state", oDataGridStatusDto.SortState),
                        new SqlParameter("filter_state", oDataGridStatusDto.FilterState),
                        new SqlParameter("external_filter_state", oDataGridStatusDto.ExternalFilterState),
                        new SqlParameter("is_public", oDataGridStatusDto.IsPublic ? 1 : 0)
                    };
                    DataGridInsert = new StringBuilder($@"INSERT INTO [data_grid_layouts]
                                                        ([grid_name] 
                                                        ,[userId]  
                                                        ,[grid_id]
                                                        ,[pivot_mode]  
                                                        ,[column_state]  
                                                        ,[group_state]  
                                                        ,[sort_state] 
                                                        ,[filter_state]
                                                        ,[external_filter_state]
                                                        ,[grid_layout_name]
                                                        ,[is_public]
                                                         )
                                                        VALUES
                                                        (@grid_name
                                                         ,@userId
                                                        ,@gridId
                                                        ,@pivot_mode 
                                                        ,@column_state
                                                        ,@group_state
                                                        ,@sort_state
                                                        ,@filter_state
                                                        ,@external_filter_state
                                                        ,@grid_layout_name
                                                        ,@is_public);
                                                        SELECT SCOPE_IDENTITY() AS 'Identity'");
                }

                sqlHelper.Insert(DataGridInsert.ToString(), CommandType.Text, DataGridParameters.ToArray(),
                    out int dataGridId);
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");
                return Shared.WebApi.Wrap(false);
            }

            return Shared.WebApi.Wrap(true);
        }

        public object GetDataGridStatus(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            var query = $@"SELECT TOP (1) [id]
                          ,[grid_name]
                          ,[userId]
                          ,[pivot_mode]
                          ,[column_state]
                          ,[group_state]
                          ,[sort_state]
                          ,[filter_state]
                          ,[external_filter_state]
                        FROM [data_grid_layouts]";

            DataGridStatusDto oDataGridStatusDto = new DataGridStatusDto();
            MetaData meta = new MetaData();

            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, null, out var sqlConnection))
            {
                while (reader.Read())
                {
                    oDataGridStatusDto.ColumnState = reader["column_state"].ToString();
                    oDataGridStatusDto.FilterState = reader["filter_state"].ToString();
                    oDataGridStatusDto.ExternalFilterState = reader["external_filter_state"].ToString();
                    oDataGridStatusDto.PivotMode = reader["pivot_mode"].ToString();
                    oDataGridStatusDto.SortState = reader["sort_state"].ToString();
                    oDataGridStatusDto.GroupState = reader["group_state"].ToString();
                }

                reader.Close();
                sqlConnection.Close();
            }

            return Shared.WebApi.Wrap(true, oDataGridStatusDto, HttpStatusCode.OK, null, meta);
        }

        public object GetDataGridLayouts(int gridId, int userId)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            List<SqlParameter> Parameters = new List<SqlParameter>
            {
                new SqlParameter("gridId", gridId),
                new SqlParameter("userId", userId)
            };

            var query = $@"SELECT [id], 
                        [grid_name], 
                        [grid_layout_name], 
                        [column_state], 
                        [grid_id], 
                        isnull([is_public], 0) as [is_public], 
                        [is_default]
                FROM [data_grid_layouts] where grid_id = @gridId and userid = @userId";

            MetaData meta = new MetaData();
            List<DataGridStatusDto> lDataGridStatusDto = new List<DataGridStatusDto>();

            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, Parameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    DataGridStatusDto oDataGridStatusDto = new DataGridStatusDto();
                    oDataGridStatusDto.Id = Convert.ToInt32(reader["id"]);
                    oDataGridStatusDto.GridName = reader["grid_name"].ToString();
                    oDataGridStatusDto.GridId = Convert.ToInt32(reader["grid_id"]);
                    oDataGridStatusDto.GridLayoutName = reader["grid_layout_name"].ToString();
                    oDataGridStatusDto.IsPublic = Convert.ToBoolean(reader["is_public"]);
                    oDataGridStatusDto.IsDefault = Convert.ToBoolean(reader["is_default"]);
                    oDataGridStatusDto.ColumnState = Convert.ToString(reader["column_state"]);
                    lDataGridStatusDto.Add(oDataGridStatusDto);
                }

                reader.Close();
                sqlConnection.Close();
            }

            return Shared.WebApi.Wrap(true, lDataGridStatusDto, HttpStatusCode.OK, null, meta);
        }

        public object GetAGridLayout(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            List<SqlParameter> Parameters = new List<SqlParameter>
            {
                new SqlParameter("id", id)
            };

            var query = $@"SELECT   [id]
                          ,[grid_name]
                          ,[userId]
                          ,[pivot_mode]
                          ,[column_state]
                          ,[group_state]
                          ,[sort_state]
                          ,[filter_state]
                          ,[external_filter_state]
                        FROM [data_grid_layouts] where id = @id";

            DataGridStatusDto oDataGridStatusDto = new DataGridStatusDto();
            MetaData meta = new MetaData();

            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, Parameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    oDataGridStatusDto.ColumnState = reader["column_state"].ToString();
                    oDataGridStatusDto.FilterState = reader["filter_state"].ToString();
                    oDataGridStatusDto.ExternalFilterState = reader["external_filter_state"].ToString();
                    oDataGridStatusDto.PivotMode = reader["pivot_mode"].ToString();
                    oDataGridStatusDto.SortState = reader["sort_state"].ToString();
                    oDataGridStatusDto.GroupState = reader["group_state"].ToString();
                }

                reader.Close();
                sqlConnection.Close();
            }

            return Shared.WebApi.Wrap(true, oDataGridStatusDto, HttpStatusCode.OK, null, meta);
        }

        public object DeleteGridLayout(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            try
            {
                sqlHelper.VerifyConnection();

                List<SqlParameter> Parameters = new List<SqlParameter>
                {
                    new SqlParameter("id", id)
                };

                var query = $@"DELETE FROM [data_grid_layouts] WHERE [data_grid_layouts].[id] = @id";

                sqlHelper.Delete(query, CommandType.Text, Parameters.ToArray());
                sqlHelper.CloseConnection();

                return Shared.WebApi.Wrap(true);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"SQL Exception: {ex}");
                sqlHelper.CloseConnection();

                return Shared.WebApi.Wrap(false);
            }
        }

        public object GetGridLayouts(int? userId)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            var parameters = new List<SqlParameter>();

            var query = $@"SELECT [id]
                          ,[grid_id]
                          ,[grid_name]
                          ,[grid_layout_name]
                          ,[userId]
                          ,[column_state]
                          ,[group_state]
                          ,[pivot_mode]
                          ,[sort_state]
                          ,[filter_state]
                          ,[external_filter_state]
                          ,[is_public]
                          ,[is_default]
                           FROM [data_grid_layouts]";

            if (userId != null)
            {
                parameters.Add(new SqlParameter("userId", userId));

                query += " WHERE [userId] = @userId";
            }

            List<DataGridStatusDto> dataGridStatus = new List<DataGridStatusDto>();
            MetaData metaData = new MetaData();

            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, parameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    dataGridStatus.Add(new DataGridStatusDto
                    {
                        Id = Convert.ToInt32(reader["id"]),
                        GridId = Convert.ToInt32(reader["grid_id"]),
                        GridName = reader["grid_name"].ToString(),
                        GridLayoutName = reader["grid_layout_name"].ToString(),
                        UserId = Convert.ToInt32(reader["userId"]),
                        ColumnState = reader["column_state"].ToString(),
                        GroupState = reader["group_state"].ToString(),
                        PivotMode = reader["pivot_mode"].ToString(),
                        SortState = reader["sort_state"].ToString(),
                        FilterState = reader["filter_state"].ToString(),
                        ExternalFilterState = reader["external_filter_state"].ToString(),
                        IsPublic = Convert.ToBoolean(reader["is_public"]),
                        IsDefault = Convert.ToBoolean(reader["is_default"])
                    });
                }

                reader.Close();
                sqlConnection.Close();
            }

            return Shared.WebApi.Wrap(true, dataGridStatus, HttpStatusCode.OK, null, metaData);
        }
    }
}