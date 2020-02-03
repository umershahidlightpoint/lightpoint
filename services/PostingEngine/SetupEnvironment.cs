using LP.Finance.Common.Models;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine
{
    public static class SetupEnvironment
    {
        /// <summary>
        /// Preload data into the system
        /// </summary>
        /// <param name="connection"></param>
        internal static void Setup(SqlConnection connection)
        {
            AccountCategory.Load(connection);
            AccountType.Load(connection);
            Account.Load(connection);
            Tag.Load(connection);
        }

        internal static void Setup(string ConnectionString)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();

                try
                {
                    AccountCategory.Load(connection);
                    AccountType.Load(connection);
                    Account.Load(connection);
                    Tag.Load(connection);
                }
                catch (Exception ex )
                {
                }
                finally
                {
                    connection.Close();
                }
            }
        }

    }
}
