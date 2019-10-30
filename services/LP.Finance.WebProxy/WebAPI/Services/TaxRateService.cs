using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Net;
using System.Text;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class TaxRateService : ITaxRateService
    {
        private readonly string connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object GetTaxRates()
        {
            dynamic postingEngine = new PostingEngineService().GetProgress();

            if (postingEngine.IsRunning)
            {
                return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
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
                                        WHERE [active_flag] = 1
                                        ORDER BY [effective_from] ASC");

            var taxRates = new List<TaxRateOutputDto>();
            using (var reader =
                sqlHelper.GetDataReader(query.ToString(), CommandType.Text, null, out var sqlConnection))
            {
                while (reader.Read())
                {
                    taxRates.Add(new TaxRateOutputDto
                    {
                        Id = Convert.ToInt32(reader["Id"]),
                        EffectiveFrom = Convert.ToDateTime(reader["EffectiveFrom"]),
                        EffectiveTo = Convert.ToDateTime(reader["EffectiveTo"]),
                        LongTermTaxRate = Convert.ToDecimal(reader["LongTermTaxRate"]),
                        ShortTermTaxRate = Convert.ToDecimal(reader["ShortTermTaxRate"]),
                        ShortTermPeriod = Convert.ToDecimal(reader["ShortTermPeriod"]),
                        CreatedDate = Convert.ToDateTime(reader["CreatedDate"]),
                        LastUpdatedDate = Convert.ToDateTime(reader["LastUpdatedDate"]),
                        CreatedBy = reader["CreatedBy"].ToString(),
                        LastUpdatedBy = reader["LastUpdatedBy"].ToString()
                    });
                }

                reader.Close();
                sqlConnection.Close();
            }

            taxRates = ValidateTaxPeriods(taxRates);

            return Utils.Wrap(true, taxRates);
        }

        public object CreateTaxRate(TaxRateInputDto taxRate)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

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

            try
            {
                sqlHelper.VerifyConnection();

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

        public object EditTaxRate(int id, TaxRateInputDto taxRate)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> taxRateParameters = new List<SqlParameter>
            {
                new SqlParameter("id", id),
                new SqlParameter("effectiveFrom", taxRate.EffectiveFrom),
                new SqlParameter("effectiveTo", taxRate.EffectiveTo),
                new SqlParameter("longTermTaxRate", taxRate.LongTermTaxRate),
                new SqlParameter("shortTermTaxRate", taxRate.ShortTermTaxRate),
                new SqlParameter("shortTermPeriod", taxRate.ShortTermPeriod),
                new SqlParameter("lastUpdatedDate", DateTime.Now),
                new SqlParameter("lastUpdatedBy", "John Smith")
            };

            var taxRateQuery = $@"UPDATE [tax_rate]
                                SET [effective_from] = @effectiveFrom
                                ,[effective_to] = @effectiveTo
                                ,[long_term_tax_rate] = @longTermTaxRate
                                ,[short_term_tax_rate] = @shortTermTaxRate
                                ,[short_term_period] = @shortTermPeriod
                                ,[last_updated_date] = @lastUpdatedDate
                                ,[last_updated_by] = @lastUpdatedBy
                                WHERE [tax_rate].[Id] = @id";

            try
            {
                sqlHelper.VerifyConnection();

                sqlHelper.Update(taxRateQuery, CommandType.Text, taxRateParameters.ToArray());
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();

                Console.WriteLine($"Edit Tax Rate Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        public object DeleteTaxRate(int id)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> taxRateParameters = new List<SqlParameter>
            {
                new SqlParameter("id", id)
            };

            var taxRateQuery = $@"UPDATE [tax_rate]
                                    SET [active_flag] = 0
                                    WHERE [tax_rate].[Id] = @id";

            try
            {
                sqlHelper.VerifyConnection();

                sqlHelper.Update(taxRateQuery, CommandType.Text, taxRateParameters.ToArray());

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

        private List<TaxRateOutputDto> ValidateTaxPeriods(List<TaxRateOutputDto> taxRates)
        {
            for (var i = 0; i < taxRates.Count - 1; i++)
            {
                if (taxRates[i].EffectiveTo.AddDays(1) < taxRates[i + 1].EffectiveFrom)
                {
                    taxRates[i + 1].IsGapPresent = true;
                }
                else if (taxRates[i].EffectiveFrom <= taxRates[i + 1].EffectiveTo &&
                         taxRates[i].EffectiveTo >= taxRates[i + 1].EffectiveFrom)
                {
                    taxRates[i + 1].IsOverLapped = true;
                }
            }

            return taxRates;
        }
    }
}