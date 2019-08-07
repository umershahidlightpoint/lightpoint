using LP.Finance.Common.Dtos;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    enum GridName
    {
        Journal = 0
         
    }
    public  interface IDataGridService
    {
        object SaveDataGridStatus(DataGridStatusDto oDataGridStatusDto);
        object GetDataGridStatus(int id);
        object GetDataGridLayouts(int gridId, int userId);

        object GetAGridLayout(int id);


    }
}
