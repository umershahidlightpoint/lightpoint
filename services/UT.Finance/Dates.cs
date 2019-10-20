using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;

namespace UT.Finance
{
    [TestClass]
    public class Dates
    {
        [TestMethod]
        public void NextBusinessDate()
        {
            var date = new DateTime(2019, 10, 20);
            var nextdate = date.NextBusinessDate();

            Assert.IsTrue(date.Day == 20, "Same Day");
            Assert.IsTrue(nextdate.Day == 21, "Should be monday");
        }

        [TestMethod]
        public void PrevBusinessDate()
        {
            var date = new DateTime(2019, 10, 20);
            var prevdate = date.PrevBusinessDate();

            Assert.IsTrue(date.Day == 20, "Same Day");
            Assert.IsTrue(prevdate.Day == 18, "Should be Friday");
        }

        [TestMethod]
        public void IsBusinessDate()
        {
            var date = new DateTime(2019, 10, 20);
            Assert.IsFalse(date.IsBusinessDate(), "Same Day");

            date = new DateTime(2019, 10, 22);
            Assert.IsTrue(date.IsBusinessDate(), "Same Day");

        }

    }
}