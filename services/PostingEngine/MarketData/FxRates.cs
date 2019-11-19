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
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["PriceMasterDB"].ToString();

        private static readonly bool Mock = false;

        private static readonly FxRate _dummyFx = new FxRate { Rate = 1 };

        private static Dictionary<string, FxRate> _all { get; set; }
        public static FxRate Find(DateTime busDate, string currency)
        {
            var bDate = busDate.ToString("MM-dd-yyyy");

            var key = $"{currency}@{bDate}";

            if (_all.ContainsKey(key))
                return _all[key];

            return _dummyFx;
        }
        public static void CacheData()
        {
            if (Mock)
            {
                _all = Utils.GetFile<Dictionary<string, FxRate>>("all_fxrates");
            }

            var sql = $@"select BusDate, CurrencyCode, CalculatedFxRate as FxRate from [PriceMaster].[dbo].[vwNormalizedEodFxRates]
                         order by BusDate, CurrencyCode desc";

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
