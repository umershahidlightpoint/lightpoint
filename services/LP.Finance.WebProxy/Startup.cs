﻿using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Cors;
using System.Web.Http;
using LP.Finance.WebProxy;
using LP.Finance.WebProxy.Filters;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin.Cors;
using Owin;

namespace LP.ReferenceData.WebProxy
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
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

            // This will map out to http://localhost:9999/signalr 

            app.Map("/signalr", map =>
            {
                map.UseCors(CorsOptions.AllowAll);
                var hubConfiguration = new HubConfiguration { };
                map.RunSignalR(hubConfiguration);
            });

            config.Formatters.Clear();
            config.Formatters.Add(new JsonMediaTypeFormatter());
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("text/plain"));

            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{name}",
                defaults: new {name = RouteParameter.Optional}
            );

            config.Routes.MapHttpRoute(
                name: "SymbolMap-map",
                routeTemplate: "api/{controller}/map/{product}",
                defaults: new
                {
                    product = RouteParameter.Optional
                }
            );

            config.Routes.MapHttpRoute(
                name: "SymbolMap-top",
                routeTemplate: "api/{controller}/top/{product}/{count}",
                defaults: new
                {
                    product = RouteParameter.Optional,
                    count = RouteParameter.Optional
                }
            );

            config.Routes.MapHttpRoute(
                name: "Data-details",
                routeTemplate: "api/{controller}/details/{symbol}",
                defaults: new
                {
                }
            );

            config.Routes.MapHttpRoute(
                name: "Portfolio-Queries",
                routeTemplate: "api/{controller}/filter/{filter}",
                defaults: new
                {
                }
            );

            config.Routes.MapHttpRoute(
                name: "Profile-Queries",
                routeTemplate: "api/{controller}/environment/{env}",
                defaults: new
                {
                }
            );

            config.Routes.MapHttpRoute(
                name: "SecurityData-Queries",
                routeTemplate: "api/{controller}/data/{refdata}",
                defaults: new
                {
                }
            );
            config.Filters.Add(new HttpInterceptorFilter());
            app.UseCors(corsOptions);
            app.UseWebApi(config);
            AppStartCacheHelper.CacheServerSideMetaInfo();
        }
    }
}