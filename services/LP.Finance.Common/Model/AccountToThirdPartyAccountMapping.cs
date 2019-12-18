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
    public class AccountToThirdPartyAccountMapping : IDbModel
    {
        public int Id { get; set; }
        public string CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; }
        public string LastUpdatedBy { get; set; }
        public DateTime LastUpdatedDate { get; set; }
        public int AccountId { get; set; }
        public int ThirdPartyAccountId { get; set; }

        public DataTable MetaData(SqlConnection connection)
        {
            var table = new DataTable();

            // read the table structure from the database
            var localconnection = new SqlConnection(connection.ConnectionString + ";Password=ggtuser");
            localconnection.Open();
            var query = $"SELECT TOP 0 created_by, created_date, account_id, third_party_account_id FROM account_to_third_party_account_mapping";

            using (var adapter = new SqlDataAdapter(query, localconnection))
            {
                adapter.Fill(table);
            };
            localconnection.Close();

            return table;
        }

        public void PopulateRow(DataRow row)
        {
            row["created_by"] = this.CreatedBy;
            row["created_date"] = this.CreatedDate;
            row["account_id"] = this.AccountId;
            row["third_party_account_id"] = this.ThirdPartyAccountId;

        }
    }
}
