using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Newtonsoft.Json;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class ConfigurationService : IConfigurationService
    {
        private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        public SqlHelper SqlHelper = new SqlHelper(ConnectionString);

        public object AddConfig(List<ConfigurationInputDto> obj)
        {
            try
            {
                SqlHelper.VerifyConnection();
                var createdDate = DateTime.Now;
                var createdBy = "user";
                int userId = 1;

                List<List<SqlParameter>> paramList = new List<List<SqlParameter>>();

                foreach (var item in obj)
                {
                    List<SqlParameter> configParams = new List<SqlParameter>
                    {
                        new SqlParameter("createdBy", createdBy),
                        new SqlParameter("createdDate", createdDate),
                        new SqlParameter("userid", userId),
                        new SqlParameter("project", item.Project),
                        new SqlParameter("uom", item.UOM),
                        new SqlParameter("key", item.Key),
                        new SqlParameter("value", item.Value),
                        new SqlParameter("description", item.Description),
                    };
                    paramList.Add(configParams);
                }

                var query = $@"INSERT INTO [configurations]
                           ([created_by]
                           ,[created_date]
                           ,[project]
                           ,[user_id]
                           ,[uom]
                           ,[key]
                           ,[value]
                           ,[description])
                     VALUES
                           (@createdBy
                           ,@createdDate
                           ,@project
                           ,@userid
                           ,@uom
                           ,@key
                           ,@value
                           ,@description)";


                SqlHelper.SqlBeginTransaction();
                foreach(var item in paramList)
                {
                    SqlHelper.Insert(query, CommandType.Text, item.ToArray());
                }
                
                SqlHelper.SqlCommitTransaction();
                return Utils.Wrap(true, null, HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                SqlHelper.SqlRollbackTransaction();
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }

        public object GetConfigurations(string project)
        {
            try
            {
                List<SqlParameter> configParams = new List<SqlParameter>
                {
                    new SqlParameter("project", project)
                };

                var query = $@"select * from configurations where project = @project and userid = 1";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text, configParams.ToArray());

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "Configuration fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching configuration");
            }
        }

        public object UpdateConfig(List<ConfigurationInputDto> obj)
        {
            try
            {
                SqlHelper.VerifyConnection();
                var lastUpdatedDate = DateTime.Now;
                var lastUpdatedBy = "user";

                List<List<SqlParameter>> paramList = new List<List<SqlParameter>>();

                foreach (var item in obj)
                {
                    List<SqlParameter> configParams = new List<SqlParameter>
                    {
                        new SqlParameter("lastUpdatedBy", lastUpdatedBy),
                        new SqlParameter("lastUpdatedDate", lastUpdatedDate),
                        new SqlParameter("id", item.Id),
                        new SqlParameter("value", item.Value)
                    };
                    paramList.Add(configParams);
                }

                var query = $@"UPDATE [dbo].[configurations]
                           SET [last_updated_by] = @lastUpdatedBy
                              ,[last_updated_date] = @lastUpdatedDate
                              ,[value] = @value
                            WHERE [id] = @id";


                SqlHelper.SqlBeginTransaction();
                foreach (var item in paramList)
                {
                    SqlHelper.Update(query, CommandType.Text, item.ToArray());
                }

                SqlHelper.SqlCommitTransaction();
                return Utils.Wrap(true, null, HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                SqlHelper.SqlRollbackTransaction();
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }
    }
}
