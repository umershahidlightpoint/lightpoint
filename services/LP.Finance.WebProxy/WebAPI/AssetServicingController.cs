using System;
using System.Web.Http;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/assetServicing")]
    public class AssetServicingController : ApiController
    {
        private readonly IAssetServicingService controller = new AssetServicingService();

        public AssetServicingController()
        {
            
        }

        [HttpGet, Route("options")]
        public object GetOptions(DateTime? date)
        {
            return controller.GetOptions(date);
        }
    }
}