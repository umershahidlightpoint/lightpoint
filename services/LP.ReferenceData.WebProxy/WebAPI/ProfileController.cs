using System.Collections;
using System.Linq;
using System;
using System.Web.Http;
using System.IO;
using Newtonsoft.Json;

namespace LP.ReferenceData.WebProxy.WebAPI
{
    /// <summary>
    /// Deliver the tiles / links resources to the logged in user
    /// </summary>
    public class ProfileController : ApiController
    {
        [HttpGet]
        [ActionName("environment")]
        public object Environment(string env)
        {
            var content = "{}";

            var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;

            if (env.ToLower().Equals("links"))
            {
                var links = currentDir + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "links.json";

                if (File.Exists(links))
                    content = File.ReadAllText(links);
            }
            else if (env.ToLower().Equals("tiles"))
            {
                var tiles = currentDir + Path.DirectorySeparatorChar + "Data" + Path.DirectorySeparatorChar + "tiles.json";
                if (File.Exists(tiles))
                    content = File.ReadAllText(tiles);

            }

            dynamic json = JsonConvert.DeserializeObject(content);

            return json;
        }
    }
}