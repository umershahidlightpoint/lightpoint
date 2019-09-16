using LP.Finance.Common.Dtos;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public interface IDataGridService
    {
        object SaveDataGridStatus(DataGridStatusDto oDataGridStatusDto);
        object GetDataGridStatus(int id);
        object GetDataGridLayouts(int gridId, int userId);
        object GetAGridLayout(int id);
        object DeleteGridLayout(int id);
    }
}