using LP.Core;
using LP.Finance.Common;
using LP.Shared.Core;
using Newtonsoft.Json;
using System;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Web.Http;

namespace LP.ReferenceData.WebProxy.WebAPI
{
    public interface IActivityController
    {
        object Get(DateTime period);
    }

    public class ActivityControllerStub : IActivityController
    {
        public object Get(DateTime busDate)
        {
            return LP.Shared.WebApi.GetFile("activity_" + busDate.ToString("MM-dd-yyyy"));
        }
    }

    public class ActivityControllerService : IActivityController
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDB"].ToString();

        public object Get(DateTime busDate)
        {
            dynamic result = AllData(busDate);

            LP.Shared.WebApi.Save(result, "activity_" + busDate.ToString("MM-dd-yyyy"));

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

            return LP.Shared.WebApi.GridWrap(json, metaData);
        }
    }


    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    [RoutePrefix("api/activity")]
    public class ActivityController : ApiController, IActivityController
    {
        // Mock Service
        private readonly IActivityController controller = ControllerFactory.Get<IActivityController, ActivityControllerStub, ActivityControllerService>();

        public ActivityController()
        {
        }

        [HttpGet]
        public object Get(DateTime busdate)
        {
            return controller.Get(busdate);
        }
    }
}
