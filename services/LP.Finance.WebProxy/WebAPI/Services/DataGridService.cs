﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Newtonsoft.Json;
using SqlDAL.Core;
using System.Text;
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

                List<SqlParameter> DataGridParameters = new List<SqlParameter>
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
                    new SqlParameter("filter_state", oDataGridStatusDto.FilterState)
                };

                StringBuilder DataGridInsert = new StringBuilder(
                    $@"IF EXISTS (SELECT * FROM [data_grid_layouts] WHERE id= @id )
                          BEGIN        UPDATE [data_grid_layouts] SET [pivot_mode]  = @pivot_mode,[column_state]= @column_state  
                                                               ,[group_state]  = @group_state ,[sort_state] = @sort_state
                                                               ,[filter_state] = @filter_state 
                                              WHERE  id= @id  ;
                                                 SELECT   @@ROWCOUNT ;
                                                   END
                                                    ELSE
                                                   BEGIN
                                                INSERT INTO  [data_grid_layouts]
                                                                        ([grid_name] 
                                                                        ,[userId]  
                                                                        ,[grid_id]
                                                                        ,[pivot_mode]  
                                                                        ,[column_state]  
                                                                        ,[group_state]  
                                                                        ,[sort_state] 
                                                                        ,[filter_state]
                                                                        ,[grid_layout_name]
                                                                         )
                                                                        VALUES
                                                                        (@grid_name
                                                                         ,@gridId
                                                                        ,@userId
                                                                        ,@pivot_mode 
                                                                        ,@column_state
                                                                        ,@group_state
                                                                        ,@sort_state
                                                                        ,@filter_state
                                                                        ,@grid_layout_name);
                                                                        SELECT SCOPE_IDENTITY() AS 'Identity' 
                                                                          END ");

                sqlHelper.Insert(DataGridInsert.ToString(), CommandType.Text, DataGridParameters.ToArray(), out int dataGridId);
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
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
                      FROM [Finance].[dbo].[data_grid_layouts]";



            DataGridStatusDto oDataGridStatusDto = new DataGridStatusDto();
            MetaData meta = new MetaData();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text,null  , out var sqlConnection))
            {
                while (reader.Read())
                {
                    oDataGridStatusDto.ColumnState = reader["column_state"].ToString();
                    oDataGridStatusDto.FilterState = reader["filter_state"].ToString();
                    oDataGridStatusDto.PivotMode = reader["pivot_mode"].ToString();
                    oDataGridStatusDto.SortState = reader["sort_state"].ToString();
                    oDataGridStatusDto.GroupState = reader["group_state"].ToString();
                }

                reader.Close();
                sqlConnection.Close();
            } 
            
            return Utils.Wrap(true, oDataGridStatusDto, meta);
        }


        public object GetDataGridLayouts(int gridId,int userId)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            List<SqlParameter> Parameters = new List<SqlParameter>
                {
                    new SqlParameter("gridId", gridId) ,
                    new SqlParameter("userId", userId) 
                     
                };

            var query = $@" SELECT [id]  ,[grid_name] ,[grid_layout_name] ,[grid_id]
                                  FROM [dbo].[data_grid_layouts] where grid_id = @gridId and userid = @userId";
             
           
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
                    lDataGridStatusDto.Add(oDataGridStatusDto);
                }

                reader.Close();
                sqlConnection.Close();
            }

            return Utils.Wrap(true, lDataGridStatusDto, meta);
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
                      FROM [Finance].[dbo].[data_grid_layouts] where id =@id";



            DataGridStatusDto oDataGridStatusDto = new DataGridStatusDto();
            MetaData meta = new MetaData();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, Parameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    oDataGridStatusDto.ColumnState = reader["column_state"].ToString();
                    oDataGridStatusDto.FilterState = reader["filter_state"].ToString();
                    oDataGridStatusDto.PivotMode = reader["pivot_mode"].ToString();
                    oDataGridStatusDto.SortState = reader["sort_state"].ToString();
                    oDataGridStatusDto.GroupState = reader["group_state"].ToString();
                }

                reader.Close();
                sqlConnection.Close();
            }

            return Utils.Wrap(true, oDataGridStatusDto, meta);
        }
    }
}
 