using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LP.Shared.Sql;

namespace LP.Finance.Common.Model
{
    public class FileException : IDbModel
    {
        public string reference { get; set; }
        public string record { get; set; }
        public string source { get; set; }
        public string fileName { get; set; }
        public int? fileId { get; set; }
        public int fileExceptionId { get; set; }

        public DateTime businessDate {get; set; }

        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString);
            localconnection.Open();
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 business_date, reference, record, file_id FROM file_exception", localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

        public void PopulateRow(DataRow row)
        {
            row["business_date"] = this.businessDate;
            row["reference"] = this.reference;
            row["record"] = this.record;
            row["file_id"] = this.fileId;
        }
    }
}
