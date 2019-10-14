using LP.Finance.WebProxy.WebAPI.Services;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/performance")]
    public class PerformanceController : ApiController
    {
        private IPerformanceService controller = new PerformanceService();
        // GET api/fileManagement/files
        [Route("monthlyPerformance")]
        [HttpGet]
        public object GetMonthlyPerformance()
        {
            return controller.GetMonthlyPerformance();
        }
    }
}
