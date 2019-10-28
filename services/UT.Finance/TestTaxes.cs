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
    public class TestTaxes
    {
        [TestMethod]
        public void TaxRates()
        {
            var date = DateTime.Now.Date;
            var businessDate = date.BusinessDate().Date;

            var taxRate = new TaxRates().Get(businessDate);

            Assert.IsTrue(taxRate != null, $"expected Taxrate for {businessDate}");
            Assert.IsTrue(taxRate != null && taxRate.ShortTermPeriod == 365, $"expected 365 for short term period");
            Assert.IsTrue(taxRate != null && taxRate.LongTerm == 0.20M, $"expected 20% for long term rate");
            Assert.IsTrue(taxRate != null && taxRate.ShortTerm == 0.396M, $"expected 39.6% for long term rate");
        }
    }
}
