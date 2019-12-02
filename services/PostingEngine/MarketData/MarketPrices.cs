using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;

namespace PostingEngine.MarketData
{
    public class MarketPrices
    {
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDB"].ToString();

        private static readonly bool Mock = false;

        private static Dictionary<string, MarketPrice> _all;

        public static void CacheData()
        {
            if (Mock)
            {
                _all = Utils.GetFile<Dictionary<string, MarketPrice>>("all_marketprices");
            }

            var sql = $@"select business_date, symbol, MAX(price) from FundAccounting..market_prices group by business_date, symbol";

            var list = new Dictionary<string, MarketPrice>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var businessDate = reader.GetFieldValue<DateTime>(0);
                    var symbol = reader.GetFieldValue<string>(1);
                    var price = reader.GetFieldValue<decimal>(2);

                    var element = new MarketPrice
                    {
                        BusinessDate = businessDate,
                        Symbol = symbol,
                        Price = Convert.ToDouble(price),
                    };

                    list.Add(element.Key, element);
                }
                reader.Close();
                con.Close();
            }

            Utils.Save(list, "all_marketprices");

            _all = list;
        }

        public static MarketPrice Find(DateTime busDate, string symbol)
        {
            var bDate = busDate.ToString("MM-dd-yyyy");

            var key = $"{symbol}@{bDate}";

            if (_all.ContainsKey(key))
                return _all[key];

            //Console.WriteLine($"Unable to find Market Price for {key}");

            // We need to manufactor a rate
            var priorDate = busDate.PrevBusinessDate();

            var priorRate = 0.0;

            bDate = priorDate.ToString("MM-dd-yyyy");
            key = $"{symbol}@{bDate}";
            if (_all.ContainsKey(key))
            {
                priorRate = _all[key].Price;
            }

            return new MarketPrice
            {
                Price = priorRate
            };

            //return _dummyFx;
        }

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

            sql = $@"select symbol, price from FundAccounting..market_prices
                     where business_date = '{busdate}'";

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
