using System.Web.Http;
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
        public object SaveDataGridStatus(DataGridStatusDto dataGridStatusDto)
        {
            return !ModelState.IsValid || dataGridStatusDto == null
                ? BadRequest(ModelState)
                : controller.SaveDataGridStatus(dataGridStatusDto);
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

        [Route("{id:int}")]
        [HttpDelete]
        public object DeleteGridLayout(int id)
        {
            return controller.DeleteGridLayout(id);
        }

        [Route("GetGridLayouts")]
        [HttpGet]
        public object GetGridLayouts(int? userId = null)
        {
            return controller.GetGridLayouts(userId);
        }
    }
}