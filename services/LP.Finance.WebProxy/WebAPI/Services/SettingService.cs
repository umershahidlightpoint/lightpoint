using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Newtonsoft.Json;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class SettingService : ISettingService
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);

        private static readonly string tradesURL = "/api/trade?period=ITD";
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public object GetReportingCurrencies()
        {
            try
            {
                var query = $@"SELECT distinct TradeCurrency from current_trade_state where TradeCurrency is not null";

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);

                var currencyCodes = new List<string>();
                foreach (DataRow dr in dataTable.Rows)
                {
                    currencyCodes.Add((string) dr["TradeCurrency"]);
                }

                return Shared.WebApi.Wrap(true, currencyCodes, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false);
            }
        }

        public object AddSetting(SettingInputDto setting)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            try
            {
                sqlHelper.VerifyConnection();

                var createdDate = DateTime.Now.ToString("MM-dd-yyyy");
                var createdBy = "John Doe";

                List<SqlParameter> settingParameters = new List<SqlParameter>
                {
                    new SqlParameter("createdBy", createdBy),
                    new SqlParameter("createdDate", createdDate),
                    new SqlParameter("lastUpdatedDate", createdDate),
                    new SqlParameter("theme", setting.Theme),
                    new SqlParameter("currencyCode", setting.CurrencyCode),
                    new SqlParameter("taxMethodology", setting.TaxMethodology),
                    new SqlParameter("fiscalMonth", setting.FiscalMonth),
                    new SqlParameter("fiscalDay", setting.FiscalDay),
                };

                var query = $@"INSERT INTO [settings]
                                    ([created_by], [created_date], [last_updated_date], [currency_code], [tax_methodology], [fiscal_month]
                                    ,[fiscal_day], [theme])
                                    VALUES
                                    (@createdBy, @createdDate, @lastUpdatedDate, @currencyCode, @taxMethodology, @fiscalMonth
                                    ,@fiscalDay, @theme)";

                sqlHelper.Insert(query, CommandType.Text, settingParameters.ToArray());
                sqlHelper.CloseConnection();

                return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();

                return Shared.WebApi.Wrap(false);
            }
        }

        public object UpdateSetting(SettingInputDto setting)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            try
            {
                sqlHelper.VerifyConnection();

                var lastUpdatedDate = DateTime.Now.ToString("MM-dd-yyyy");
                var createdBy = "John Doe";

                List<SqlParameter> settingParameters = new List<SqlParameter>
                {
                    new SqlParameter("id", setting.Id),
                    new SqlParameter("createdBy", createdBy),
                    new SqlParameter("lastUpdatedBy", createdBy),
                    new SqlParameter("lastUpdatedDate", lastUpdatedDate),
                    new SqlParameter("theme", setting.Theme),
                    new SqlParameter("currencyCode", setting.CurrencyCode),
                    new SqlParameter("taxMethodology", setting.TaxMethodology),
                    new SqlParameter("fiscalMonth", setting.FiscalMonth),
                    new SqlParameter("fiscalDay", setting.FiscalDay),
                };

                var settingQuery = $@"UPDATE [settings]
                            SET
                            [created_by] = @createdBy
                            ,[last_updated_by] = @createdBy
                            ,[last_updated_date] = @lastUpdatedDate
                            ,[currency_code] = @currencyCode
                            ,[tax_methodology] = @taxMethodology
                            ,[fiscal_month] = @fiscalMonth
                            ,[fiscal_day] = @fiscalDay
                            ,[theme] = @theme
                            WHERE [settings].[id] = @id";

                sqlHelper.Update(settingQuery, CommandType.Text, settingParameters.ToArray());
                sqlHelper.CloseConnection();


                return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();

                return Shared.WebApi.Wrap(false);
            }
        }

        public object GetSetting()
        {
            try
            {
                var query = $@"SELECT id, 
                                created_by, 
                                created_date, 
                                last_updated_by, 
                                last_updated_date,                               
                                currency_code, 
                                tax_methodology, 
                                fiscal_month, 
                                fiscal_day,
                                theme
                               FROM settings";


                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, null);

                var status = dataTable.Rows.Count > 0 ? HttpStatusCode.OK : HttpStatusCode.NotFound;

                return Shared.WebApi.Wrap(true, dataTable, status);
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false);
            }
        }
    }
}