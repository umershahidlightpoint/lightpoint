﻿using LP.Core;
using LP.Finance.Common;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;

namespace LP.ReferenceData.WebProxy.WebAPI
{
    public interface IPositionsController
    {
        object Get(DateTime period);
    }

    public class PositionsControllerStub : IPositionsController
    {
        public object Get(DateTime busDate)
        {
            return Utils.GetFile("positions_" + busDate.ToString("MM-dd-yyyy"));
        }
    }

    public class PositionsControllerService : IPositionsController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDB"].ToString();

        public object Get(DateTime busDate)
        {
            dynamic result = AllData(busDate);

            Utils.Save(result, "positions_" + busDate.ToString("MM-dd-yyyy"));

            return result;
        }

        private object AllData(DateTime busDate)
        {
            var content = "{}";

            var BusDate = busDate.ToString("MM-dd-yyyy");

            var query =
$@"
select p.* from IntraDayPositionSplit p inner join (
select count(*) as count, Max(LastModifiedOn) as LastModifiedOn, BusDate from IntraDayPositionSplit
group by BusDate) a on a.BusDate = p.BusDate and a.LastModifiedOn = p.LastModifiedOn
where p.BusDate = '{BusDate}'
";
            MetaData metaData = null;

            using (var con = new SqlConnection(connectionString))
            {
                var sda = new SqlDataAdapter(query, con);
                var dataTable = new DataTable();
                con.Open();
                sda.Fill(dataTable);
                con.Close();

                metaData = MetaData.ToMetaData(dataTable);

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                content = jsonResult;
            }

            dynamic json = JsonConvert.DeserializeObject(content);

            return Utils.GridWrap(json, metaData);
        }
    }


    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    [RoutePrefix("api/positions")]
    public class PositionsController : ApiController, IPositionsController
    {
        // Mock Service
        private readonly IPositionsController controller = ControllerFactory.Get<IPositionsController, PositionsControllerStub, PositionsControllerService>();

        public PositionsController()
        {
        }

        [HttpGet]
        public object Get(DateTime period)
        {
            return controller.Get(period);
        }
    }
}
