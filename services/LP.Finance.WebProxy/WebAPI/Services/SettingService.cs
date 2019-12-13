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
        private static readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        public SqlHelper sqlHelper = new SqlHelper(connectionString);

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

                return Utils.Wrap(true, MapResponse, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false);
            }
        }

        public object AddSetting(SettingInputDto setting)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var createdDate = DateTime.Now.ToString("MM-dd-yyyy");
                var createdBy = "John Doe";

                List<SqlParameter> settingParameters = new List<SqlParameter>
                {
                    new SqlParameter("createdBy", createdBy),
                    new SqlParameter("createdDate", createdDate),
                    new SqlParameter("lastUpdatedDate", createdDate),
                    new SqlParameter("currencyCode", setting.CurrencyCode),
                    new SqlParameter("taxMethodology", setting.TaxMethodology),
                    new SqlParameter("fiscalMonth", setting.FiscalMonth),
                    new SqlParameter("fiscalDay", setting.FiscalDay),
                };

                var query = $@"INSERT INTO [settings]
                                    ([created_by], [created_date], [last_updated_date], [currency_code], [tax_methodology], [fiscal_month]
                                    ,[fiscal_day])
                                    VALUES
                                    (@createdBy, @createdDate, @lastUpdatedDate, @currencyCode, @taxMethodology, @fiscalMonth
                                    ,@fiscalDay)";

                sqlHelper.Insert(query, CommandType.Text, settingParameters.ToArray());

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();


                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false);
            }
        }

        public object UpdateSetting(SettingInputDto setting)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var lastUpdatedDate = DateTime.Now.ToString("MM-dd-yyyy");
                int id = 1;
                var createdBy = "John Doe";

                List<SqlParameter> settingParameters = new List<SqlParameter>
                {
                    new SqlParameter("id", id),
                    new SqlParameter("createdBy", createdBy),
                    new SqlParameter("lastUpdatedDate", lastUpdatedDate),
                    new SqlParameter("currencyCode", setting.CurrencyCode),
                    new SqlParameter("taxMethodology", setting.TaxMethodology),
                    new SqlParameter("fiscalMonth", setting.FiscalMonth),
                    new SqlParameter("fiscalDay", setting.FiscalDay),
                };

                var settingQuery = $@"UPDATE [settings]
                            SET
                            [created_by] = @createdBy
                            ,[last_updated_date] = @lastUpdatedDate
                            ,[currency_code] = @currencyCode
                            ,[tax_methodology] = @taxMethodology
                            ,[fiscal_month] = @fiscalMonth
                            ,[fiscal_day] = @fiscalDay
                            WHERE [settings].[id] = @id";

                sqlHelper.Update(settingQuery, CommandType.Text, settingParameters.ToArray());

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();


                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false);
            }
        }

        public object GetSetting()
        {
            try
            {
                var query = $@"select id, created_by, created_date, last_updated_by, last_updated_date,
                               currency_code, tax_methodology, fiscal_month, fiscal_day
                               from settings";

                List<SqlParameter> sqlParams = new List<SqlParameter>();

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());
                var status = dataTable.Rows.Count > 0 ? HttpStatusCode.OK : HttpStatusCode.NotFound;

                var reportObject = Utils.Wrap(true, dataTable, status);
                return reportObject;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false);
            }
        }
    }
}