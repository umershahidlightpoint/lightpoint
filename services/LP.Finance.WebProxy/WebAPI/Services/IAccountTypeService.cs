namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IAccountTypeService
    {
        object GetAccountTypes(int? accountCategoryId);
    }
}