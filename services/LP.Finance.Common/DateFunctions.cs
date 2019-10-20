using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LP.Finance.Common
{
    public static class DateFncs
    {
        public static bool IsBusinessDate(this DateTime date)
        {
            if (date.DayOfWeek == DayOfWeek.Saturday)
                return false;
            if (date.DayOfWeek == DayOfWeek.Sunday)
                return false;

            // TODO: Need to hook into a holiday calendar
            return true;
        }

        public static DateTime NextBusinessDate(this DateTime date)
        {
            var buisnessDate = date;
            do
            {
                buisnessDate = buisnessDate.AddDays(1);
            } while (!buisnessDate.IsBusinessDate());

            return buisnessDate;
        }

        public static DateTime PrevBusinessDate(this DateTime date)
        {
            var buisnessDate = date;
            do
            {
                buisnessDate = buisnessDate.AddDays(-1);
            } while (!buisnessDate.IsBusinessDate());

            return buisnessDate;
        }

        public static Tuple<DateTime, DateTime> ITD(this DateTime date)
        {
            var startDate = new DateTime(1900, 1, 1);
            return new Tuple<DateTime, DateTime>(startDate, date);
        }
        public static Tuple<DateTime, DateTime> YTD(this DateTime date)
        {
            var startDate = new DateTime(date.Year, 1, 1);
            return new Tuple<DateTime, DateTime>(startDate, date);
        }

        public static Tuple<DateTime, DateTime> MTD(this DateTime date)
        {
            var startDate = new DateTime(date.Year, date.Month, 1);
            return new Tuple<DateTime, DateTime>(startDate, date);
        }

        public static Tuple<DateTime, DateTime> Today(this DateTime date)
        {
            return new Tuple<DateTime, DateTime>(date.Date, date);
        }

    }
}
