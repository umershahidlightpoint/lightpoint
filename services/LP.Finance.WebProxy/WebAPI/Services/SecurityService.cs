using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class SecurityService : ISecurityService
    {
        private static readonly string
          connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);

        public object AddSecurityDetails(SecurityDetailsInputDto details)
        {
            try
            {
                int? id = null;
                string message;
                var query = $"select top 1 SecurityId from current_trade_state where symbol = @symbol";
                List<SqlParameter> p = new List<SqlParameter>
                {
                    new SqlParameter("symbol", details.Symbol)
                };

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, p.ToArray());
                foreach (DataRow dr in dataTable.Rows)
                {
                    id = (int)dr["SecurityId"];
                }

                if (!id.HasValue)
                {
                    message = "Security id not found against this symbol";
                    return Shared.WebApi.Wrap(false, null, HttpStatusCode.Forbidden);
                }


                sqlHelper.VerifyConnection();
                var createdDate = DateTime.Now;
                var createdBy = "user";

                List<SqlParameter> securityDetailsParams = new List<SqlParameter>
                {
                    new SqlParameter("createdBy", createdBy),
                    new SqlParameter("createdDate", createdDate),
                    new SqlParameter("symbol", details.Symbol),
                    new SqlParameter("securityId", id.Value),
                    new SqlParameter("maturityDate", details.MaturityDate.HasValue ? (object)details.MaturityDate : DBNull.Value),
                    new SqlParameter("valuationDate", details.ValuationDate.HasValue ? (object)details.ValuationDate: DBNull.Value),
                    new SqlParameter("spread", details.Spread.HasValue ? (object)details.Spread : DBNull.Value),
                    new SqlParameter("securityReturnDescription", !string.IsNullOrEmpty(details.SecurityReturnDescription) ? (object)details.SecurityReturnDescription : DBNull.Value),
                    new SqlParameter("financingLeg", !string.IsNullOrEmpty(details.FinancingLeg) ? (object)details.FinancingLeg : DBNull.Value),
                    new SqlParameter("financingEndDate", details.FinancingEndDate.HasValue ? (object)details.FinancingEndDate: DBNull.Value),
                    new SqlParameter("financingPaymentDate", details.FinancingPaymentDate.HasValue ? (object)details.FinancingPaymentDate: DBNull.Value),
                    new SqlParameter("financingResetDateType",!string.IsNullOrEmpty(details.FinancingResetDateType) ? (object)details.FinancingResetDateType : DBNull.Value),
                    new SqlParameter("financingResetDate", !string.IsNullOrEmpty(details.FinancingResetDate) ? (object)details.FinancingResetDate : ""),
                    new SqlParameter("nextFinaningEndDateType", !string.IsNullOrEmpty(details.NextFinancingEndDateType) ? (object)details.NextFinancingEndDateType : DBNull.Value),
                    new SqlParameter("nextFinancingEndDate", !string.IsNullOrEmpty(details.NextFinancingEndDate) ? (object)details.NextFinancingEndDate : DBNull.Value),
                    new SqlParameter("fixedRate",  details.FixedRate.HasValue ? (object)details.FixedRate : DBNull.Value),
                    new SqlParameter("dccFixedRate", !string.IsNullOrEmpty(details.DCCFixedRate) ? (object)details.DCCFixedRate : DBNull.Value),
                    new SqlParameter("floatingRate", !string.IsNullOrEmpty(details.FloatingRate) ? (object)details.FloatingRate : DBNull.Value),
                    new SqlParameter("dccFloatingRate", !string.IsNullOrEmpty(details.DCCFloatingRate) ? (object)details.DCCFloatingRate : DBNull.Value),
                    new SqlParameter("primaryMarket", !string.IsNullOrEmpty(details.PrimaryMarket) ? (object)details.PrimaryMarket : DBNull.Value),
                    new SqlParameter("referenceEquity", details.ReferenceEquity.HasValue ? (object)details.ReferenceEquity : DBNull.Value),
                    new SqlParameter("referenceObligation", details.ReferenceObligation.HasValue ? (object)details.ReferenceObligation : DBNull.Value),
                    new SqlParameter("upfront", details.Upfront.HasValue ? (object)details.Upfront : DBNull.Value),
                    new SqlParameter("premiumRate", details.PremiumRate.HasValue ? (object)details.PremiumRate : DBNull.Value),
                    new SqlParameter("premiumFrequency", details.PremiumFrequency.HasValue ? (object)details.PremiumFrequency : DBNull.Value)
                };

                var securityDetailsQuery = $@"INSERT INTO [security_details]
                            ([security_id]
                           ,[symbol]
                           ,[created_by]
                           ,[created_date]
                           ,[maturity_date]
                           ,[valuation_date]
                           ,[spread]
                           ,[security_return_description]
                           ,[financing_leg]
                           ,[financing_end_date]
                           ,[financing_payment_date]
                           ,[financing_reset_date_type]
                           ,[financing_reset_date]
                           ,[next_financing_end_date_type]
                           ,[next_financing_end_date]
                           ,[fixed_rate]
                           ,[dcc_fixed_rate]
                           ,[floating_rate]
                           ,[dcc_floating_rate]
                           ,[primary_market]
                           ,[reference_equity]
                           ,[reference_obligation]
                           ,[upfront]
                           ,[premium_rate]
                           ,[premium_frequency])
                     VALUES
                           (@securityId
                           ,@symbol
                           ,@createdBy
                           ,@createdDate
                           ,@maturityDate
                           ,@valuationDate
                           ,@spread
                           ,@securityReturnDescription
                           ,@financingLeg
                           ,@financingEndDate
                           ,@financingPaymentDate
                           ,@financingResetDateType
                           ,@financingResetDate
                           ,@nextFinaningEndDateType
                           ,@nextFinancingEndDate
                           ,@fixedRate
                           ,@dccFixedRate
                           ,@floatingRate
                           ,@dccFloatingRate
                           ,@primaryMarket
                           ,@referenceEquity
                           ,@referenceObligation
                           ,@upfront
                           ,@premiumRate
                           ,@premiumFrequency)";

                sqlHelper.SqlBeginTransaction();
                sqlHelper.Insert(securityDetailsQuery, CommandType.Text, securityDetailsParams.ToArray());
                sqlHelper.SqlCommitTransaction();
                return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                throw ex;
            }
            finally
            {
                sqlHelper.CloseConnection();
            }

        }

        public object EditSecurityDetails(SecurityDetailsInputDto details)
        {
            try
            {
                sqlHelper.VerifyConnection();
                var lastUpdatedDate = DateTime.UtcNow;
                var lastUpdatedBy = "user";

                List<SqlParameter> securityDetailParams = new List<SqlParameter>
                {
                    new SqlParameter("id", details.Id),
                    new SqlParameter("lastUpdatedBy", lastUpdatedBy),
                    new SqlParameter("lastUpdatedDate", lastUpdatedDate),
                    new SqlParameter("symbol", details.Symbol),
                    new SqlParameter("maturityDate", details.MaturityDate.HasValue ? (object)details.MaturityDate : DBNull.Value),
                    new SqlParameter("valuationDate", details.ValuationDate.HasValue ? (object)details.ValuationDate: DBNull.Value),
                    new SqlParameter("spread", details.Spread.HasValue ? (object)details.Spread : DBNull.Value),
                    new SqlParameter("securityReturnDescription", !string.IsNullOrEmpty(details.SecurityReturnDescription) ? (object)details.SecurityReturnDescription : DBNull.Value),
                    new SqlParameter("financingLeg", !string.IsNullOrEmpty(details.FinancingLeg) ? (object)details.FinancingLeg : DBNull.Value),
                    new SqlParameter("financingEndDate", details.FinancingEndDate.HasValue ? (object)details.FinancingEndDate: DBNull.Value),
                    new SqlParameter("financingPaymentDate", details.FinancingPaymentDate.HasValue ? (object)details.FinancingPaymentDate: DBNull.Value),
                    new SqlParameter("financingResetDateType", !string.IsNullOrEmpty(details.FinancingResetDateType) ? (object)details.FinancingResetDateType : DBNull.Value),
                    new SqlParameter("financingResetDate", !string.IsNullOrEmpty(details.FinancingResetDate) ? (object)details.FinancingResetDate : ""),
                    new SqlParameter("nextFinancingEndDateType", !string.IsNullOrEmpty(details.NextFinancingEndDateType) ? (object)details.NextFinancingEndDateType : DBNull.Value),
                    new SqlParameter("nextFinancingEndDate", !string.IsNullOrEmpty(details.NextFinancingEndDate) ? (object)details.NextFinancingEndDate : DBNull.Value),
                    new SqlParameter("fixedRate", details.FixedRate.HasValue ? (object)details.FixedRate : DBNull.Value),
                    new SqlParameter("dccFixedRate", !string.IsNullOrEmpty(details.DCCFixedRate) ? (object)details.DCCFixedRate : DBNull.Value),
                    new SqlParameter("floatingRate", !string.IsNullOrEmpty(details.FloatingRate) ? (object)details.FloatingRate : DBNull.Value),
                    new SqlParameter("dccFloatingRate", !string.IsNullOrEmpty(details.DCCFloatingRate) ? (object)details.DCCFloatingRate : DBNull.Value),
                    new SqlParameter("primaryMarket", !string.IsNullOrEmpty(details.PrimaryMarket) ? (object)details.PrimaryMarket : DBNull.Value),
                    new SqlParameter("referenceEquity", details.ReferenceEquity.HasValue ? (object)details.ReferenceEquity : DBNull.Value),
                    new SqlParameter("referenceObligation", details.ReferenceObligation.HasValue ? (object)details.ReferenceObligation : DBNull.Value),
                    new SqlParameter("upfront", details.Upfront.HasValue ? (object)details.Upfront : DBNull.Value),
                    new SqlParameter("premiumRate", details.PremiumRate.HasValue ? (object)details.PremiumRate : DBNull.Value),
                    new SqlParameter("premiumFrequency", details.PremiumFrequency.HasValue ? (object)details.PremiumFrequency : DBNull.Value),
                };

                var query = $@"UPDATE [dbo].[security_details]
                           SET [last_updated_by] = @lastUpdatedBy
                              ,[last_updated_date] = @lastUpdatedDate
                              ,[symbol] = @symbol
                              ,[maturity_date] = @maturityDate
                              ,[valuation_date] = @valuationDate
                              ,[spread] = @spread
                              ,[security_return_description] = @securityReturnDescription
                              ,[financing_leg] = @financingLeg
                              ,[financing_end_date] = @financingEndDate
                              ,[financing_payment_date] = @financingPaymentDate
                              ,[financing_reset_date_type] = @financingResetDateType
                              ,[financing_reset_date] = @financingResetDate
                              ,[next_financing_end_date_type] = @nextFinancingEndDateType
                              ,[next_financing_end_date] = @nextFinancingEndDate
                              ,[fixed_rate] = @fixedRate
                              ,[dcc_fixed_rate] = @dccFixedRate
                              ,[floating_rate] = @floatingRate
                              ,[dcc_floating_rate] = @dccFloatingRate
                              ,[primary_market] = @primaryMarket
                              ,[reference_equity] = @referenceEquity
                              ,[reference_obligation] = @referenceObligation
                              ,[upfront] = @upfront
                              ,[premium_rate] = @premiumRate
                              ,[premium_frequency] = @premiumFrequency
                         WHERE id = @id";

                sqlHelper.SqlBeginTransaction();
                sqlHelper.Update(query, CommandType.Text, securityDetailParams.ToArray());
                sqlHelper.SqlCommitTransaction();
                return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                sqlHelper.CloseConnection();
            }
        }

        public object GetSecurityConfig(string symbol)
        {
            try
            {

                string securityType = "";
                string message;
                var query = $"select top 1 SecurityType from current_trade_state where symbol = @symbol";
                List<SqlParameter> p = new List<SqlParameter>
                {
                   new SqlParameter("symbol", symbol)
                };

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, p.ToArray());
                foreach (DataRow dr in dataTable.Rows)
                {
                    securityType = (string)dr["SecurityType"];
                }

                if (securityType == "")
                {
                    message = "Security Type not found against this symbol";
                    return Shared.WebApi.Wrap(false, null, HttpStatusCode.Forbidden);
                }

                var schema = Shared.WebApi.GetFile<List<SecurityTypeFormConfig>>("security_details", "MockData");

                var results = schema.Where(o => o.SecurityType == securityType);

                return Shared.WebApi.Wrap(true, results, HttpStatusCode.OK, "Security Details fetched successfully");

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object GetSecurityDetails()
        {
            try
            {
                var query = $@"select * from security_details where active_flag = 1";

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject(jsonResult);

                return Shared.WebApi.Wrap(true, json, HttpStatusCode.OK, "Securities fetched successfully");
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching securities");
            }
        }

        public object DeleteSecurityDetail(int id)
        {
            try
            {
                sqlHelper.VerifyConnection();
                var lastUpdatedDate = DateTime.UtcNow;
                var lastUpdatedBy = "user";

                List<SqlParameter> securityDetailParams = new List<SqlParameter>
                {
                    new SqlParameter("id", id),
                    new SqlParameter("lastUpdatedBy", lastUpdatedBy),
                    new SqlParameter("lastUpdatedDate", lastUpdatedDate)
                };

                var query = $@"UPDATE [dbo].[security_details]
                           SET [last_updated_by] = @lastUpdatedBy
                              ,[last_updated_date] = @lastUpdatedDate
                              ,[active_flag] = 0
                         WHERE id = @id";

                sqlHelper.SqlBeginTransaction();
                sqlHelper.Update(query, CommandType.Text, securityDetailParams.ToArray());
                sqlHelper.SqlCommitTransaction();
                return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                sqlHelper.CloseConnection();
            }
        }

        public object GetSecurityDetail(string symbol)
        {
            try
            {
                List<SqlParameter> securityDetailParams = new List<SqlParameter>
                {
                    new SqlParameter("symbol", symbol)
                };

                var query = $@"select * from security_details WHERE symbol = @symbol and active_flag = 1";

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, securityDetailParams.ToArray());

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject(jsonResult);

                return Shared.WebApi.Wrap(true, json, HttpStatusCode.OK, "Security Detail fetched successfully");
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching security detail");
            }
        }

    }
}
