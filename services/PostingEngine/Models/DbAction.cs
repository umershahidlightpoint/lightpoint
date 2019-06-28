﻿using System.Data.SqlClient;

namespace ConsoleApp1.Models
{
    static class DbAction
    {
        public static int Save(this IDbAction action, SqlConnection connection, SqlTransaction transaction = null)
        {
            var D = action.Insert;
            var command = new SqlCommand(D.Key, connection);
            command.Transaction = transaction;
            command.Parameters.AddRange(D.Value);
            return command.ExecuteNonQuery();
        }
    }

}