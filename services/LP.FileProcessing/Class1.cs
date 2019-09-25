using LP.FileProcessing.MetaData;
using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
/*
* Start of a common library for generating and consuming files
*/
namespace LP.FileProcessing
{
    public class Class1
    {
        // Header & Footer's required as part of the file generation
        public object GenerateActivityFile(Transaction[] transactionList, string path)
        {
            List<SilverMetaDataForActivity> activityMetaData = new List<SilverMetaDataForActivity>();
            foreach(var item in transactionList)
            {
                SilverMetaDataForActivity met = new SilverMetaDataForActivity
                {
                    Quantity = item.Quantity,
                    Security_Currency = item.TradeCurrency,
                    Security_ID = item.TradeId,
                    Settlement_Date = Convert.ToString(item.SettleDate.Date),
                    Symbol = item.Symbol,
                    Long_Position_Indicator = item.Side,
                    Trade_Date = Convert.ToString(item.TradeDate.Date)
                };

                activityMetaData.Add(met);
            }


            WriteCSV(activityMetaData, path);
            return activityMetaData;
        }

        public object PositionFile()
        {
            List<SilverMetaDataForPosition> positionMetaData = new List<SilverMetaDataForPosition>();
            for (var i = 0; i < 10; i++)
            {
                SilverMetaDataForPosition met = new SilverMetaDataForPosition
                {
                    Security_Currency = "USD",
                    Security_ID = "1234567",
                    Symbol = "USD"
                };

                positionMetaData.Add(met);
            }
            return positionMetaData;
        }

        public void WriteCSV<T>(IEnumerable<T> items, string path)
        {
            WriteDelimited<T>(items, path);
        }

        public void WritePipe<T>(IEnumerable<T> items, string path)
        {
            WriteDelimited<T>(items, path, '|');
        }

        public void WriteDelimited<T>(IEnumerable<T> items, string path, char delim = ',')
        {
            Type itemType = typeof(T);
            var props = itemType.GetProperties(BindingFlags.Public | BindingFlags.Instance)
                                .OrderBy(p => p.Name);

            using (var writer = new StreamWriter(path))
            {
                writer.WriteLine(string.Join(delim.ToString(), props.Select(p => p.Name)));

                foreach (var item in items)
                {
                    writer.WriteLine(string.Join(delim.ToString(), props.Select(p => p.GetValue(item, null))));
                }
            }
        }

    }

}
