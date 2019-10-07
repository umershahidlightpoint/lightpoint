using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LP.Finance.Common.Models;

namespace LP.Finance.Common.Model
{
    public class FileException : IDbModel
    {
        public string fileName { get; set; }
        public string reference { get; set; }
        public string record { get; set; }

        public DateTime businessDate {get; set; }

        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString);
            localconnection.Open();
            using (var adapter = new SqlDataAdapter($"SELECT TOP 0 file_name, business_date, reference, record FROM file_exception", localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

        public void PopulateRow(DataRow row)
        {
            row["file_name"] = this.fileName;
            row["business_date"] = this.businessDate;

            row["reference"] = this.reference;
            row["record"] = this.record;
        }
    }
}
