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
        private static readonly string getTaxRateURL = "/api/taxRate";

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

        [TestMethod]
        public void GetTaxRates()
        {
            var getTaxRates = Utils.GetWebApiData("FinanceWebApi", getTaxRateURL);

            Task.WaitAll(getTaxRates);

            var response = JsonConvert.DeserializeObject<Response>(getTaxRates.Result);

            var serializedPayload = JsonConvert.SerializeObject(response.data);

            var result = JsonConvert.DeserializeObject<List<TaxRateOutputDto>>(serializedPayload);

            Assert.IsTrue(result.Count >= 0, "Expected result");

            bool isCorrect = true;
            for (var i = 0; i < result.Count; i++)
            {
                if (result[i].IsOverLapped || result[i].IsGapPresent)
                {
                    isCorrect = false;
                }
            }

            Assert.IsTrue(isCorrect);
        }
    }
}
