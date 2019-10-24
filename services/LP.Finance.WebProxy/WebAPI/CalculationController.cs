﻿using LP.Finance.Common.Model;
using LP.Finance.WebProxy.WebAPI.Services;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Web.Http;
using GraphQL;
using GraphQL.Types;
using LP.Finance.WebProxy.GraphQLEntities;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/calculation")]
    public class CalculationController : ApiController
    {
        private ICalculationService controller = new CalculationService();

        // GET api/fileManagement/files
        [Route("monthlyPerformance")]
        [HttpGet]
        public object GetMonthlyPerformance()
        {
            return controller.GetMonthlyPerformance();
        }

        [Route("monthlyPerformanceAudit")]
        [HttpGet]
        public object GetMonthlyPerformanceAudit(int id)
        {
            return controller.GetMonthlyPerformanceAudit(id);
        }

        [Route("monthlyPerformance")]
        [HttpPost]
        public object AddMonthlyPerformance(List<MonthlyPerformance> obj)
        {
            return controller.CalculateMonthlyPerformance(obj);
        }

        [Route("monthlyPerformance")]
        [HttpPut]
        public object ModifyMonthlyPerformance(List<MonthlyPerformance> obj)
        {
            return controller.AddOrUpdateMonthlyPerformance(obj);
        }

        [HttpPost, Route("monthlyPerformance/upload")]
        public async Task<object> UploadMonthlyPerformance()
        {
            return await controller.UploadMonthlyPerformance(Request);
        }

        [HttpPost, Route("monthlyPerformance/graphql")]
        public async Task<IHttpActionResult> Post([FromBody] GraphQLQuery query)
        {

            var schema = new Schema { Query = new PerformanceQuery() };
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

        [Route("dailyUnofficialPnl")]
        [HttpGet]
        public object GetDailyUnofficialPnl()
        {
            return controller.GetMonthlyPerformance();
        }

        [Route("dailyUnofficialPnlAudit")]
        [HttpGet]
        public object GetDailyUnofficialPnlAudit(int id)
        {
            return controller.GetMonthlyPerformanceAudit(id);
        }

        [HttpPost, Route("dailyUnofficialPnlAudit/upload")]
        public async Task<object> UploadDailyUnofficialPnl()
        {
            return await controller.UploadDailyUnofficialPnl(Request);
        }
    }
}