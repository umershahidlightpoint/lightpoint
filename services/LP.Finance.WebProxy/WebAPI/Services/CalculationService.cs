using LP.FileProcessing;
using LP.Finance.Common.IO;
using LP.Finance.Common;
using LP.Finance.Common.Calculators;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Model;
using Newtonsoft.Json;
using SqlDAL.Core;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Data.SqlTypes;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using LP.Shared.FileMetaData;
using static System.String;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class CalculationService : ICalculationService
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        private static readonly string
            ConnectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public object GetMonthlyPerformance(DateTime? dateFrom = null, DateTime? dateTo = null, string fund = null,
            string portfolio = null)
        {
            List<SqlParameter> sqlParams = new List<SqlParameter>();

            var query = $@"SELECT id AS Id, 
                        estimated AS Estimated, 
                        start_month_estimate_nav AS StartOfMonthEstimateNav, 
                        performance_date AS PerformanceDate, 
                        fund AS Fund, 
                        portfolio AS PortFolio, 
                        monthly_end_nav AS MonthEndNav, 
                        performance AS Performance, 
                        mtd AS MTD, 
                        ytd_net_performance AS YTDNetPerformance, 
                        qtd_net_perc AS QTD, 
                        ytd_net_perc AS YTD, 
                        itd_net_perc AS ITD, 
                        created_by AS CreatedBy, 
                        last_updated_by AS LastUpdatedBy, 
                        created_date AS CreatedDate, 
                        last_updated_date AS LastUpdatedDate 
                        FROM monthly_performance";

            if (dateTo.HasValue)
            {
                sqlParams.Add(new SqlParameter("dateTo", dateTo.Value.Date.ToString("yyyy-MM-dd")));
                query += " WHERE performance_date <= @dateTo";
            }

            if (dateFrom.HasValue)
            {
                sqlParams.Add(new SqlParameter("dateFrom", dateFrom.Value.Date.ToString("yyyy-MM-dd")));
                query += dateTo.HasValue
                    ? " AND performance_date >= @dateFrom"
                    : " WHERE performance_date >= @dateFrom";
            }

            if (!IsNullOrWhiteSpace(fund))
            {
                sqlParams.Add(new SqlParameter("fund", fund));
                query += dateTo.HasValue || dateFrom.HasValue ? " AND fund = @fund" : " WHERE fund = @fund";
            }

            if (!IsNullOrWhiteSpace(portfolio))
            {
                sqlParams.Add(new SqlParameter("portfolio", portfolio));
                query += dateTo.HasValue || dateFrom.HasValue || !IsNullOrWhiteSpace(fund)
                    ? " AND portfolio = @portfolio"
                    : " WHERE portfolio = @portfolio";
            }

            query += " ORDER BY performance_date ASC, id ASC";

            var dataTable = new SqlHelper(ConnectionString).GetDataTable(query, CommandType.Text, sqlParams.ToArray());

            var jsonResult = JsonConvert.SerializeObject(dataTable);

            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            return Shared.WebApi.Wrap(true, json);
        }

        public object CalculateMonthlyPerformance(List<MonthlyPerformance> obj)
        {
            try
            {
                var sorted = obj.OrderBy(x => x.PerformanceDate).ThenBy(x => x.RowId).ToList();

                var groupedByPortfolio = sorted.GroupBy(x => x.PortFolio).Select(x => new
                {
                    Portfolio = x.Key,
                    YearlyData = x.ToList().GroupBy(y => y.PerformanceDate.Year)
                }).ToList();

                // var groupedByYear = sorted.GroupBy(x => x.PerformanceDate.Year).ToList();

                MonthlyPerformance priorData = null;
                MonthlyPerformance priorDataForInception = priorData;

                decimal newDecimalValue = 0;

                Dictionary<int, int> quarterCount = new Dictionary<int, int>();
                InitializeQuarterDictionary(quarterCount);

                foreach (var portfolio in groupedByPortfolio)
                {
                    foreach (var group in portfolio.YearlyData)
                    {
                        foreach (var item in group)
                        {
                            if (item.MonthEndNav.HasValue)
                            {
                                if (priorData != null)
                                {
                                }
                            }

                            if (item.MTD.HasValue)
                            {
                                if (priorData != null)
                                {
                                    if (CheckForBeginningOfQuarter(item.PerformanceDate) &&
                                        quarterCount[item.PerformanceDate.Month] == 0)
                                    {
                                        // Beginning of quarter, hence value will be the same as MTD.
                                        newDecimalValue = item.MTD.HasValue ? item.MTD.Value : 0;

                                        if (CheckForChanges(item.QTD, newDecimalValue))
                                        {
                                            item.Modified = true;
                                        }

                                        item.QTD = newDecimalValue;
                                        quarterCount[item.PerformanceDate.Month] += 1;
                                    }
                                    else
                                    {
                                        if (CheckForBeginningOfQuarter(item.PerformanceDate))
                                        {
                                            quarterCount[item.PerformanceDate.Month] += 1;
                                        }

                                        // For QTD, determine the month offset of this quarter. If it is the beginning of the quarter for e.g (April for Q2), value will remain the same. Otherwise, calculated value will depend on the previous result.
                                        if (IfDatesLieInTheSameQuarter(priorData.PerformanceDate, item.PerformanceDate))
                                        {
                                            newDecimalValue = CalculateQTD(item, priorData);
                                        }
                                        else
                                        {
                                            newDecimalValue = item.MTD.HasValue ? item.MTD.Value : 0;
                                        }

                                        if (CheckForChanges(item.QTD, newDecimalValue))
                                        {
                                            item.Modified = true;
                                        }

                                        item.QTD = newDecimalValue;
                                    }
                                }
                                else
                                {
                                    newDecimalValue = item.MTD.HasValue ? item.MTD.Value : 0;
                                    if (CheckForChanges(item.QTD, newDecimalValue))
                                    {
                                        item.Modified = true;
                                    }

                                    if (CheckForBeginningOfQuarter(item.PerformanceDate))
                                    {
                                        quarterCount[item.PerformanceDate.Month] += 1;
                                    }

                                    item.QTD = newDecimalValue;
                                }

                                if (priorData != null)
                                {
                                    // As the data is grouped by year, so for the first iteration, value will remain the same. Otherwise, calculated value will depend on the previous result.
                                    newDecimalValue = CalculateYTD(item, priorData);
                                    if (CheckForChanges(item.YTD, newDecimalValue))
                                    {
                                        item.Modified = true;
                                    }

                                    item.YTD = newDecimalValue;
                                }
                                else
                                {
                                    newDecimalValue = item.MTD.HasValue ? item.MTD.Value : 0;
                                    if (CheckForChanges(item.YTD, newDecimalValue))
                                    {
                                        item.Modified = true;
                                    }

                                    item.YTD = newDecimalValue;
                                }

                                if (priorDataForInception != null)
                                {
                                    // For ITD, value will always be calculated based on the previous result.
                                    newDecimalValue = CalculateITD(item, priorDataForInception);
                                    if (CheckForChanges(item.ITD, newDecimalValue))
                                    {
                                        item.Modified = true;
                                    }

                                    item.ITD = newDecimalValue;
                                }
                                else
                                {
                                    newDecimalValue = item.MTD.HasValue ? item.MTD.Value : 0;
                                    if (CheckForChanges(item.ITD, newDecimalValue))
                                    {
                                        item.Modified = true;
                                    }

                                    item.ITD = newDecimalValue;
                                }
                            }

                            if (item.Performance.HasValue)
                            {
                                if (priorData != null)
                                {
                                    // For YTD, determine the month offset of this year. If it is the beginning of the year for e.g. (January), value will remain the same. Otherwise, calculated value will depend on the previous result.
                                    newDecimalValue = CalculateYTDPerformance(item, priorData);
                                    if (CheckForChanges(item.YTDNetPerformance, newDecimalValue))
                                    {
                                        item.Modified = true;
                                    }

                                    item.YTDNetPerformance = newDecimalValue;
                                }
                                else
                                {
                                    newDecimalValue = item.Performance.HasValue ? item.Performance.Value : 0;
                                    if (CheckForChanges(item.YTDNetPerformance, newDecimalValue))
                                    {
                                        item.Modified = true;
                                    }

                                    item.YTDNetPerformance = newDecimalValue;
                                }
                            }

                            priorData = item;
                            priorDataForInception = item;

                            if (!CheckForBeginningOfQuarter(item.PerformanceDate))
                            {
                                ResetQuarterDictionary(quarterCount);
                            }
                        }

                        priorData = null;
                        ResetQuarterDictionary(quarterCount);
                    }

                    ResetQuarterDictionary(quarterCount);
                    priorData = null;
                    priorDataForInception = null;
                }

                // return Shared.WebApi.Wrap(true, groupedByYear.SelectMany(x => x.Select(y => y).ToList()), HttpStatusCode.OK, "Performance calculated successfully");
                return Shared.WebApi.Wrap(true, sorted, HttpStatusCode.OK, "Performance calculated successfully");
            }
            catch
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured during calculation");
            }
        }

        private bool CheckForChanges(decimal oldValue, decimal newValue)
        {
            if (oldValue != newValue)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private void ResetQuarterDictionary(Dictionary<int, int> quarterCount)
        {
            foreach (var key in quarterCount.Keys.ToList())
            {
                quarterCount[key] = 0;
            }
        }

        private bool CheckForBeginningOfQuarter(DateTime date)
        {
            if (date.Month == 1 || date.Month == 4 || date.Month == 7 || date.Month == 10)
            {
                return true;
            }
            else
            {
                return false;
            }
        }

        private bool IfDatesLieInTheSameQuarter(DateTime priorDate, DateTime currentDate)
        {
            int startOfQuarter = priorDate.Month;
            int endOfQuarter = GetRelevantQuarter(startOfQuarter) + 2;

            return (currentDate.Month >= startOfQuarter && currentDate.Month <= endOfQuarter);
        }

        private int GetRelevantQuarter(int month)
        {
            if (month == 1 || month == 2 || month == 3)
            {
                return 1;
            }
            else if (month == 4 || month == 5 || month == 6)
            {
                return 4;
            }
            else if (month == 7 || month == 8 || month == 9)
            {
                return 7;
            }
            else
            {
                return 10;
            }
        }

        public static object DBNullValueorStringIfNotNull(string value)
        {
            if (IsNullOrEmpty(value))
            {
                return DBNull.Value;
            }
            else
            {
                return value;
            }
        }

        public object AddOrUpdateMonthlyPerformance(List<MonthlyPerformance> obj)
        {
            var toBeInserted = obj.Where(x => x.Id == 0).ToList();
            var toBeUpdated = obj.Where(x => x.Id > 0).ToList();

            List<List<SqlParameter>> listOfParameters = new List<List<SqlParameter>>();
            foreach (var item in toBeUpdated)
            {
                List<SqlParameter> monthlyPerformanceParameters = new List<SqlParameter>
                {
                    new SqlParameter("id", item.Id),
                    new SqlParameter("last_updated_date", DateTime.UtcNow),
                    new SqlParameter("last_updated_by", "Jack Pearson"),
                    new SqlParameter("estimated", item.Estimated),
                    new SqlParameter("start_month_estimate_nav", item.StartOfMonthEstimateNav),
                    new SqlParameter("fund", item.Fund == null ? SqlString.Null : item.Fund),
                    new SqlParameter("portfolio", item.PortFolio == null ? SqlString.Null : item.PortFolio),
                    new SqlParameter("monthly_end_nav", item.MonthEndNav),
                    new SqlParameter("performance", item.Performance),
                    new SqlParameter("mtd", item.MTD),
                    new SqlParameter("ytd_net_performance", item.YTDNetPerformance),
                    new SqlParameter("qtd_net_perc", item.QTD),
                    new SqlParameter("ytd_net_perc", item.YTD),
                    new SqlParameter("itd_net_perc", item.ITD)
                };

                listOfParameters.Add(monthlyPerformanceParameters);
            }

            SqlHelper sqlHelper = new SqlHelper(ConnectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                new SQLBulkHelper().Insert("monthly_performance", toBeInserted.ToArray(), sqlHelper.GetConnection(),
                    sqlHelper.GetTransaction(), true);
                var updatePerformanceQuery = $@"UPDATE [dbo].[monthly_performance]
                                       SET [last_updated_date] = @last_updated_date
                                           ,[portfolio] = @portfolio
                                          ,[fund] = @fund
                                          ,[monthly_end_nav] = @monthly_end_nav
                                          ,[performance] = @performance
                                          ,[mtd] = @mtd
                                          ,[ytd_net_performance] = @ytd_net_performance
                                          ,[qtd_net_perc] = @qtd_net_perc
                                          ,[ytd_net_perc] = @ytd_net_perc
                                          ,[itd_net_perc] = @itd_net_perc
                                          ,[last_updated_by] = @last_updated_by
                                          ,[estimated] = @estimated
                                          ,[start_month_estimate_nav] = @start_month_estimate_nav
                                           where [id] = @id";

                foreach (var item in listOfParameters)
                {
                    sqlHelper.Update(updatePerformanceQuery, CommandType.Text, item.ToArray());
                }

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();

                return Shared.WebApi.Wrap(true, null, HttpStatusCode.OK, "Calculations saved successfully");
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();

                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while saving calculations");
            }
        }

        public async Task<object> UploadMonthlyPerformance(HttpRequestMessage requestMessage)
        {
            try
            {
                if (!ClearMonthlyPerformance())
                {
                    return Shared.WebApi.Wrap(false, "Monthly Performance data could not be deleted! Please try again.");
                }

                var uploadedResult = await Utils.SaveFileToServerAsync(requestMessage, "PerformanceData");
                if (!uploadedResult.Item1)
                    return Shared.WebApi.Wrap(false);

                var performancePath = uploadedResult.Item2;
                var performanceFileName = uploadedResult.Item3;

                var recordBody = new FileProcessor().ImportFile(performancePath, "Performance", "ImportFormats", ',');

                var records = JsonConvert.SerializeObject(recordBody.Item1);
                var performanceRecords = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(records);

                var failedRecords = new Dictionary<object, Row>();
                var key = 0;
                foreach (var item in recordBody.Item2)
                {
                    failedRecords.Add(key++, item);
                }

                var failedPerformanceList =
                    new FileManager(ConnectionString).MapFailedRecords(failedRecords, DateTime.Now, performanceFileName);

                List<FileInputDto> fileList = new List<FileInputDto>
                {
                    new FileInputDto(performancePath, performanceFileName, performanceRecords.Count,
                        "MonthlyPerformance",
                        "Upload",
                        failedPerformanceList,
                        DateTime.Now)
                };

                new FileManager(ConnectionString).InsertActivityAndPositionFiles(fileList);
                var monthlyPerformanceResult = CalculateMonthlyPerformance(performanceRecords);
                var monthlyPerformance = monthlyPerformanceResult.GetType().GetProperty("payload")
                    ?.GetValue(monthlyPerformanceResult, null);

                var insertedMonthlyPerformance =
                    AddOrUpdateMonthlyPerformance((List<MonthlyPerformance>) monthlyPerformance);
                var insertStatus = (bool) insertedMonthlyPerformance.GetType().GetProperty("isSuccessful")
                    ?.GetValue(insertedMonthlyPerformance, null);

                if (insertStatus)
                {
                    return Shared.WebApi.Wrap(true, monthlyPerformance, HttpStatusCode.OK);
                }

                return Shared.WebApi.Wrap(false);
            }
            catch (Exception e)
            {
                return Shared.WebApi.Wrap(false);
            }
        }

        public object GetMonthlyPerformanceStatus()
        {
            SqlHelper sqlHelper = new SqlHelper(ConnectionString);

            var query = $@"SELECT TOP (1) [id] 
                        FROM [monthly_performance]";

            var hasMonthlyPerformance = sqlHelper.GetScalarValue(query, CommandType.Text);

            var status = hasMonthlyPerformance != null;

            return Shared.WebApi.Wrap(true, status, HttpStatusCode.OK);
        }

        private bool ClearMonthlyPerformance()
        {
            SqlHelper sqlHelper = new SqlHelper(ConnectionString);

            try
            {
                sqlHelper.VerifyConnection();

                var monthlyPerformanceQuery = $@"DELETE FROM [monthly_performance_history];
                                                DELETE FROM [monthly_performance]";

                sqlHelper.Delete(monthlyPerformanceQuery, CommandType.Text);

                sqlHelper.CloseConnection();

                return true;
            }
            catch (Exception ex)
            {
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");

                return false;
            }
        }

        private void InitializeQuarterDictionary(Dictionary<int, int> quarterCount)
        {
            quarterCount.Add(1, 0);
            quarterCount.Add(4, 0);
            quarterCount.Add(7, 0);
            quarterCount.Add(10, 0);
        }

        public decimal CalculateYTDPerformance(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var currentPerformance = current.Performance.HasValue ? current.Performance.Value : 0;
            var priorYTDNetPerformance = prior.YTDNetPerformance;

            return currentPerformance + priorYTDNetPerformance;
        }

        public decimal CalculateQTD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorQTD = prior.QTD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;

            // return (convertedPriorQTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorQTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateYTD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorYTD = prior.YTD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;

            // return (convertedPriorYTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateITD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorYTD = prior.ITD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;

            // return (convertedPriorYTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }

        public object GetMonthlyPerformanceAudit(int id)
        {
            var query =
                $@"select id as Id, performance_id as PerformanceId, estimated as Estimated, start_month_estimate_nav as StartOfMonthEstimateNav, performance_date as PerformanceDate ,fund as Fund,portfolio as PortFolio,monthly_end_nav as MonthEndNav,performance as Performance ,mtd as MTD,ytd_net_performance as YTDNetPerformance,qtd_net_perc as QTD,ytd_net_perc as YTD,itd_net_perc as ITD from monthly_performance_history where performance_id = @id";
            List<SqlParameter> auditTrailParams = new List<SqlParameter>()
            {
                new SqlParameter("id", id)
            };

            var dataTable = new SqlHelper(ConnectionString).GetDataTable(query, CommandType.Text, auditTrailParams.ToArray());
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            return Shared.WebApi.Wrap(true, json);
        }

        public object GetDailyUnofficialPnl(DateTime? from, DateTime? to)
        {
            try
            {
                bool whereAdded = false;
                List<SqlParameter> sqlParams = new List<SqlParameter>();
                var query = $@"SELECT [id] as Id
                          ,[created_by] as CreatedBy
                          ,[created_date] as CreatedDate
                          ,[last_updated_by] as LastUpdatedBy
                          ,[last_updated_date] as LastUpdatedDate
                          ,[business_date] as BusinessDate
                          ,[portfolio] as PortFolio
                          ,[fund] as Fund
                          ,[trade_pnl] as TradePnL
                          ,[day] as Day
                          ,[daily_percentage_return] as DailyPercentageReturn
                          ,[long_pnl] as LongPnL
                          ,[long_percentage_change] as LongPercentageChange
                          ,[short_pnl] as ShortPnL
                          ,[short_percentage_change] as ShortPercentageChange
                          ,[long_exposure] as LongExposure
                          ,[short_exposure] as ShortExposure
                          ,[gross_exposure] as GrossExposure
                          ,[net_exposure] as NetExposure
                          ,[six_md_beta_net_exposure] as SixMdBetaNetExposure
                          ,[two_yw_beta_net_exposure] as TwoYwBetaNetExposure
                          ,[six_md_beta_short_exposure] as SixMdBetaShortExposure
                          ,[nav_market] as NavMarket
                          ,[dividend_usd] as DividendUSD
                          ,[comm_usd] as CommUSD
                          ,[fee_taxes_usd] as FeeTaxesUSD
                          ,[financing_usd] as FinancingUSD
                          ,[other_usd] as OtherUSD
                          ,[pnl_percentage] as PnLPercentage
                          ,[mtd_percentage_return] as MTDPercentageReturn
                          ,[qtd_percentage_return] as QTDPercentageReturn
                          ,[ytd_percentage_return] as YTDPercentageReturn
                          ,[itd_percentage_return] as ITDPercentageReturn
                          ,[mtd_pnl] as MTDPnL
                          ,[qtd_pnl] as QTDPnL
                          ,[ytd_pnl] as YTDPnL
                          ,[itd_pnl] as ITDPnL
                      FROM [dbo].[unofficial_daily_pnl]";

                if (from.HasValue)
                {
                    query = query + " where [business_date] >= @from";
                    whereAdded = true;
                    sqlParams.Add(new SqlParameter("from", from));
                }

                if (to.HasValue)
                {
                    if (whereAdded)
                    {
                        query = query + " and [business_date] <= @to";
                        sqlParams.Add(new SqlParameter("to", to));
                    }
                    else
                    {
                        query = query + " where [business_date] <= @to";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("to", to));
                    }
                }

                query += " ORDER BY business_date ASC, id ASC";

                var dataTable = new SqlHelper(ConnectionString).GetDataTable(query, CommandType.Text, sqlParams.ToArray());

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var json = JsonConvert.DeserializeObject<List<DailyPnL>>(jsonResult);

                return Shared.WebApi.Wrap(true, json, HttpStatusCode.OK, "Daily Unofficial Pnl fetched successfully");
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public Tuple<bool,List<DailyPnL>> GetLatestDailyPnlPerPortfolio()
        {
            try
            {
                var query = $@"select [id] as Id
                          ,[created_by] as CreatedBy
                          ,[created_date] as CreatedDate
                          ,[last_updated_by] as LastUpdatedBy
                          ,[last_updated_date] as LastUpdatedDate
                          ,[business_date] as BusinessDate
                          ,[portfolio] as PortFolio
                          ,[fund] as Fund
                          ,[trade_pnl] as TradePnL
                          ,[day] as Day
                          ,[daily_percentage_return] as DailyPercentageReturn
                          ,[long_pnl] as LongPnL
                          ,[long_percentage_change] as LongPercentageChange
                          ,[short_pnl] as ShortPnL
                          ,[short_percentage_change] as ShortPercentageChange
                          ,[long_exposure] as LongExposure
                          ,[short_exposure] as ShortExposure
                          ,[gross_exposure] as GrossExposure
                          ,[net_exposure] as NetExposure
                          ,[six_md_beta_net_exposure] as SixMdBetaNetExposure
                          ,[two_yw_beta_net_exposure] as TwoYwBetaNetExposure
                          ,[six_md_beta_short_exposure] as SixMdBetaShortExposure
                          ,[nav_market] as NavMarket
                          ,[dividend_usd] as DividendUSD
                          ,[comm_usd] as CommUSD
                          ,[fee_taxes_usd] as FeeTaxesUSD
                          ,[financing_usd] as FinancingUSD
                          ,[other_usd] as OtherUSD
                          ,[pnl_percentage] as PnLPercentage
                          ,[mtd_percentage_return] as MTDPercentageReturn
                          ,[qtd_percentage_return] as QTDPercentageReturn
                          ,[ytd_percentage_return] as YTDPercentageReturn
                          ,[itd_percentage_return] as ITDPercentageReturn
                          ,[mtd_pnl] as MTDPnL
                          ,[qtd_pnl] as QTDPnL
                          ,[ytd_pnl] as YTDPnL
                          ,[itd_pnl] as ITDPnL from (SELECT u.* ,row_number() over (partition by u.portfolio order by u.business_date desc,u.id desc)
                            as rn from unofficial_daily_pnl u) a
	                        where a.rn = 1";



                var dataTable = new SqlHelper(ConnectionString).GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                var dailyPnlList = JsonConvert.DeserializeObject<List<DailyPnL>>(jsonResult);

                foreach(var item in dailyPnlList)
                {
                    item.ExistingRecord = true;
                }

                return new Tuple<bool, List<DailyPnL>>(true, dailyPnlList);
            }
            catch (Exception ex)
            {
                return new Tuple<bool, List<DailyPnL>>(false, null);
            }
        }

        public object CalculateDailyUnofficialPnl(List<DailyPnL> obj)
        {
            return new DailyPnlCalculator().CalculateDailyPerformance(obj);
        }

        public async Task<object> UploadDailyUnofficialPnl(HttpRequestMessage requestMessage)
        {
            try
            {
                var uploadedResult = await Utils.SaveFileToServerAsync(requestMessage, "PerformanceData");
                if (!uploadedResult.Item1)
                    return Shared.WebApi.Wrap(false);

                var dailyPnlPath = uploadedResult.Item2;
                var dailyPnlFileName = uploadedResult.Item3;
                var recordBody = new FileProcessor().ImportFile(dailyPnlPath, "DailyPnl", "ImportFormats", ',');

                var records = JsonConvert.SerializeObject(recordBody.Item1);
                var performanceRecords = JsonConvert.DeserializeObject<List<DailyPnL>>(records);

                var failedRecords = new Dictionary<object, Row>();
                var key = 0;
                foreach (var item in recordBody.Item2)
                {
                    failedRecords.Add(key++, item);
                }

                var failedPerformanceList =
                    new FileManager(ConnectionString).MapFailedRecords(failedRecords, DateTime.Now, uploadedResult.Item3);

                List<FileInputDto> fileList = new List<FileInputDto>
                {
                    new FileInputDto(dailyPnlPath, dailyPnlFileName, performanceRecords.Count, "DailyUnofficialPnl",
                        "Upload",
                        failedPerformanceList,
                        DateTime.Now)
                };

                new FileManager(ConnectionString).InsertActivityAndPositionFiles(fileList);
                var previousData = GetLatestDailyPnlPerPortfolio();
                var previousList = previousData.Item2;
                if (previousData.Item1)
                {
                    performanceRecords = performanceRecords.Concat(previousList).ToList();
                }
                var dailyPerformanceResult = new DailyPnlCalculator().CalculateDailyPerformance(performanceRecords);
                var dailyPerformance = dailyPerformanceResult.GetType().GetProperty("payload")
                    ?.GetValue(dailyPerformanceResult, null);
                bool insertDailyPnl = InsertDailyPnl((List<DailyPnL>) dailyPerformance);
                if (insertDailyPnl)
                {
                    return Shared.WebApi.Wrap(true, dailyPerformance, null);
                }
                else
                {
                    return Shared.WebApi.Wrap(false);
                }
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false);
            }
        }

        private bool InsertDailyPnl(List<DailyPnL> obj)
        {
            List<DailyPnL> recordsToBeInserted = obj.Where(x => !x.ExistingRecord).ToList();
            SqlHelper sqlHelper = new SqlHelper(ConnectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                //var monthlyPerformanceQuery = $@"DELETE FROM [unofficial_daily_pnl];";

                //sqlHelper.Delete(monthlyPerformanceQuery, CommandType.Text);

                new SQLBulkHelper().Insert("unofficial_daily_pnl", recordsToBeInserted.ToArray(), sqlHelper.GetConnection(),
                    sqlHelper.GetTransaction());

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
                return true;
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                return false;
            }
        }

        public object GetDailyUnofficialPnlStatus()
        {
            SqlHelper sqlHelper = new SqlHelper(ConnectionString);

            var query = $@"SELECT TOP (1) [id] 
                        FROM [unofficial_daily_pnl]";

            var hasDailyPnl = sqlHelper.GetScalarValue(query, CommandType.Text);

            var status = hasDailyPnl != null;

            return Shared.WebApi.Wrap(true, status, HttpStatusCode.OK);
        }

        public object GetDailyUnofficialPnlAudit(int id)
        {
            try
            {
                var query = $@"SELECT id AS Id,
                            unofficial_daily_pnl_id as UnofficialDailyPnlId,
                           created_date as Created_Date,
                            last_updated_date as LastUpdatedDate,
                            created_by as CreatedBy
                            last_updated_by as LastUpdatedBy
                            business_date as BusinessDate,
                            portfolio as PortFolio,
                            fund as Fund,
                            trading_mtd_pnl as TradingMtdPnl,
                            calc_trading_mtd_pnl as CalcTradingMtdPnl,
                            trading_ytd_pnl as TradingYtdPnl,
                            mtd_final_pnl as MtdFinalPnl,
                            ytd_final_pnl as YtdFinalPnl,
                            mtd_ipo_pnl as MtdIpoPnl,
                            ytd_ipo_pnl as YtdIpoPnl,
                            mtd_total_pnl as MtdTotalPnl,
                            calc_mtd_total as CalcMtdTotal,
                            ytd_total_pnl as YtdTotalPnl
                            from unofficial_daily_pnl_audit
                            where unofficial_daily_pnl_id = @id";

                List<SqlParameter> auditTrailParams = new List<SqlParameter>()
                {
                    new SqlParameter("id", id)
                };

                var dataTable = new SqlHelper(ConnectionString).GetDataTable(query, CommandType.Text, auditTrailParams.ToArray());
                var jsonResult = JsonConvert.SerializeObject(dataTable);
                dynamic json = JsonConvert.DeserializeObject(jsonResult);

                return Shared.WebApi.Wrap(true, json, HttpStatusCode.OK,
                    "Daily Unofficial Pnl Audit Trail fetched successfully");
            }
            catch (Exception ex)
            {
                return Shared.WebApi.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching Daily Unofficial Pnl Audit Trail");
            }
        }
    }
}