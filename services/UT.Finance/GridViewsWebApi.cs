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
    public class GridViewsWebApi
    {
        private static readonly string getGridLayoutsURL = "/api/DataGrid/GetGridLayouts";

        public GridViewsWebApi()
        {
            //
            // TODO: Add constructor logic here
            //
        }
        [TestMethod]
        public void getGridLayouts()
        {

            var getGridLayouts = Utils.GetWebApiData("FinanceWebApi", getGridLayoutsURL);

            Task.WaitAll(getGridLayouts);

            var response = JsonConvert.DeserializeObject<Response>(getGridLayouts.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.payload);

            dynamic result = JsonConvert.DeserializeObject(serializedPayload);

            Assert.IsTrue(response.isSuccessful, "Request Call Successful");
            Assert.IsTrue(result.Count >= 0, "Expected result");

        }
    }
}
