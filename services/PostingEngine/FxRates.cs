using LP.Finance.Common;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine
{
    public class FxRate
    {
        public string CurrencyCode { get; set; }
        public decimal Rate { get; set; }
    }

    public class MarketPrice
    {
        public string Symbol { get; set; }
        public decimal Price { get; set; }
    }

    /*
     */
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

    public class MarketPrices
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDB"].ToString();

        private readonly bool Mock = false;

        public Dictionary<string, MarketPrice> Get(DateTime now)
        {
            if (Mock)
            {
                return Utils.GetFile<Dictionary<string, MarketPrice>>("marketprices");
            }

            var busdate = now.ToString("MM-dd-yyyy");

            var sql = $@"SELECT 
	Securitycode as Symbol ,Price
    FROM [PositionMaster].[dbo].[IntraDayPositionSplit]
	where BusDate = '{busdate}' and LastModifiedOn = (select max(LastModifiedOn) from [PositionMaster].[dbo].[IntraDayPositionSplit] where BusDate = '{busdate}')
	and Price != 0.0
	order by Symbol asc

";

            var list = new Dictionary<string, MarketPrice>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var symbol = reader.GetFieldValue<string>(0);
                    var rate = reader.GetFieldValue<decimal>(1);

                    list.Add(symbol, new MarketPrice
                    {
                        Symbol = symbol,
                        Price = rate,
                    });
                }
                reader.Close();
                con.Close();
            }

            Utils.Save(list, "marketprices");

            return list;
        }
    }

}
