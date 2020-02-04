using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LP.FileProcessing;
using LP.FileProcessing.Report_Generation;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using LP.Finance.Common;
using System.Dynamic;

namespace PostingEngine.Reports
{
    public class EODReports
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        SqlHelper sqlHelper = new SqlHelper(connectionString);

        internal async void TaxLotReport()
        {
            try
            {
                IReport report = new SpreadSheet();
                ServerRowModel layout = new ServerRowModel();
                var layoutJSON = GetLayout("Taxlot Status");
                layout.gridColDefs = JsonConvert.DeserializeObject<List<GridColDef>>(layoutJSON.ColumnState);
                layout.filterModel = JsonConvert.DeserializeObject<ExpandoObject>(layoutJSON.FilterState);
                layout.externalFilterModel = JsonConvert.DeserializeObject<ExpandoObject>(layoutJSON.ExternalFilterState);
                layout.sortModel = JsonConvert.DeserializeObject<List<SortModel>>(layoutJSON.SortState);
                //var queryObject = ServerSideRowModelHelper.BuildSqlFromGridLayouts(layout, "tax_lot_status");
                var query = $@"SELECT * FROM tax_lot_status";
                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);

                var recepientQuery = $"select email_id as EmailId from report_recepients where task = 'EOD' and report = 'Tax Lot Status'";
                var recepientDataTable = sqlHelper.GetDataTable(recepientQuery, CommandType.Text);
                var recepientsSerialized = JsonConvert.SerializeObject(recepientDataTable);
                var recepientList = JsonConvert.DeserializeObject<List<string>>(recepientsSerialized);
                report.Generate(dataTable, recepientList);
            }
            catch(Exception ex)
            {
                throw ex;
            }
           
        }

        public DataGridStatusDto GetLayout(string gridName)
        {
            var query = $@"select top 1 * from data_grid_layouts where grid_name = '{gridName}' and is_default = 1";
            var data = sqlHelper.GetDataTable(query, CommandType.Text);
            DataGridStatusDto gridLayout = new DataGridStatusDto();
            foreach (DataRow row in data.Rows)
            {
                gridLayout.ColumnState = row["column_state"].ToString();
                gridLayout.FilterState = row["filter_state"].ToString();
                gridLayout.ExternalFilterState = row["external_filter_state"].ToString();
                gridLayout.PivotMode = row["pivot_mode"].ToString();
                gridLayout.SortState = row["sort_state"].ToString();
                gridLayout.GroupState = row["group_state"].ToString();
            }
            return gridLayout;
        }

    }
}
