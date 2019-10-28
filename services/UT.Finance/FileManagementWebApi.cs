using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LP.Finance.Common;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace UT.Finance
{
    [TestClass]
    public class FileManagementWebApi
    {
        private static readonly string fileManagementURL = "/api/fileManagement/files";

        public FileManagementWebApi()
        {
            //
            // TODO: Add constructor logic here
            //
        }

        [TestMethod]
        public void fileManagement()
        {

            var fileManagement = Utils.GetWebApiData("FinanceWebApi", fileManagementURL);

            Task.WaitAll(fileManagement);

            dynamic result = JsonConvert.DeserializeObject<object>(fileManagement.Result);

            Assert.IsTrue(result.data.Count >= 0, "Expected result");

        }
    }
}
