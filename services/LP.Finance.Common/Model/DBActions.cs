using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    public static class DBActions
    {
        public static int Save(this IDbAction action, SqlConnection connection, SqlTransaction transaction)
        {
            var D = action.Insert;
            var command = new SqlCommand(D.Key, connection);
            command.Transaction = transaction;
            command.Parameters.AddRange(D.Value);
            return command.ExecuteNonQuery();
        }
    }

}
