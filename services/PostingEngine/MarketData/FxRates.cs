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
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private static readonly bool Mock = false;

        private static readonly FxRate _dummyFx = new FxRate { Rate = 1 };

        private static Dictionary<string, FxRate> _all { get; set; }

        private static FxRate USD = new FxRate { Rate = 1.0 };

        public static FxRate Find(PostingEngineEnvironment env, DateTime busDate, string currency)
        {
            if ( currency.Equals("USD"))
            {
                return USD;
            }

            var ccy = $"@CASH{currency}";
            var f = MarketPrices.GetPrice(env, busDate, ccy, true);
            if (f.Price != 0)
                return new FxRate
                {
                    Rate = f.Price
                };

            return FindEx(busDate, currency);
        }

        private static FxRate FindEx(DateTime busDate, string currency)
        {
            var bDate = busDate.ToString("MM-dd-yyyy");

            var key = $"{currency}@{bDate}";

            if (_all.ContainsKey(key))
                return _all[key];

            if ( currency.Equals("GBp"))
            {
                key = $"GBP@{bDate}";
                if (_all.ContainsKey(key))
                {
                    return new FxRate
                    {
                        Rate = _all[key].Rate / 100
                    };
                }
            }

            Logger.Warn($"Unable to find Primary FxRate for {key}");

            // We need to manufactor a rate
            var priorDate = busDate.PrevBusinessDate();

            var priorRate = 0.0;

            bDate = priorDate.ToString("MM-dd-yyyy");
            key = $"{currency}@{bDate}";
            if (_all.ContainsKey(key))
            {
                priorRate = _all[key].Rate;
            }

            return new FxRate
            {
                Rate = priorRate
            };
        }

        public static void CacheData()
        {
            Logger.Info("Caching FxRates");

            if (Mock)
            {
                _all = Utils.GetFile<Dictionary<string, FxRate>>("all_fxrates");
            }

            var sql = $@"select business_date, currency, price from fx_rates
                         order by business_date, currency desc";

            var list = new Dictionary<string, FxRate>();

            using (var con = new SqlConnection(connectionString))
            {
                con.Open();
                var query = new SqlCommand(sql, con);
                var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

                while (reader.Read())
                {
                    var businessDate = reader.GetFieldValue<DateTime>(0);
                    var currencyCode = reader.GetFieldValue<string>(1);
                    var rate = reader.GetFieldValue<decimal>(2);

                    var element = new FxRate
                    {
                        BusinessDate = businessDate,
                        CurrencyCode = currencyCode,
                        Rate = Convert.ToDouble(rate),
                    };

                    list.Add(element.Key, element);
                }
                reader.Close();
                con.Close();
            }

            Utils.Save(list, "all_fxrates");

            _all = list;
        }

        public Dictionary<string, FxRate> Get(DateTime now)
        {
            if (Mock)
            {
                return Utils.GetFile<Dictionary<string, FxRate>>("fxrates");
            }

            var maxdate = now.ToString("yyyy-MM-dd");

            var sql = $@"select business_date, currency, price from fx_rates
                         where business_date = '{maxdate}'
                         order by currency desc";

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
                        Rate = Convert.ToDouble(rate),
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
