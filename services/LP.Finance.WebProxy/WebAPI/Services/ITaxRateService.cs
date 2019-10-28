using LP.Finance.Common.Dtos;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface ITaxRateService
    {
        object GetTaxRates();
        object CreateTaxRate(TaxRateInputDto taxRate);
        object EditTaxRate(int id, TaxRateInputDto taxRate);
        object DeleteTaxRate(int id);
    }
}