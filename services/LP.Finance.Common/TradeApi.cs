using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data;
using System.Data.SqlClient;
using SqlDAL.Core;

namespace LP.Finance.Common
{
    public class TradeApi
    {
        public readonly static string TRADE_QUERY = "select * from current_trade_state order by TradeDate asc";


        public List<T> All<T>(string connectionString, string query)
        {
            var trades = new List<T>();

            using (var connection = new SqlConnection(connectionString))
            {
                connection.Open();

                IDataReader reader = null;

                var command = new SqlCommand(query, connection)
                {
                    CommandType = CommandType.Text
                };

                reader = command.ExecuteReader();

                trades.AddRange(DataReaderMapToList<T>(reader));

                connection.Close();
            }
            return trades;
        }


        public static List<T> DataReaderMapToList<T>(IDataReader dr)
        {
            List<T> list = new List<T>();
            T obj = default(T);
            var properties = typeof(T).GetProperties();

            var columns = new List<string>();

            for (int i = 0; i < dr.FieldCount; i++)
            {
                columns.Add(dr.GetName(i));
            }

            while (dr.Read())
            {
                obj = Activator.CreateInstance<T>();
                foreach (var prop in properties)
                {
                    if (columns.Contains(prop.Name))
                    {
                        if (!object.Equals(dr[prop.Name], DBNull.Value))
                        {
                            if (dr[prop.Name].GetType() == typeof(Decimal))
                            {
                                prop.SetValue(obj, Convert.ToDouble(dr[prop.Name]), null);
                            }
                            else
                                prop.SetValue(obj, dr[prop.Name], null);
                        }
                    }
                }
                list.Add(obj);
            }
            return list;
        }


    }
}
