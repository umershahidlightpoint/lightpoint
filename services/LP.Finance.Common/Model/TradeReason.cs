using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common.Model
{
    public class TradeReason : IDbModel
    {
        public string LPOrderId { get; set; }
        public string Reason { get; set; }
        public string CreatedBy { get; set; }
        public DateTime? CreatedDate { get; set; }

        public void PopulateRow(DataRow row)
        {
            row["LPOrderId"] = string.IsNullOrEmpty(this.LPOrderId) ? DBNull.Value : (object)this.LPOrderId;
            row["CreatedBy"] = "user";
            row["CreatedDate"] = DateTime.Now;
            row["Reason"] = string.IsNullOrEmpty(this.Reason) ? DBNull.Value : (object)this.Reason;
        }


        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString + ";Password=ggtuser");
            localconnection.Open();
            var query = $@"SELECT [LPOrderId]
                      ,[CreatedBy]
                      ,[CreatedDate]
                      ,[Reason]
                  FROM[dbo].[trade_reason] with(nolock)";

            using (var adapter = new SqlDataAdapter(query, localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

    }
}
