using LP.Finance.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.MarketData
{
    public class FxRates
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["PriceMasterDB"].ToString();

        private readonly bool Mock = false;

        public Dictionary<string, FxRate> Get(DateTime now)
        {
            if (Mock)
            {
                return Utils.GetFile<Dictionary<string, FxRate>>("fxrates");
            }

            var maxdate = now.ToString("yyyy-MM-dd");

            var sql = $@"select CurrencyCode, CalculatedFxRate as FxRate from [PriceMaster].[dbo].[vwNormalizedEodFxRates] where BusDate = '{maxdate}'
                         order by CurrencyCode desc";

            var list = new Dictionary<string, FxRate>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var currencyCode = reader.GetFieldValue<string>(0);
                    var rate = reader.GetFieldValue<decimal>(1);

                    list.Add(currencyCode, new FxRate
                    {
                        CurrencyCode = currencyCode,
                        Rate = rate,
                    });
                }
                reader.Close();
                con.Close();
            }

            Utils.Save(list, "fxrates");

            return list;
        }
    }
}
