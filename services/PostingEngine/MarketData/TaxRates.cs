using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;

namespace PostingEngine.MarketData
{
    public class TaxRates
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private readonly bool Mock = false;

        public TaxRate Get(DateTime now)
        {
            if (Mock)
            {
                return Utils.GetFile<TaxRate>("taxrates");
            }

            var businessdate = now.Date;

            var sql = $@"TaxRates";

            var list = new List<TaxRate>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                query.CommandType = CommandType.StoredProcedure;
                query.Parameters.Add("@businessDate", SqlDbType.VarChar).Value = businessdate;

                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    list.Add(new TaxRate
                    {
                        ShortTerm = reader.GetFieldValue<decimal>(0),
                        LongTerm = reader.GetFieldValue<decimal>(1),
                        ShortTermPeriod = reader.GetFieldValue<int>(2)
                    });
                }
                reader.Close();
                con.Close();
            }

            var taxrate = list.FirstOrDefault();

            //Utils.Save(taxrate, "taxrates");

            return taxrate;
        }
    }

}
