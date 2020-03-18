﻿using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Threading.Tasks;
using AspNetCore.Proxy.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

// https://github.com/twitchax/AspNetCore.Proxy
// http://sit01:3000/finance/journal/costbasisReport?date=2020-03-10&symbol=&fund=ALL

namespace WebProxy.Controllers
{

    [ApiController]
    [Route("finance")]
    public class FinanceController : ControllerBase
    {
        [HttpGet]
        [Route("{*path}")]
        public Task GetWildcard(string path)
        {
            return HelperFuncs.Redirect(this, path);
        }


        [HttpPatch]
        [Route("{*path}")]
        public Task GetWildcardPatch(string path)
        {
            var localPath = Request.Path;
            var query = Request.QueryString.ToString();

            return null;
        }

        [HttpDelete]
        [Route("{*path}")]
        public Task GetWildcardDelete(string path)
        {
            var localPath = Request.Path;
            var query = Request.QueryString.ToString();

            return null;

        }

        [HttpPost]
        [Route("{*path}")]
        public Task GetWildcardPost(string path)
        {
            var localPath = Request.Path;
            var query = Request.QueryString.ToString();

            return null;

        }

        [HttpPut]
        [Route("{*path}")]
        public Task GetWildcardPut(string path)
        {
            var localPath = Request.Path;
            var query = Request.QueryString.ToString();

            return null;

        }

    }
}
