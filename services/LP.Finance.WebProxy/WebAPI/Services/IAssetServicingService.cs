using System;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IAssetServicingService
    {
        object GetOptions(DateTime? date);
    }
}