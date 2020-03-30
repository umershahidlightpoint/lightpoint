using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using LP.Finance.Common;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class AssetServicingService : IAssetServicingService
    {
        private static readonly string
            ConnectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper SqlHelper = new SqlHelper(ConnectionString);

        public object GetOptions(DateTime? date)
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();
                if (postingEngine.IsRunning)
                {
                    return Shared.WebApi.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                List<SqlParameter> sqlParams = new List<SqlParameter>();
                sqlParams.Add(new SqlParameter("@date", date));

                var dataTable = SqlHelper.GetDataTables("AssetServicesOptions", CommandType.StoredProcedure,
                    sqlParams.ToArray());

                return Shared.WebApi.Wrap(true, dataTable, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError, $"An error occured:{ex.Message}");
            }
        }
    }
}