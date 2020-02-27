using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Newtonsoft.Json;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class ConfigurationService : IConfigurationService
    {
        private static readonly string
            ConnectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper SqlHelper = new SqlHelper(ConnectionString);

        public object GetConfigurations(string project)
        {
            try
            {
                List<SqlParameter> configParams = new List<SqlParameter>
                {
                    new SqlParameter("project", project)
                };

                var query = $@"select * from configurations where project = @project and user_id = 1";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text, configParams.ToArray());

                var payload = JsonConvert.DeserializeObject(JsonConvert.SerializeObject(dataTable));

                return Utils.Wrap(true, payload, HttpStatusCode.OK, "Configurations Fetched Successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while Fetching Configurations");
            }
        }

        public object AddConfig(ConfigurationInputDto obj)
        {
            try
            {
                SqlHelper.VerifyConnection();

                int userId = 1;
                var createdBy = "User";
                var createdDate = DateTime.Now;

                List<SqlParameter> configParams = new List<SqlParameter>
                {
                    new SqlParameter("createdBy", createdBy),
                    new SqlParameter("createdDate", createdDate),
                    new SqlParameter("userid", userId),
                    new SqlParameter("project", obj.Project),
                    new SqlParameter("uom", obj.UOM),
                    new SqlParameter("key", obj.Key),
                    new SqlParameter("value", obj.Value),
                    new SqlParameter("description", obj.Description),
                };

                var query = $@"INSERT INTO [configurations]
                           ([created_by]
                           ,[created_date]
                           ,[user_id]
                           ,[project]
                           ,[uom]
                           ,[key]
                           ,[value]
                           ,[description])
                     VALUES
                           (@createdBy
                           ,@createdDate
                           ,@userid
                           ,@project
                           ,@uom
                           ,@key
                           ,@value
                           ,@description)";


                SqlHelper.Insert(query, CommandType.Text, configParams.ToArray());

                return Utils.Wrap(true, null, HttpStatusCode.OK, "Configurations Saved Successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while Fetching Configurations");
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }

        public object UpdateConfig(ConfigurationInputDto obj)
        {
            try
            {
                SqlHelper.VerifyConnection();

                var lastUpdatedDate = DateTime.Now;
                var lastUpdatedBy = "user";


                List<SqlParameter> configParams = new List<SqlParameter>
                {
                    new SqlParameter("lastUpdatedBy", lastUpdatedBy),
                    new SqlParameter("lastUpdatedDate", lastUpdatedDate),
                    new SqlParameter("id", obj.Id),
                    new SqlParameter("value", obj.Value)
                };

                var query = $@"UPDATE [dbo].[configurations]
                                SET [last_updated_by] = @lastUpdatedBy
                                ,[last_updated_date] = @lastUpdatedDate
                                ,[value] = @value
                                WHERE [id] = @id";

                SqlHelper.Update(query, CommandType.Text, configParams.ToArray());

                return Utils.Wrap(true, null, HttpStatusCode.OK, "Configurations Updated Successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while Fetching Configurations");
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }
    }
}