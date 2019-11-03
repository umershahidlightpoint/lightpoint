using LP.Finance.Common;
using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;

namespace PostingEngine.MarketData
{
    public class CostBasises
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private readonly bool Mock = false;

        public Dictionary<string, CostBasisDto> Get(DateTime now)
        {
            if (Mock)
            {
                return Utils.GetFile<Dictionary<string, CostBasisDto>>("costbasis");
            }

            var busdate = now.ToString("MM-dd-yyyy");

            var sql = $@"SELECT 
	Symbol , cost_basis
    FROM [cost_basis]
	where business_date = '{busdate}'";

            var list = new Dictionary<string, CostBasisDto>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var symbol = reader.GetFieldValue<string>(0);
                    var rate = reader.GetFieldValue<decimal>(1);

                    list.Add(symbol, new CostBasisDto
                    {
                        Symbol = symbol,
                        CostBasis = Convert.ToDouble(rate),
                    });
                }
                reader.Close();
                con.Close();
            }

            //Utils.Save(list, "costbasis");

            return list;
        }
    }

}
