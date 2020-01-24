using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;

namespace LP.Finance.WebProxy.Filters
{
    public class HttpInterceptorFilter : ActionFilterAttribute
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();
        public override void OnActionExecuting(HttpActionContext actionContext)
        {
            Trace.CorrelationManager.ActivityId = Guid.NewGuid();
            Logger.Info(actionContext.Request.RequestUri.ToString());
            Logger.Info(actionContext.Request.Method.ToString());
            var requestBody = actionContext.ActionArguments.Select(x=> x.Value).FirstOrDefault();
            Logger.Info(JsonConvert.SerializeObject(requestBody));
        }
    }
}
