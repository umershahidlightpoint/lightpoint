using System.Web.Http;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.WebProxy.WebAPI.Services;

namespace LP.Finance.WebProxy.WebAPI
{
    [RoutePrefix("api/datagrid")]
    public class DataGridController : ApiController, IDataGridService
    {
        private readonly IDataGridService controller = new DataGridService();
         
        [Route("")]
        [HttpPost]
        public object SaveDataGridStatus(DataGridStatusDto oDataGridStatusDto)
        {
             
            return !ModelState.IsValid || oDataGridStatusDto == null
             ? BadRequest(ModelState)
             : controller.SaveDataGridStatus(oDataGridStatusDto);
        }

        

        [Route("{id:int}")]
        [HttpGet]
        public object GetDataGridStatus(int id)
        {
            return controller.GetDataGridStatus(id);
        }

        
        [HttpGet]
        [ActionName("GetDataGridLayouts")]
        public object GetDataGridLayouts(int gridId, int userId)
        {
            return controller.GetDataGridLayouts(gridId, userId);
        }

        [HttpGet]
        
        [ActionName("GetAGridLayout")]
        public object GetAGridLayout(int id)
        {
            return controller.GetAGridLayout(id);
        }
    }
}
