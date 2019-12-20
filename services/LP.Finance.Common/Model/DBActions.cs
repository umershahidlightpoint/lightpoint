using System;
using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    public static class DBActions
    {
        public static int Save(this IDbAction action, string connectionString)
        {
            int result = 0;

            var D = action.Insert;
            using ( var connection = new SqlConnection(connectionString))
            {
                connection.Open();
                var command = new SqlCommand(D.Key, connection);

                command.Parameters.AddRange(D.Value);
                result =  command.ExecuteNonQuery();
                connection.Close();
            }
            return result;
        }

        public static int Save(this IDbAction action, SqlConnection connection, SqlTransaction transaction = null)
        {
            var D = action.Insert;
            var command = new SqlCommand(D.Key, connection);

            if ( transaction != null)
                command.Transaction = transaction;

            command.Parameters.AddRange(D.Value);
            return command.ExecuteNonQuery();
        }

        public static int SaveUpdate(this IDbActionSaveUpdate action, SqlConnection connection, SqlTransaction transaction)
        {
            var D = action.SaveUpdate;
            var command = new SqlCommand(D.Key, connection);
            command.Transaction = transaction;
            command.Parameters.AddRange(D.Value);
            return command.ExecuteNonQuery();
        }

        public static int Identity(this IDbActionIdentity action, SqlConnection connection, SqlTransaction transaction)
        {
            var D = action.Identity;
            var command = new SqlCommand(D.Key, connection);
            command.Transaction = transaction;
            command.Parameters.AddRange(D.Value);

            int result = 0;

            using (var reader = command.ExecuteReader())
            {
                if ( reader.HasRows)
                {
                    reader.Read();

                    result = reader.GetFieldValue<Int32>(0);
                }
            }

            return result;
        }

    }

}
