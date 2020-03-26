using LP.Finance.Common;
using LP.Shared.Model;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class LogService : ILogService
    {
        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public object GetLogFiles()
        {
            var sw = new Stopwatch();
            sw.Start();
            try
            {
                Logger.Info($"started GetLogFiles at {DateTime.UtcNow}");
                //var logFolder = ConfigurationManager.AppSettings["logLocation"];
                var schema = Shared.WebApi.GetFile<List<Logs>>("log_config", "MockData");
                var files = new List<LogInfo>();
                foreach (var item in schema) 
                {
                    var logFolder = item.LogLocation;
                    if (String.IsNullOrEmpty(logFolder))
                        logFolder = System.AppDomain.CurrentDomain.BaseDirectory;

                    if (Directory.Exists(logFolder))
                    {
                        var fileList = Directory.GetFiles(logFolder).ToList();
                        var fileNames = fileList.Select(x => new LogInfo
                        {
                            Project = item.LogName,
                            FileName = System.IO.Path.GetFileName(x)
                        }).OrderByDescending(x => x.FileName).Take(30).ToList();

                        files.AddRange(fileNames);
                    }
                }
                sw.Stop();
                Logger.Info(
                    $"finished GetLogFiles at {DateTime.UtcNow} in {sw.ElapsedMilliseconds} ms | {sw.ElapsedMilliseconds / 1000} s");

                if(files.Count > 0)
                {
                    return Shared.WebApi.Wrap(true, files, HttpStatusCode.OK);
                }
                else
                {
                    return Shared.WebApi.Wrap(false, null);
                }
            }
            catch (Exception ex)
            {
                sw.Stop();
                Logger.Error(ex,
                    $"GetLogFiles failed at {DateTime.UtcNow} in {sw.ElapsedMilliseconds} ms | {sw.ElapsedMilliseconds / 1000} s");
                throw ex;
            }
        }

        public object ViewLog(string fileName, string project, int numberOfLines)
        {
            try
            {
                var schema = Shared.WebApi.GetFile<List<Logs>>("log_config", "MockData");
                var logFolder = schema.Where(x => x.LogName == project).Select(x => x.LogLocation).FirstOrDefault();
                if (string.IsNullOrEmpty(logFolder))
                    logFolder = AppDomain.CurrentDomain.BaseDirectory;

                logFolder = logFolder + Path.DirectorySeparatorChar + fileName;
                var lines = File.ReadLines(logFolder).ToArray();
                return Shared.WebApi.Wrap(true, lines.Skip(lines.Length - numberOfLines), HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object DownloadLog(string fileName, string project)
        {
            var schema = Shared.WebApi.GetFile<List<Logs>>("log_config", "MockData");
            var logFolder = schema.Where(x => x.LogName == project).Select(x => x.LogLocation).FirstOrDefault();

            if (string.IsNullOrEmpty(logFolder))
                logFolder = AppDomain.CurrentDomain.BaseDirectory;

            logFolder = logFolder + Path.DirectorySeparatorChar + fileName;

            var dataBytes = File.ReadAllBytes(logFolder);
            var dataStream = new MemoryStream(dataBytes);

            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StreamContent(dataStream)
            };

            return response;
        }
    }
}