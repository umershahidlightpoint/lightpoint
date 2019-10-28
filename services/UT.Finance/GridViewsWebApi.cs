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

            dynamic result = JsonConvert.DeserializeObject<object>(getGridLayouts.Result);

            Assert.IsTrue(result.payload.Count >= 0, "Expected result");

        }
    }
}
