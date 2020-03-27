using LP.Finance.Common.Model;
using LP.Finance.WebProxy.WebAPI.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using GraphQL;
using GraphQL.Types;
using LP.Finance.WebProxy.GraphQLEntities;
using System;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/calculation")]
    public class CalculationController : ApiController
    {
        private ICalculationService controller = new CalculationService();

        [HttpGet, Route("monthlyPerformance")]
        public object GetMonthlyPerformance()
        {
            return controller.GetMonthlyPerformance();
        }

        [HttpPost, Route("monthlyPerformance")]
        public object AddMonthlyPerformance(List<MonthlyPerformance> obj)
        {
            return controller.CalculateMonthlyPerformance(obj);
        }

        [HttpPut, Route("monthlyPerformance")]
        public object ModifyMonthlyPerformance(List<MonthlyPerformance> obj)
        {
            return controller.AddOrUpdateMonthlyPerformance(obj);
        }

        [HttpPost, Route("monthlyPerformance/upload")]
        public async Task<object> UploadMonthlyPerformance()
        {
            return await controller.UploadMonthlyPerformance(Request);
        }

        [HttpPost, Route("monthlyPerformance/commit")]
        public object CommitMonthlyPerformance(List<MonthlyPerformance> monthlyPerformances)
        {
            return controller.CommitMonthlyPerformance(monthlyPerformances);
        }

        [HttpGet, Route("monthlyPerformance/status")]
        public object GetMonthlyPerformanceStatus()
        {
            return controller.GetMonthlyPerformanceStatus();
        }

        [HttpGet, Route("monthlyPerformanceAudit")]
        public object GetMonthlyPerformanceAudit(int id)
        {
            return controller.GetMonthlyPerformanceAudit(id);
        }

        [HttpPost, Route("monthlyPerformance/graphql")]
        public async Task<IHttpActionResult> Post([FromBody] GraphQLQuery query)
        {
            var schema = new Schema {Query = new PerformanceQuery()};
            var inputs = query.Variables.ToInputs();
            var result = await new DocumentExecuter().ExecuteAsync(_ =>
            {
                _.Inputs = inputs;
                _.Schema = schema;
                _.Query = query.Query;
            }).ConfigureAwait(false);

            if (result.Errors?.Count > 0)
            {
                return BadRequest();
            }

            return Ok(result);
        }

        [HttpGet, Route("dailyUnofficialPnl")]
        public object GetDailyUnofficialPnl(DateTime? from, DateTime? to)
        {
            return controller.GetDailyUnofficialPnl(from, to);
        }

        [HttpPost, Route("dailyUnofficialPnlAudit/upload")]
        public async Task<object> UploadDailyUnofficialPnl()
        {
            return await controller.UploadDailyUnofficialPnl(Request);
        }

        [HttpPost, Route("dailyUnofficialPnlAudit/commit")]
        public object CommitDailyUnofficialPnl(List<DailyPnL> dailyPnLs)
        {
            return controller.CommitDailyUnofficialPnl(dailyPnLs);
        }

        [HttpGet, Route("dailyUnofficialPnl/status")]
        public object GetDailyUnofficialPnlStatus()
        {
            return controller.GetDailyUnofficialPnlStatus();
        }

        [HttpGet, Route("dailyUnofficialPnlAudit")]
        public object GetDailyUnofficialPnlAudit(int id)
        {
            return controller.GetMonthlyPerformanceAudit(id);
        }

        [HttpPost, Route("dailyUnofficialPnlAudit/calculate")]
        public object CalculateDailyUnofficialPnl(List<DailyPnL> obj)
        {
            return controller.CalculateDailyUnofficialPnl(obj);
        }
    }
}