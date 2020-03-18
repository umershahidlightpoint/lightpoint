using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using LP.FileProcessing;
using LP.FileProcessing.Report_Generation;
using LP.Finance.Common.Dtos;
using Newtonsoft.Json;
using LP.Finance.Common;
using System.Dynamic;
using LP.Shared.Model;
using LP.Shared.Sql;

namespace PostingEngine.Reports
{
    public class EODReports
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private readonly SqlHelper sqlHelper = new SqlHelper(connectionString);
        private static readonly string FromEmail = ConfigurationManager.AppSettings["FromEmail"].ToString();
        private static readonly string FromName = ConfigurationManager.AppSettings["FromName"].ToString();

        internal async void TaxLotReport()
        {
            try
            {
                IReport report = new SpreadSheet();

                ServerRowModel layout = new ServerRowModel();
                var layoutJson = GetLayout("Taxlot Status");
                layout.gridColDefs = JsonConvert.DeserializeObject<List<GridColDef>>(layoutJson.ColumnState);
                layout.filterModel = JsonConvert.DeserializeObject<ExpandoObject>(layoutJson.FilterState);
                layout.externalFilterModel =
                    JsonConvert.DeserializeObject<ExpandoObject>(layoutJson.ExternalFilterState);
                layout.sortModel = JsonConvert.DeserializeObject<List<SortModel>>(layoutJson.SortState);
                var filterKeys = new Dictionary<string, string>
                {
                    {"fundFilter", "fund"},
                    {"symbolFilter", "symbol"},
                    {"dateFilter", "trade_date"}
                };
                layout.externalFilterModel =
                    ServerSideRowModelHelper.MapExternalFilters(layout.externalFilterModel, filterKeys);
                var queryObject = ServerSideRowModelHelper.BuildSqlFromGridLayouts(layout, "tax_lot_status");

                var query = $@"SELECT * FROM tax_lot_status";
                var dataTable =
                    sqlHelper.GetDataTable(queryObject.Item1, CommandType.Text, queryObject.Item2.ToArray());

                var recipientQuery =
                    $"SELECT email_id AS EmailId FROM report_recepient WHERE task = 'EOD' AND report = 'Tax Lot Status'";
                var recipientDataTable = sqlHelper.GetDataTable(recipientQuery, CommandType.Text);

                var recipientList = new List<string>();
                foreach (DataRow dr in recipientDataTable.Rows)
                {
                    recipientList.Add((string) dr["EmailId"]);
                }

                string header = "TaxLotReport";
                string content = "This is an automatically generated email.";
                if (recipientList.Count > 0)
                {
                    report.Generate(dataTable, recipientList, header, content, FromEmail, FromName);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public DataGridStatusDto GetLayout(string gridName)
        {
            var query = $@"SELECT TOP 1 * FROM data_grid_layouts WHERE grid_name = '{gridName}' AND is_default = 1";
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