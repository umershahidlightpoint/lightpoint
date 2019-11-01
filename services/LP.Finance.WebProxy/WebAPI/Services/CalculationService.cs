using LP.FileProcessing;
using LP.FileProcessing.MetaData;
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
using System.Data.SqlTypes;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using static System.String;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class CalculationService : ICalculationService
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);
        private readonly FileProcessor fileProcessor = new FileProcessor();
        private readonly FileManagementService fileManagementService = new FileManagementService();

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

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

            var jsonResult = JsonConvert.SerializeObject(dataTable);

            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            return Utils.Wrap(true, json);
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

                //var groupedByYear = sorted.GroupBy(x => x.PerformanceDate.Year).ToList();
                
              

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
                                    if (CheckForBeginningOfQuarter(item.PerformanceDate) && quarterCount[item.PerformanceDate.Month] == 0)
                                    {
                                        //Beginning of quarter, hence value will be the same as MTD.
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
                                        //For QTD, determine the month offset of this quarter. If it is the beginning of the quarter for e.g (April for Q2), value will remain the same. Otherwise, calculated value will depend on the previous result.
                                        newDecimalValue = CalculateQTD(item, priorData);
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
                                    //For ITD, value will always be calculated based on the previous result.
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
                                    //For YTD, determine the month offset of this year. If it is the beginning of the year for e.g. (January), value will remain the same. Otherwise, calculated value will depend on the previous result.
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

                //return Utils.Wrap(true, groupedByYear.SelectMany(x => x.Select(y => y).ToList()), HttpStatusCode.OK, "Performance calculated successfully");
                return Utils.Wrap(true, sorted, HttpStatusCode.OK, "Performance calculated successfully");
            }
            catch
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
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

        private void InitializeQuarterDictionary(Dictionary<int, int> quarterCount)
        {
            quarterCount.Add(1, 0);
            quarterCount.Add(4, 0);
            quarterCount.Add(7, 0);
            quarterCount.Add(10, 0);
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

            SqlHelper sqlHelper = new SqlHelper(connectionString);
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
                return Utils.Wrap(true, null, HttpStatusCode.OK, "Calculations saved successfully");
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while saving calculations");
            }
        }

        private bool InsertDailyPnl(List<DailyPnL> obj)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                new SQLBulkHelper().Insert("unofficial_daily_pnl", obj.ToArray(), sqlHelper.GetConnection(),
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

        public async Task<object> UploadMonthlyPerformance(HttpRequestMessage requestMessage)
        {
            var uploadedResult = await Utils.SaveFileToServerAsync(requestMessage, "PerformanceData");
            if (!uploadedResult.Item1)
                return Utils.Wrap(false);

            var performancePath = uploadedResult.Item2;
            var performanceFileName = uploadedResult.Item3;

            var recordBody = fileProcessor.ImportFile(performancePath, "Performance", "PerformanceFormats", ',');

            var records = JsonConvert.SerializeObject(recordBody.Item1);
            var performanceRecords = JsonConvert.DeserializeObject<List<MonthlyPerformance>>(records);

            var failedRecords = new Dictionary<object, Row>();
            var key = 0;
            foreach (var item in recordBody.Item2)
            {
                failedRecords.Add(key++, item);
            }

            var failedPerformanceList =
                fileManagementService.MapFailedRecords(failedRecords, DateTime.Now, performanceFileName);

            List<FileInputDto> fileList = new List<FileInputDto>
            {
                new FileInputDto(performancePath, performanceFileName, performanceRecords.Count, "MonthlyPerformance",
                    "Upload",
                    failedPerformanceList,
                    DateTime.Now)
            };

            fileManagementService.InsertActivityAndPositionFilesForSilver(fileList);
            var monthlyPerformanceResult = CalculateMonthlyPerformance(performanceRecords);
            var monthlyPerformance = monthlyPerformanceResult.GetType().GetProperty("payload")
                ?.GetValue(monthlyPerformanceResult, null);

            return Utils.Wrap(true, monthlyPerformance, HttpStatusCode.OK);
        }

        public decimal CalculateYTDPerformance(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var currentPerformance = current.Performance.HasValue ? current.Performance.Value : 0;
            var priorYTDNetPerformance = prior.YTDNetPerformance;
            return currentPerformance + priorYTDNetPerformance;
        }
        public decimal CalculateDailyPnl(decimal? current, decimal? prior)
        {
            var currentMeasure = current.HasValue ? current.Value : 0;
            var priorMeasure = prior.HasValue ? prior.Value : 0;
            return currentMeasure + priorMeasure;
        }

        public decimal CalculateQTD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorQTD = prior.QTD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;
            //return (convertedPriorQTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorQTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateDailyQTD(DailyPnL current, DailyPnL prior)
        {
            var convertedPriorQTD = prior.QTDPercentageReturn.Value + 1;
            var convertedCurrentMTD = current.MTDPercentageReturn.HasValue ? current.MTDPercentageReturn.Value + 1 : 1;
            //return (convertedPriorQTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorQTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateYTD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorYTD = prior.YTD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;
            //return (convertedPriorYTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateDailyYTD(DailyPnL current, DailyPnL prior)
        {
            var convertedPriorYTD = prior.YTDPercentageReturn.Value + 1;
            var convertedCurrentMTD = current.MTDPercentageReturn.HasValue ? current.MTDPercentageReturn.Value + 1 : 1;
            //return (convertedPriorYTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateITD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorYTD = prior.ITD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;
            //return (convertedPriorYTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateDailyITD(DailyPnL current, DailyPnL prior)
        {
            var convertedPriorYTD = prior.ITDPercentageReturn.Value + 1;
            var convertedCurrentMTD = current.MTDPercentageReturn.HasValue ? current.MTDPercentageReturn.Value + 1 : 1;
            //return (convertedPriorYTD * convertedCurrentMTD) - 1;
            return Math.Round((convertedPriorYTD * convertedCurrentMTD) - 1, 16);
        }

        public decimal CalculateDailyMTD(DailyPnL current, DailyPnL prior)
        {
            var convertedPriorDaily = prior.MTDPercentageReturn.Value + 1;
            var convertedCurrentDaily = current.DailyPercentageReturn.HasValue ? current.DailyPercentageReturn.Value + 1 : 1;
            return Math.Round((convertedPriorDaily * convertedCurrentDaily) - 1, 16);
        }

        public object GetMonthlyPerformanceAudit(int id)
        {
            var query =
                $@"select id as Id, performance_id as PerformanceId, estimated as Estimated, start_month_estimate_nav as StartOfMonthEstimateNav, performance_date as PerformanceDate ,fund as Fund,portfolio as PortFolio,monthly_end_nav as MonthEndNav,performance as Performance ,mtd as MTD,ytd_net_performance as YTDNetPerformance,qtd_net_perc as QTD,ytd_net_perc as YTD,itd_net_perc as ITD from monthly_performance_history where performance_id = @id";
            List<SqlParameter> auditTrailParams = new List<SqlParameter>()
            {
                new SqlParameter("id", id)
            };
            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, auditTrailParams.ToArray());
            var jsonResult = JsonConvert.SerializeObject(dataTable);
            dynamic json = JsonConvert.DeserializeObject(jsonResult);
            return Utils.Wrap(true, json);
        }

        public object GetDailyUnofficialPnl()
        {
            var query = $@"SELECT id AS Id,
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
                            ytd_total_pnl as YtdTotalPnl";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);

            var jsonResult = JsonConvert.SerializeObject(dataTable);

            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            return Utils.Wrap(true, json);
        }

        public object GetDailyUnofficialPnlAudit()
        {
            try
            {
                var query = $@"SELECT id AS Id,
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
                            from unofficial_daily_pnl";

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);

                var jsonResult = JsonConvert.SerializeObject(dataTable);

                dynamic json = JsonConvert.DeserializeObject(jsonResult);

                return Utils.Wrap(true, json, HttpStatusCode.OK, "Daily Unofficial Pnl fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching Daily Unofficial Pnl");
            }
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
                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, auditTrailParams.ToArray());
                var jsonResult = JsonConvert.SerializeObject(dataTable);
                dynamic json = JsonConvert.DeserializeObject(jsonResult);
                return Utils.Wrap(true, json, HttpStatusCode.OK,
                    "Daily Unofficial Pnl Audit Trail fetched successfully");
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError,
                    "An error occured while fetching Daily Unofficial Pnl Audit Trail");
            }
        }

        public async Task<object> UploadDailyUnofficialPnl(HttpRequestMessage requestMessage)
        {
            try
            {
                var uploadedResult = await Utils.SaveFileToServerAsync(requestMessage, "PerformanceData");
                if (!uploadedResult.Item1)
                    return Utils.Wrap(false);

                var dailyPnlPath = uploadedResult.Item2;
                var dailyPnlFileName = uploadedResult.Item3;
                var recordBody = fileProcessor.ImportFile(dailyPnlPath, "DailyPnl", "PerformanceFormats", ',');

                var records = JsonConvert.SerializeObject(recordBody.Item1);
                var performanceRecords = JsonConvert.DeserializeObject<List<DailyPnL>>(records);

                var failedRecords = new Dictionary<object, Row>();
                var key = 0;
                foreach (var item in recordBody.Item2)
                {
                    failedRecords.Add(key++, item);
                }

                var failedPerformanceList =
                    fileManagementService.MapFailedRecords(failedRecords, DateTime.Now, uploadedResult.Item3);

                List<FileInputDto> fileList = new List<FileInputDto>
            {
                new FileInputDto(dailyPnlPath, dailyPnlFileName, performanceRecords.Count, "DailyUnofficialPnl",
                    "Upload",
                    failedPerformanceList,
                    DateTime.Now)
            };

                fileManagementService.InsertActivityAndPositionFilesForSilver(fileList);
                var dailyPerformanceResult = CalculateDailyPerformance(performanceRecords);
                var dailyPerformance = dailyPerformanceResult.GetType().GetProperty("payload")
                    ?.GetValue(dailyPerformanceResult, null);
                bool insertDailyPnl = InsertDailyPnl((List<DailyPnL>)dailyPerformance);
                if (insertDailyPnl)
                {
                    return Utils.Wrap(true, dailyPerformance, null);
                }
                else
                {
                    return Utils.Wrap(false);
                }
            }
            catch(Exception ex)
            {
                return Utils.Wrap(false);

            }
        }

        public object CalculateDailyPerformance(List<DailyPnL> performanceRecords)
        {
            var sorted = performanceRecords.OrderBy(x => x.BusinessDate).ThenBy(x => x.RowId).ToList();

            var groupedByPortfolio = sorted.GroupBy(x => x.PortFolio).Select(x => new
            {
                Portfolio = x.Key,
                YearlyData = x.ToList().GroupBy(y => y.BusinessDate.Year).Select(z=> new
                {
                    Year = z.Key,
                    MonthlyData = z.ToList().GroupBy(w=> w.BusinessDate.Month)
                })
            }).ToList();

            //var groupedByYear = sorted.GroupBy(x => x.PerformanceDate.Year).ToList();

            DailyPnL priorData = null;
            int monthIndex = 0;
            int totalMonthlyRecords = 0;
            DailyPnL priorDataYearlyPnl = priorData;
            DailyPnL priorDataQuarterlyPnl = priorData;
            DailyPnL priorDataInceptionPnl = priorData;

            DailyPnL priorDataForQuarter = priorData;
            DailyPnL priorDataForYear = priorData;
            DailyPnL priorDataForInception = priorData;

            decimal newDecimalValue = 0;
            Dictionary<int, int> quarterCount = new Dictionary<int, int>();
            InitializeQuarterDictionary(quarterCount);

            foreach(var portfolio in groupedByPortfolio)
            {
                foreach(var year in portfolio.YearlyData)
                {
                    foreach(var month in year.MonthlyData)
                    {
                        totalMonthlyRecords = month.Count() - 1;
                        monthIndex = 0;
                        foreach(var item in month)
                        {
                            if(priorData != null)
                            {
                                item.MTDPercentageReturn = CalculateDailyMTD(item, priorData);
                                item.MTDPnL = CalculateDailyPnl(item.Day, priorData.Day);
                            }
                            else
                            {
                                item.MTDPercentageReturn = item.DailyPercentageReturn;
                                item.MTDPnL = item.Day;
                            }

                            if (priorDataForYear != null)
                            {
                                item.YTDPercentageReturn = CalculateDailyYTD(item, priorDataForYear);
                            }
                            else
                            {
                                item.YTDPercentageReturn = item.MTDPercentageReturn;
                            }

                            if (priorDataForInception != null)
                            {
                                item.ITDPercentageReturn = CalculateDailyITD(item, priorDataForInception);
                            }
                            else
                            {
                                item.ITDPercentageReturn = item.MTDPercentageReturn;
                            }

                            if (priorDataForQuarter != null)
                            {
                                if(CheckForBeginningOfQuarter(item.BusinessDate))
                                {
                                    item.QTDPercentageReturn = item.MTDPercentageReturn;
                                }
                                else
                                {
                                    item.QTDPercentageReturn = CalculateDailyQTD(item, priorDataForQuarter);
                                }
                            }
                            else
                            {
                                item.QTDPercentageReturn = item.MTDPercentageReturn;
                            }


                            //Calculations for QTD,YTD,ITD values.

                            if(priorDataQuarterlyPnl != null)
                            {
                                if (CheckForBeginningOfQuarter(item.BusinessDate))
                                {
                                    item.QTDPnL = item.MTDPnL;
                                }
                                else
                                {
                                    item.QTDPnL = CalculateDailyPnl(item.Day, priorDataQuarterlyPnl.QTDPnL);
                                }
                            }
                            else
                            {
                                item.QTDPnL = item.MTDPnL;
                            }

                            if(priorDataYearlyPnl != null)
                            {
                                item.YTDPnL = CalculateDailyPnl(item.Day, priorDataYearlyPnl.YTDPnL);
                            }
                            else
                            {
                                item.YTDPnL = item.MTDPnL;
                            }

                            if(priorDataInceptionPnl != null)
                            {
                                item.ITDPnL = CalculateDailyPnl(item.Day, priorDataInceptionPnl.ITDPnL);
                            }
                            else
                            {
                                item.ITDPnL = item.MTDPnL;
                            }

                            priorData = item;
                            priorDataQuarterlyPnl = item;
                            priorDataYearlyPnl = item;
                            priorDataInceptionPnl = item;
                            //We have reached the end of the month. At this point, the calculated value of MTD represents MTD returns for that month. 
                            //We will use this value of MTD as reference for QTD,YTD,ITD percentage/returns calculation.
                            if(monthIndex == totalMonthlyRecords)
                            {
                                priorDataForYear = item;
                                priorDataForQuarter = item;
                                priorDataForInception = item;
                            }
                         
                            monthIndex++;
                        }

                        priorData = null;
                    }

                    priorDataForYear = null;
                    priorDataYearlyPnl = null;
                    priorDataQuarterlyPnl = null;
                    priorDataForQuarter = null;
                }

                priorDataForInception = null;
                priorDataForQuarter = null;
                priorDataInceptionPnl = null;
                priorDataQuarterlyPnl = null;
            }

            return Utils.Wrap(true, sorted, HttpStatusCode.OK, "Performance calculated successfully");
        }
    }
}