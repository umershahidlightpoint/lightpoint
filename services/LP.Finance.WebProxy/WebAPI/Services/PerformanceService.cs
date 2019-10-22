﻿using LP.FileProcessing;
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
using System.Net.Http;
using System.Threading.Tasks;
using static System.String;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class PerformanceService : IPerformanceService
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);
        private readonly FileProcessor fileProcessor = new FileProcessor();
        private readonly FileManagementService fileManagementService = new FileManagementService();

        public object GetMonthlyPerformance(DateTime? date = null, string fund = null, string portfolio = null)
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


            if (date.HasValue)
            {
                sqlParams.Add(new SqlParameter("date", date.Value.Date.ToString("yyyy-MM-dd")));
                query += " WHERE performance_date = @date";
            }

            if (!IsNullOrWhiteSpace(fund))
            {
                sqlParams.Add(new SqlParameter("fund", fund));
                query += date.HasValue ? " AND fund = @fund" : " WHERE fund = @fund";
            }

            if (!IsNullOrWhiteSpace(portfolio))
            {
                sqlParams.Add(new SqlParameter("portfolio", portfolio));
                query += date.HasValue || !IsNullOrWhiteSpace(fund)
                    ? " AND portfolio = @portfolio"
                    : " WHERE portfolio = @portfolio";
            }

            query += " ORDER BY performance_date ASC, id ASC";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

            var jsonResult = JsonConvert.SerializeObject(dataTable);

            dynamic json = JsonConvert.DeserializeObject(jsonResult);

            return Utils.GridWrap(json);
        }

        public object CalculateMonthlyPerformance(List<MonthlyPerformance> obj)
        {
            try
            {
                var sorted = obj.OrderBy(x => x.PerformanceDate).ThenBy(x => x.RowId).ToList();
                var initialPerformance = sorted.FirstOrDefault();

                var groupedByYear = sorted.GroupBy(x => x.PerformanceDate.Year).ToList();

                //Get prior date as reference point.
                //var priorPerformanceDate = initialPerformance.PerformanceDate.AddMonths(-1);

                //var query = $@"select id,performance_date,fund,portfolio,monthly_end_nav,performance_date,mtd,ytd_net_performance,qtd_net_perc,ytd_net_perc,itd_net_perc from monthly_performance where performance_date = @entryDate";
                //List<SqlParameter> priorPerformanceParams = new List<SqlParameter>()
                //    {
                //       new SqlParameter("entryDate", priorPerformanceDate)
                //    };
                //var priorPerformanceData = sqlHelper.GetDataTable(query, CommandType.Text, priorPerformanceParams.ToArray());

                //var priorData = priorPerformanceData.AsEnumerable().Select(x => new MonthlyPerformance
                //{
                //    Id = Convert.ToInt32(x["id"]),
                //    PerformanceDate = Convert.ToDateTime(x["performance_date"]),
                //    MonthEndNav = Convert.ToDecimal(x["monthly_end_nav"]),
                //    YTDNetPerformance = Convert.ToDecimal(x["ytd_net_performance"]),
                //    Performance = Convert.ToDecimal(x["performance"]),
                //    ITD = Convert.ToDecimal(x["itd_net_perc"]),
                //    QTD = Convert.ToDecimal(x["qtd_net_perc"]),
                //    YTD = Convert.ToDecimal(x["ytd_net_perc"]),
                //    MTD = Convert.ToDecimal(x["mtd"])
                //}).FirstOrDefault();

                MonthlyPerformance priorData = null;
                MonthlyPerformance priorDataForInception = priorData;
                decimal newDecimalValue = 0;
                string newStringValue;

                foreach (var group in groupedByYear)
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
                                if (item.PerformanceDate.Month == 1 || item.PerformanceDate.Month == 4 ||
                                    item.PerformanceDate.Month == 7 || item.PerformanceDate.Month == 10)
                                {
                                    //Beginning of quarter, hence value will be the same as MTD.
                                    newDecimalValue = item.MTD.HasValue ? item.MTD.Value : 0;
                                    if (CheckForChanges(item.QTD, newDecimalValue))
                                    {
                                        item.Modified = true;
                                    }

                                    item.QTD = newDecimalValue;
                                }
                                else
                                {
                                    //For QTD, determine the month offset of this quarter. If it is the beginning of the quarter for e.g (April for Q2), value will remain the same. Otherwise, calculated value will depend on the previous result.
                                    newDecimalValue = CalculateQTD(item, priorData);
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
                    }

                    priorData = null;
                }

                return Utils.Wrap(true, groupedByYear.SelectMany(x => x.Select(y => y).ToList()), null, "Performance calculated successfully");
            }
            catch
            {
                return Utils.Wrap(false, "An error occured during calculation");
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
                return Utils.Wrap(true, "Calculations saved successfully");
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                return Utils.Wrap(false, "An error occured while saving calculations");
            }
        }

        public async Task<object> UploadMonthlyPerformance(HttpRequestMessage requestMessage)
        {
            if (!requestMessage.Content.IsMimeMultipartContent())
                return Utils.Wrap(false);

            var provider = new MultipartMemoryStreamProvider();
            await requestMessage.Content.ReadAsMultipartAsync(provider);

            var currentDir = AppDomain.CurrentDomain.BaseDirectory;
            Directory.CreateDirectory(currentDir + Path.DirectorySeparatorChar + "PerformanceData");

            var performancePath = "";
            var performanceFileName = "";
            foreach (var file in provider.Contents)
            {
                performanceFileName = file.Headers.ContentDisposition.FileName.Trim('\"');
                var buffer = await file.ReadAsByteArrayAsync();

                performancePath = currentDir + "PerformanceData" + Path.DirectorySeparatorChar +
                                  $"{DateTime.Now:yy-MM-dd-hh-mm-ss}-{performanceFileName}";

                System.IO.File.WriteAllBytes(performancePath, buffer);
            }

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

            return Utils.Wrap(true, monthlyPerformance, null);
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
            return (convertedPriorQTD * convertedCurrentMTD) - 1;
        }

        public decimal CalculateYTD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorYTD = prior.YTD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;
            return (convertedPriorYTD * convertedCurrentMTD) - 1;
        }

        public decimal CalculateITD(MonthlyPerformance current, MonthlyPerformance prior)
        {
            var convertedPriorYTD = prior.ITD + 1;
            var convertedCurrentMTD = current.MTD.HasValue ? current.MTD.Value + 1 : 1;
            return (convertedPriorYTD * convertedCurrentMTD) - 1;
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
            return Utils.GridWrap(json);
        }
    }
}