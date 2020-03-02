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
using SqlDAL.Core;

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
                int ?id = null;
                string message;
                var query = $"select top 1 SecurityId from current_trade_state where symbol = @symbol";
                List<SqlParameter> p = new List<SqlParameter>
                {
                    new SqlParameter("symbol", details.Symbol)
                };

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, p.ToArray());
                foreach(DataRow dr in dataTable.Rows)
                {
                    id = (int)dr["SecurityId"];
                }

                if (!id.HasValue)
                {
                    message = "Security id not found against this symbol";
                    return Utils.Wrap(false, null, HttpStatusCode.Forbidden);
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
                    new SqlParameter("securityReturnDescription", details.SecurityReturnDescription),
                    new SqlParameter("financingLeg", details.FinancingLeg),
                    new SqlParameter("financingEndDate", details.FinancingEndDate),
                    new SqlParameter("financingPaymentDate", details.FinancingPaymentDate),
                    new SqlParameter("financingResetDateType", details.FinancingResetDateType),
                    new SqlParameter("financingResetDate", details.FinancingResetDate),
                    new SqlParameter("nextFinaningEndDateType", details.NextFinancingEndDateType),
                    new SqlParameter("nextFinancingEndDate", details.NextFinancingEndDate),
                    new SqlParameter("fixedRate", details.FixedRate.HasValue ? (object)details.FixedRate : DBNull.Value),
                    new SqlParameter("dccFixedRate", details.DCCFixedRate),
                    new SqlParameter("floatingRate", details.FloatingRate),
                    new SqlParameter("dccFloatingRate", details.DCCFloatingRate),
                    new SqlParameter("primaryMarket", details.PrimaryMarket),
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
                return Utils.Wrap(true, null, HttpStatusCode.OK);

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
            throw new NotImplementedException();
        }

        public object GetSecurityDetails(string symbol)
        {
            throw new NotImplementedException();
        }
    }
}
