using LP.Finance.Common;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

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
                var currentDir = System.AppDomain.CurrentDomain.BaseDirectory;
                var fileList = Directory.GetFiles(currentDir + "Finance-Logs").ToList();
                var fileNames = fileList.Select(x => new {
                    FileName = System.IO.Path.GetFileName(x)
                }).ToList();

                sw.Stop();
                Logger.Info($"finished GetLogFiles at {DateTime.UtcNow} in {sw.ElapsedMilliseconds} ms | {sw.ElapsedMilliseconds / 1000} s");
                return Utils.Wrap(true, fileNames, HttpStatusCode.OK);
            }
            catch(Exception ex)
            {
                sw.Stop();
                Logger.Error(ex, $"GetLogFiles failed at {DateTime.UtcNow} in {sw.ElapsedMilliseconds} ms | {sw.ElapsedMilliseconds / 1000} s");
                throw ex;
            }
        }

        public object DownloadLog(string fileName)
        {
            var path = System.AppDomain.CurrentDomain.BaseDirectory + "Finance-Logs" + Path.DirectorySeparatorChar + fileName;
            var dataBytes = File.ReadAllBytes(path);
            var dataStream = new MemoryStream(dataBytes);
            HttpResponseMessage response = new HttpResponseMessage(HttpStatusCode.OK);
            response.Content = new StreamContent(dataStream);
            return response;
        }
    }
}
