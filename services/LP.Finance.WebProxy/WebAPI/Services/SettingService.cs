﻿using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using SqlDAL.Core;

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
                var tradesResult = Utils.GetWebApiData(tradesURL);

                tradesResult.Wait();
                var result = tradesResult.Result;

                var elements = JsonConvert.DeserializeObject<List<Transaction>>(result);
                var currencyList = elements.Select(item => item.TradeCurrency).Distinct().ToList();

                return Utils.Wrap(true, currencyList, HttpStatusCode.OK);
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
                sqlHelper.CloseConnection();

                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();

                return Utils.Wrap(false);
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
                            WHERE [settings].[id] = @id";

                sqlHelper.Update(settingQuery, CommandType.Text, settingParameters.ToArray());
                sqlHelper.CloseConnection();


                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();

                return Utils.Wrap(false);
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
                                fiscal_day
                               FROM settings";


                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, null);

                var status = dataTable.Rows.Count > 0 ? HttpStatusCode.OK : HttpStatusCode.NotFound;

                return Utils.Wrap(true, dataTable, status);
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false);
            }
        }
    }
}