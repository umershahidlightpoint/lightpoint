using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Mappers;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class SettingService : ISettingService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        private static readonly string tradesURL = "/api/trade?period=ITD";
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public object GetReportingCurrencies()
        {
            try
            {
                var tradesResult = Utils.GetWebApiData(tradesURL);
                tradesResult.Wait();

                var res = tradesResult.Result;
                var elements = JsonConvert.DeserializeObject<Transaction[]>(res);
                var filterTradeCurrency = elements.GroupBy(x => x.TradeCurrency).Select(group => group.First()).ToList();
                List<string> MapResponse = new List<string>();

                for (var i = 0; i < filterTradeCurrency.Count; i++)
                {
                    MapResponse.Add(filterTradeCurrency[i].TradeCurrency);
                }

                return Utils.Wrap(true, MapResponse, HttpStatusCode.OK); ;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false);
            }
        }
    }
}