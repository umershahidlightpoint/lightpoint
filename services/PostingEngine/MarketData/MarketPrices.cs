using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;

namespace PostingEngine.MarketData
{
    public class MarketPrices
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDB"].ToString();

        private readonly bool Mock = false;

        public static void CacheData() { }

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
                        Price = Convert.ToDouble(rate),
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
