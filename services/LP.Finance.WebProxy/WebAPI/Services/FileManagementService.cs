using LP.Finance.Common;
using Newtonsoft.Json;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class FileManagementService : IFileManagementService
    {
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        public SqlHelper sqlHelper = new SqlHelper(connectionString);

        public object GetFiles(string name)
        {
            var query = $@"select f.Id, f.Name, f.Path, fa.File_Action_Id, fa.File_Id, fa.Action, fa.Action_Start_Date, fa.Action_End_Date from [file] f
                        inner join[file_action] fa on f.id = fa.file_id";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);
            return Utils.GridWrap(json);
        }

    }
}
