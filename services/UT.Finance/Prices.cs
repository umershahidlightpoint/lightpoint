using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using PostingEngine;

namespace UT.Finance
{
    [TestClass]
    public class Prices
    {
        [TestMethod]
        public void MarketPrices()
        {
            var date = DateTime.Now.Date;
            var businessDate = date.BusinessDate();
            var prevEodDate = businessDate.PrevBusinessDate();

            var eodPrices = new MarketPrices().Get(businessDate);
            var prevEodPrices = new MarketPrices().Get(prevEodDate);

            Assert.IsTrue(prevEodDate < businessDate, $"{prevEodDate} should be less than {businessDate}");

            Assert.IsTrue(eodPrices.Count > 0, $"expected data for {businessDate}");
            Assert.IsTrue(prevEodPrices.Count > 0, $"expected data for {prevEodDate}");
        }
    }
}