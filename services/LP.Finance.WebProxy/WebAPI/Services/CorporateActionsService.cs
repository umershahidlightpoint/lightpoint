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
    public class CorporateActionsService : ICorporateActionsService
    {
        private static readonly string ConnectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();
        public SqlHelper SqlHelper = new SqlHelper(ConnectionString);

        public object CashDividendAudit(int id)
        {
            try
            {
                List<SqlParameter> cashDividendAuditParams = new List<SqlParameter>
                {
                    new SqlParameter("id", id)
                };

                var query = $@"select * from cash_dividends_audit_trail where cash_dividend_id = @id";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text, cashDividendAuditParams.ToArray());

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "Dividends fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching dividends");
            }
        }

        public object CreateCashDividend(CashDividendInputDto obj)
        {
            try
            {
                SqlHelper.VerifyConnection();
                var createdDate = DateTime.UtcNow;
                var createdBy = "user";

                List<SqlParameter> cashDividendParams = new List<SqlParameter>
                {
                    new SqlParameter("createdBy", createdBy),
                    new SqlParameter("createdDate", createdDate),
                    new SqlParameter("symbol", obj.Symbol),
                    new SqlParameter("noticeDate", obj.NoticeDate),
                    new SqlParameter("executionDate", obj.ExecutionDate),
                    new SqlParameter("recordDate", obj.RecordDate),
                    new SqlParameter("payDate", obj.PayDate),
                    new SqlParameter("rate", obj.Rate),
                    new SqlParameter("currency", obj.Currency),
                    new SqlParameter("withholdingRate", obj.WithholdingRate),
                    new SqlParameter("fxrate", obj.FxRate),
                };

                var query = $@"INSERT INTO [cash_dividends]
                           ([created_by]
                           ,[created_date]
                           ,[symbol]
                           ,[notice_date]
                           ,[execution_date]
                           ,[record_date]
                           ,[pay_date]
                           ,[rate]
                           ,[currency]
                           ,[withholding_rate]
                           ,[fx_rate])
                     VALUES
                           (@createdBy
                           ,@createdDate
                           ,@symbol
                           ,@noticeDate
                           ,@executionDate
                           ,@recordDate
                           ,@payDate
                           ,@rate
                           ,@currency
                           ,@withholdingRate
                           ,@fxrate)";
                SqlHelper.SqlBeginTransaction();
                SqlHelper.Insert(query, CommandType.Text, cashDividendParams.ToArray());
                SqlHelper.SqlCommitTransaction();
                return Utils.Wrap(true, null, HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                SqlHelper.SqlRollbackTransaction();
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }

        public object DeleteCashDividend(int id)
        {
            try
            {
                SqlHelper.VerifyConnection();
                var lastUpdatedDate = DateTime.UtcNow;
                var lastUpdatedBy = "user";

                List<SqlParameter> cashDividendParams = new List<SqlParameter>
                {
                    new SqlParameter("id", id),
                    new SqlParameter("lastUpdatedBy", lastUpdatedBy),
                    new SqlParameter("lastUpdatedDate", lastUpdatedDate)
                };

                var query = $@"UPDATE [dbo].[cash_dividends]
                           SET [last_updated_by] = @lastUpdatedBy
                              ,[last_updated_date] = @lastUpdatedDate
                              ,[active_flag] = 0
                         WHERE id = @id";

                SqlHelper.SqlBeginTransaction();
                SqlHelper.Update(query, CommandType.Text, cashDividendParams.ToArray());
                SqlHelper.SqlCommitTransaction();
                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                SqlHelper.SqlRollbackTransaction();
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }

        public object EditCashDividend(CashDividendInputDto obj)
        {
            try
            {
                SqlHelper.VerifyConnection();
                var lastUpdatedDate = DateTime.UtcNow;
                var lastUpdatedBy = "user";

                List<SqlParameter> cashDividendParams = new List<SqlParameter>
                {
                    new SqlParameter("id", obj.Id),
                    new SqlParameter("lastUpdatedBy", lastUpdatedBy),
                    new SqlParameter("lastUpdatedDate", lastUpdatedDate),
                    new SqlParameter("symbol", obj.Symbol),
                    new SqlParameter("noticeDate", obj.NoticeDate),
                    new SqlParameter("executionDate", obj.ExecutionDate),
                    new SqlParameter("recordDate", obj.RecordDate),
                    new SqlParameter("payDate", obj.PayDate),
                    new SqlParameter("rate", obj.Rate),
                    new SqlParameter("currency", obj.Currency),
                    new SqlParameter("withholdingRate", obj.WithholdingRate),
                    new SqlParameter("fxrate", obj.FxRate),
                };

                var query = $@"UPDATE [dbo].[cash_dividends]
                           SET [last_updated_by] = @lastUpdatedBy
                              ,[last_updated_date] = @lastUpdatedDate
                              ,[symbol] = @symbol
                              ,[notice_date] = @noticeDate
                              ,[execution_date] = @executionDate
                              ,[record_date] = @recordDate
                              ,[pay_date] = @payDate
                              ,[rate] = @rate
                              ,[currency] = @currency
                              ,[withholding_rate] = @withholdingRate
                              ,[fx_rate] = @fxrate
                         WHERE id = @id";

                SqlHelper.SqlBeginTransaction();
                SqlHelper.Update(query, CommandType.Text, cashDividendParams.ToArray());
                SqlHelper.SqlCommitTransaction();
                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                SqlHelper.SqlRollbackTransaction();
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }

        public object GetCashDividends()
        {
            try
            {
                var query = $@"select * from cash_dividends where active_flag = 1";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "Dividends fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching dividends");
            }
        }

        public object GetDividendDetails()
        {
            try
            {
                var query = $@"select * from vwDividendDetails";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "Dividend details fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching dividend details");
            }
        }

        // Stock Splits

        public object StockSplitAudit(int id)
        {
            try
            {
                List<SqlParameter> cashDividendAuditParams = new List<SqlParameter>
                {
                    new SqlParameter("id", id)
                };

                var query = $@"select * from stock_splits_audit_trail where stock_split_id = @id";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text, cashDividendAuditParams.ToArray());

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "StockSplits fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching dividends");
            }
        }

        public object CreateStockSplit(StockSplitInputDto obj)
        {
            try
            {
                SqlHelper.VerifyConnection();
                var createdDate = DateTime.UtcNow;
                var createdBy = "user";

                List<SqlParameter> stockSplitParams = new List<SqlParameter>
                {
                    new SqlParameter("createdBy", createdBy),
                    new SqlParameter("createdDate", createdDate),
                    new SqlParameter("symbol", obj.Symbol),
                    new SqlParameter("noticeDate", obj.NoticeDate),
                    new SqlParameter("executionDate", obj.ExecutionDate),
                    new SqlParameter("topRatio", obj.TopRatio),
                    new SqlParameter("bottomRatio", obj.BottomRatio),
                    new SqlParameter("adjustmentFactor", obj.AdjustmentFactor),
                };

                var query = $@"INSERT INTO [stock_splits]
                           ([created_by]
                           ,[created_date]
                           ,[symbol]
                           ,[notice_date]
                           ,[execution_date]
                           ,[top_ratio]
                           ,[bottom_ratio]
                           ,[adjustment_factor])
                     VALUES
                           (@createdBy
                           ,@createdDate
                           ,@symbol
                           ,@noticeDate
                           ,@executionDate
                           ,@topRatio
                           ,@bottomRatio
                           ,@adjustmentFactor)";

                SqlHelper.SqlBeginTransaction();
                SqlHelper.Insert(query, CommandType.Text, stockSplitParams.ToArray());
                SqlHelper.SqlCommitTransaction();
                return Utils.Wrap(true, null, HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                SqlHelper.SqlRollbackTransaction();
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }

        public object DeleteStockSplit(int id)
        {
            try
            {
                SqlHelper.VerifyConnection();
                var lastUpdatedDate = DateTime.UtcNow;
                var lastUpdatedBy = "user";

                List<SqlParameter> stockSplitParams = new List<SqlParameter>
                {
                    new SqlParameter("id", id),
                    new SqlParameter("lastUpdatedBy", lastUpdatedBy),
                    new SqlParameter("lastUpdatedDate", lastUpdatedDate)
                };

                var query = $@"UPDATE [dbo].[stock_splits]
                           SET [last_updated_by] = @lastUpdatedBy
                              ,[last_updated_date] = @lastUpdatedDate
                              ,[active_flag] = 0
                         WHERE id = @id";

                SqlHelper.SqlBeginTransaction();
                SqlHelper.Update(query, CommandType.Text, stockSplitParams.ToArray());
                SqlHelper.SqlCommitTransaction();
                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                SqlHelper.SqlRollbackTransaction();
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }

        public object EditStockSplit(StockSplitInputDto obj)
        {
            try
            {
                SqlHelper.VerifyConnection();
                var lastUpdatedDate = DateTime.UtcNow;
                var lastUpdatedBy = "user";

                List<SqlParameter> stockSplitParams = new List<SqlParameter>
                {
                    new SqlParameter("id", obj.Id),
                    new SqlParameter("lastUpdatedBy", lastUpdatedBy),
                    new SqlParameter("lastUpdatedDate", lastUpdatedDate),
                    new SqlParameter("symbol", obj.Symbol),
                    new SqlParameter("noticeDate", obj.NoticeDate),
                    new SqlParameter("executionDate", obj.ExecutionDate),
                    new SqlParameter("topRatio", obj.TopRatio),
                    new SqlParameter("bottomRatio", obj.BottomRatio),
                    new SqlParameter("adjustmentFactor", obj.AdjustmentFactor),
                };

                var query = $@"UPDATE [dbo].[stock_splits]
                           SET [last_updated_by] = @lastUpdatedBy
                              ,[last_updated_date] = @lastUpdatedDate
                              ,[symbol] = @symbol
                              ,[notice_date] = @noticeDate
                              ,[execution_date] = @executionDate
                              ,[top_ratio] = @topRatio
                              ,[bottom_ratio] = @bottomRatio
                              ,[adjustment_factor] = @adjustmentFactor
                         WHERE id = @id";

                SqlHelper.SqlBeginTransaction();
                SqlHelper.Update(query, CommandType.Text, stockSplitParams.ToArray());
                SqlHelper.SqlCommitTransaction();
                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                SqlHelper.SqlRollbackTransaction();
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
            finally
            {
                SqlHelper.CloseConnection();
            }
        }

        public object GetStockSplits()
        {
            try
            {
                var query = $@"select * from stock_splits where active_flag = 1";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "StockSplits fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching dividends");
            }
        }

        public object GetStockSplitDetails()
        {
            try
            {
                var query = $@"select * from vwDividendDetails";

                var dataTable = SqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "Dividend details fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching dividend details");
            }
        }
    }
}
