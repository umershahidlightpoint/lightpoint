using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using LP.Finance.Common.Model;
using PostingEngine.Contracts;

namespace PostingEngine.MarketData
{
    public class MarketPrices
    {
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["PositionMasterDB"].ToString();

        private static readonly bool Mock = false;

        private static Dictionary<string, MarketPrice> _all;

        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public static void CacheData()
        {
            Logger.Info("Caching MarketPrices");

            if (Mock)
            {
                _all = LP.Shared.Utils.GetFile<Dictionary<string, MarketPrice>>("all_marketprices");
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

            LP.Shared.Utils.Save(list, "all_marketprices");

            _all = list;
        }

        public static MarketPrice GetPrice(PostingEngineEnvironment env, DateTime valueDate, Transaction element)
        {
            var eodMarketPrice = Find(valueDate, element);

            if (!eodMarketPrice.Valid)
            {
                env.AddMessage("Error", eodMarketPrice.Error);
            }

            return eodMarketPrice;
        }

        public static MarketPrice GetPrice(PostingEngineEnvironment env, DateTime valueDate, string symbol, bool fxrate = false)
        {
            var eodMarketPrice = Find(valueDate, symbol);

            if (!eodMarketPrice.Valid && !fxrate)
            {
                env.AddMessage("Error", eodMarketPrice.Error);
            }

            return eodMarketPrice;
        }

        private static MarketPrice Find(DateTime busDate, Transaction element)
        {
            var mp = new MarketPrice
            {
                Price = 1
            };

            if ( element.Symbol.Equals("MSUXX"))
            {
                return mp; 
            }

            var price = Find(busDate, element.Symbol);

            var factor = element.PricingFactor();

            mp = new MarketPrice
            {
                Price = price.Price / factor,
                Valid = price.Valid,
                Error = price.Error,
            };

            var baseCurrency = element.TradeCurrency;

            if ( element.SecurityType.Equals("FORWARD"))
            {
                var split = element.Symbol.Split(new char[] { '/', ' ' });
                baseCurrency = split[0];
            }

            if ( baseCurrency.ToLowerInvariant().Equals("gbx") || baseCurrency.Equals("GBp"))
            {
                mp.Price /= 100.0;
            }

            return mp;
        }

        private static MarketPrice Find(DateTime busDate, string symbol)
        {
            var bDate = busDate.ToString("MM-dd-yyyy");

            var key = $"{symbol}@{bDate}";

            if (_all.ContainsKey(key))
                return _all[key];

            var priorRate = 0.0;

            return new MarketPrice
            {
                Price = priorRate,
                Error = $"Unable to find MarketPrice for {key}",
                Valid = false
            };
        }

        public Dictionary<string, MarketPrice> Get(DateTime now)
        {
            if (Mock)
            {
                return LP.Shared.Utils.GetFile<Dictionary<string, MarketPrice>>("marketprices");
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

            LP.Shared.Utils.Save(list, "marketprices");

            return list;
        }
    }

}
