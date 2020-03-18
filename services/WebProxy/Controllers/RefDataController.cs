using System;
using System.Threading.Tasks;
using AspNetCore.Proxy.Extensions;
using Microsoft.AspNetCore.Mvc;

// https://github.com/twitchax/AspNetCore.Proxy
// http://sit01:3000/finance/journal/costbasisReport?date=2020-03-10&symbol=&fund=ALL

namespace WebProxy.Controllers
{
    [ApiController]
    [Route("refdata")]
    public class RefDataController : ControllerBase
    {
        [HttpGet]
        [Route("{*path}")]
        public Task GetWildcard(string path)
        {
            return HelperFuncs.Redirect(this, path);
        }

    }
}
