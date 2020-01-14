using System.Net.Http.Formatting;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Owin;

namespace LP.ReferenceData.WebProxy
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();

            // Configure Web API for self-host.
            var config = new HttpConfiguration();
            var corsOptions = new CorsOptions
            {
                PolicyProvider = new CorsPolicyProvider
                {
                    PolicyResolver = c => Task.FromResult(new CorsPolicy
                    {
                        AllowAnyHeader = true,
                        AllowAnyMethod = true,
                        AllowAnyOrigin = true,
                        SupportsCredentials = true
                    })
                }
            };

            app.Map("/signalr", map =>
            {
                map.UseCors(CorsOptions.AllowAll);
                var hubConfiguration = new HubConfiguration { };
                map.RunSignalR(hubConfiguration);
            });

            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter());

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
              name: "DefaultApi",
              routeTemplate: "api/{controller}/{name}",
              defaults: new { name = RouteParameter.Optional }
            );

            config.Routes.MapHttpRoute(
              name: "journals",
              routeTemplate: "api/trades/journals/{orderId}",
              defaults: new { }
            );

            config.Routes.MapHttpRoute(
              name: "allocations",
              routeTemplate: "api/trades/allocations/{orderId}",
              defaults: new { }
            );

            config.Routes.MapHttpRoute(
                name: "SecurityData-Queries",
                routeTemplate: "api/{controller}/data/{symbol}",
                defaults: new
                {
                }
            );

            app.UseCors(corsOptions);
            app.UseWebApi(config);
            AppStartCacheHelper.CacheReferenceData();
        }
    }
}