using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Text;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Newtonsoft.Json;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    class TaxRateService : ITaxRateService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object GetTaxRates()
        {
            dynamic postingEngine = new PostingEngineService().GetProgress();

            if (postingEngine.IsRunning)
            {
                return Utils.Wrap(false, "Posting Engine is currently Running");
            }

            SqlHelper sqlHelper = new SqlHelper(connectionString);

            var query = new StringBuilder($@"SELECT [Id]
                                        ,[effective_from] AS EffectiveFrom
                                        ,[effective_to] AS EffectiveTo
                                        ,[long_term_tax_rate] AS LongTermTaxRate
                                        ,[short_term_tax_rate] AS ShortTermTaxRate
                                        ,[short_term_period] AS ShortTermPeriod
                                        ,[created_date] AS CreatedDate
                                        ,[last_updated_date] AS LastUpdatedDate
                                        ,[created_by] AS CreatedBy
                                        ,[last_updated_by] AS LastUpdatedBy
                                        FROM [tax_rate]
                                        ORDER BY [effective_from] ASC");

            var dataTable = sqlHelper.GetDataTable(query.ToString(), CommandType.Text);

            dynamic taxRates = new System.Dynamic.ExpandoObject();

            var taxRatesJson = JsonConvert.SerializeObject(dataTable);

            dynamic taxRatesResult = JsonConvert.DeserializeObject(taxRatesJson);

            return Utils.GridWrap(taxRatesResult);
        }

        public object CreateTaxRate(TaxRateInputDto taxRate)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();

                List<SqlParameter> taxRateParameters = new List<SqlParameter>
                {
                    new SqlParameter("effectiveFrom", taxRate.EffectiveFrom),
                    new SqlParameter("effectiveTo", taxRate.EffectiveTo),
                    new SqlParameter("longTermTaxRate", taxRate.LongTermTaxRate),
                    new SqlParameter("shortTermTaxRate", taxRate.ShortTermTaxRate),
                    new SqlParameter("shortTermPeriod", taxRate.ShortTermPeriod),
                    new SqlParameter("createdDate", DateTime.Now),
                    new SqlParameter("createdBy", "John Smith")
                };

                var taxRateQuery = $@"INSERT INTO [tax_rate]
                                    ([effective_from]
                                    ,[effective_to]
                                    ,[long_term_tax_rate]
                                    ,[short_term_tax_rate]
                                    ,[short_term_period]
                                    ,[created_date]
                                    ,[last_updated_date]
                                    ,[created_by])
                                    VALUES
                                    (@effectiveFrom
                                    ,@effectiveTo
                                    ,@longTermTaxRate
                                    ,@shortTermTaxRate
                                    ,@shortTermPeriod
                                    ,@createdDate
                                    ,@createdDate
                                    ,@createdBy)";

                sqlHelper.Insert(taxRateQuery, CommandType.Text, taxRateParameters.ToArray());
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }
    }
}