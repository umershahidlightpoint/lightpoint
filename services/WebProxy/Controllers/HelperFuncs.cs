using System;
using System.Threading.Tasks;
using AspNetCore.Proxy.Extensions;
using Microsoft.AspNetCore.Mvc;

// https://github.com/twitchax/AspNetCore.Proxy
// http://sit01:3000/finance/journal/costbasisReport?date=2020-03-10&symbol=&fund=ALL

namespace WebProxy.Controllers
{
    internal class HelperFuncs
    {
        internal static Task Redirect(ControllerBase controller, string path)
        {
            var localPath = controller.Request.Path;
            var query = controller.Request.QueryString.ToString();

            return controller.HttpProxyAsync($"http://sit01:9092/api/" + path + (!String.IsNullOrEmpty(query) ? query : ""));
        }
    }
}
