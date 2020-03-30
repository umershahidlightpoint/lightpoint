using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using LP.Finance.Common.Model;

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
            // Account information
            AccountCategory.Load(connection);
            AccountType.Load(connection);
            Account.Load(connection);
            Tag.Load(connection);

            // TaxLotStatus
            TaxLotStatus.Load(connection);

            // TaxLotManualLink
            TaxLotManualLink.Load(connection);
        }

        internal static void Setup(string ConnectionString)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();

                try
                {
                    Setup(connection);
                }
                catch (Exception ex )
                {
                    throw ex;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

        public static void LoadAccounts(string ConnectionString)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();

                try
                {
                    AccountCategory.Load(connection);
                    AccountType.Load(connection);
                    Account.Load(connection);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
                finally
                {
                    connection.Close();
                }
            }
        }

    }
}
