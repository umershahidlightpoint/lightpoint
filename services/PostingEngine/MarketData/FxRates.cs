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

            var maxdate = now.ToString("MM-dd-yyyy 23:59:59");

            var sql = $@"select c.CurrencyCode, fx.FxRate, fx.*, p.SourceName from [PriceMaster].[dbo].[FXRate] fx
inner join [SecurityMaster].[dbo].[Currency] c on c.CurrencyId = fx.CurrencyId
inner join [PriceMaster].[dbo].[PriceSource] p on p.PriceSourceID = fx.PriceSourceID
-- where c.CurrencyCode = 'JPY'
where Runtime = ( select max(Runtime) from [PriceMaster].[dbo].[FXRate] where runtime <= '{maxdate}') -- Specify the date and grab the latest
order by c.CurrencyCode desc
";

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
