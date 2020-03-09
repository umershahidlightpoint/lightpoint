using LP.Finance.Common;
using System;
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
                var logFolder = ConfigurationManager.AppSettings["logLocation"];
                if (String.IsNullOrEmpty(logFolder))
                    logFolder = System.AppDomain.CurrentDomain.BaseDirectory;

                if (Directory.Exists(logFolder))
                {
                    var fileList = Directory.GetFiles(logFolder).ToList();
                    var fileNames = fileList.Select(x => new
                    {
                        FileName = System.IO.Path.GetFileName(x)
                    }).OrderByDescending(x => x.FileName).Take(30).ToList();

                    sw.Stop();
                    Logger.Info(
                        $"finished GetLogFiles at {DateTime.UtcNow} in {sw.ElapsedMilliseconds} ms | {sw.ElapsedMilliseconds / 1000} s");
                    return Utils.Wrap(true, fileNames, HttpStatusCode.OK);
                }
                else
                {
                    return Utils.Wrap(false, null);
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

        public object ViewLog(string fileName, int numberOfLines)
        {
            var logFolder = ConfigurationManager.AppSettings["logLocation"];

            if (string.IsNullOrEmpty(logFolder))
                logFolder = AppDomain.CurrentDomain.BaseDirectory;

            logFolder = logFolder + Path.DirectorySeparatorChar + fileName;

            var lines = File.ReadLines(logFolder).ToArray();

            return lines.Skip(lines.Length - numberOfLines);
        }

        public object DownloadLog(string fileName)
        {
            var logFolder = ConfigurationManager.AppSettings["logLocation"];

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