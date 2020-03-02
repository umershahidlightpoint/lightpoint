using System;
using System.Data;
using System.Data.SqlClient;

namespace SqlDAL.Core
{
    public static class SQLConnectionHelper
    {
        public static DataTable Table(this SqlConnection connection, string queryName)
        {
            return null;
        }
    }

    public class SqlHelper
    {
        private string ConnectionString { get; set; }
        private SqlConnection SqlConnection { get; set; }
        private SqlTransaction SqlTransaction { get; set; }

        public SqlHelper(string connectionString)
        {
            ConnectionString = connectionString;
        }

        public SqlConnection GetConnection()
        {
            return SqlConnection;
        }

        public SqlTransaction GetTransaction()
        {
            return SqlTransaction;
        }

        public void CreateConnection()
        {
            SqlConnection = new SqlConnection(ConnectionString);
        }

        public void OpenConnection()
        {
            SqlConnection.Open();
        }

        public void VerifyConnection()
        {
            if (SqlConnection == null) CreateConnection();
            if (SqlConnection.State == ConnectionState.Closed) OpenConnection();
        }

        public void SqlBeginTransaction()
        {
            SqlTransaction = SqlConnection.BeginTransaction();
        }

        public void SqlCommitTransaction()
        {
            SqlTransaction.Commit();
        }

        public void SqlRollbackTransaction()
        {
            SqlTransaction.Rollback();
        }

        public void CloseConnection()
        {
            SqlConnection.Close();
        }

        public SqlParameter CreateParameter(string name, object value, DbType dbType)
        {
            return CreateParameter(name, 0, value, dbType, ParameterDirection.Input);
        }

        public SqlParameter CreateParameter(string name, int size, object value, DbType dbType)
        {
            return CreateParameter(name, size, value, dbType, ParameterDirection.Input);
        }

        public SqlParameter CreateParameter(string name, int size, object value, DbType dbType,
            ParameterDirection direction)
        {
            return new SqlParameter
            {
                DbType = dbType,
                ParameterName = name,
                Size = size,
                Direction = direction,
                Value = value
            };
        }

        public DataTable GetDataTable(string commandText, CommandType commandType, SqlParameter[] parameters = null)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();

                using (var command = new SqlCommand(commandText, connection))
                {
                    command.CommandTimeout = 120;
                    command.CommandType = commandType;
                    if (parameters != null)
                    {
                        foreach (var parameter in parameters)
                        {
                            command.Parameters.Add(parameter);
                        }
                    }

                    var dataSet = new DataSet();
                    var dataAdapter = new SqlDataAdapter(command);
                    dataAdapter.Fill(dataSet);

                    return dataSet.Tables[0];
                }
            }
        }

        public DataTableCollection GetDataTables(string commandText, CommandType commandType, SqlParameter[] parameters = null, NLog.Logger logger = null)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();
                connection.InfoMessage += delegate (object sender, SqlInfoMessageEventArgs e)
                {
                    if (logger != null)
                    {
                        logger.Info(e.Message);
                    }
                };
                using (var command = new SqlCommand(commandText, connection))
                {
                    command.CommandTimeout = 60 * 10; // 10 Mins max, if that's not sufficent then we have a serious issue
                    command.CommandType = commandType;
                    if (parameters != null)
                    {
                        foreach (var parameter in parameters)
                        {
                            command.Parameters.Add(parameter);
                        }
                    }

                    var dataSet = new DataSet();
                    var dataAdapter = new SqlDataAdapter(command);
                    dataAdapter.Fill(dataSet);

                    return dataSet.Tables;
                }
            }
        }

        public DataSet GetDataSet(string commandText, CommandType commandType, SqlParameter[] parameters = null)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();

                using (var command = new SqlCommand(commandText, connection))
                {
                    command.CommandType = commandType;
                    if (parameters != null)
                    {
                        foreach (var parameter in parameters)
                        {
                            command.Parameters.Add(parameter);
                        }
                    }

                    var dataSet = new DataSet();
                    var dataAdapter = new SqlDataAdapter(command);
                    dataAdapter.Fill(dataSet);

                    return dataSet;
                }
            }
        }

        public IDataReader GetDataReader(string commandText, CommandType commandType, SqlParameter[] parameters,
            out SqlConnection connection)
        {
            IDataReader reader = null;
            connection = new SqlConnection(ConnectionString);
            connection.Open();

            var command = new SqlCommand(commandText, connection)
            {
                CommandType = commandType
            };

            if (parameters != null)
            {
                foreach (var parameter in parameters)
                {
                    command.Parameters.Add(parameter);
                }
            }

            reader = command.ExecuteReader();

            return reader;
        }

        public void Delete(string commandText, CommandType commandType, SqlParameter[] parameters = null)
        {
            using (var command = new SqlCommand(commandText, SqlConnection, SqlTransaction))
            {
                command.CommandType = commandType;
                if (parameters != null)
                {
                    foreach (var parameter in parameters)
                    {
                        command.Parameters.Add(parameter);
                    }
                }

                try
                {
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Delete with Transaction Exception: {ex}");
                    throw;
                }
            }
        }

        public void Insert(string commandText, CommandType commandType, SqlParameter[] parameters, out int lastId)
        {
            lastId = 0;
            using (var command = new SqlCommand(commandText, SqlConnection, SqlTransaction))
            {
                command.CommandType = commandType;
                if (parameters != null)
                {
                    foreach (var parameter in parameters)
                    {
                        command.Parameters.Add(parameter);
                    }
                }

                try
                {
                    object newId = command.ExecuteScalar();
                    lastId = Convert.ToInt32(newId);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Insert with Transaction Exception: {ex}");
                    throw;
                }
            }
        }

        public void Insert(string commandText, CommandType commandType, SqlParameter[] parameters, out long lastId)
        {
            lastId = 0;
            using (var command = new SqlCommand(commandText, SqlConnection, SqlTransaction))
            {
                command.CommandType = commandType;
                if (parameters != null)
                {
                    foreach (var parameter in parameters)
                    {
                        command.Parameters.Add(parameter);
                    }
                }

                try
                {
                    object newId = command.ExecuteScalar();
                    lastId = Convert.ToInt64(newId);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Insert with Transaction Exception: {ex}");
                    throw;
                }
            }
        }

        public void Insert(string commandText, CommandType commandType, SqlParameter[] parameters)
        {
            using (var command = new SqlCommand(commandText, SqlConnection, SqlTransaction))
            {
                command.CommandType = commandType;
                if (parameters != null)
                {
                    foreach (var parameter in parameters)
                    {
                        command.Parameters.Add(parameter);
                    }
                }

                try
                {
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Insert with Transaction Exception: {ex}");
                    throw;
                }
            }
        }

        public void InsertWithTransaction(string commandText, CommandType commandType, IsolationLevel isolationLevel,
            SqlParameter[] parameters)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();
                var transactionScope = connection.BeginTransaction(isolationLevel);

                using (var command = new SqlCommand(commandText, connection))
                {
                    command.CommandType = commandType;
                    if (parameters != null)
                    {
                        foreach (var parameter in parameters)
                        {
                            command.Parameters.Add(parameter);
                        }
                    }

                    try
                    {
                        command.ExecuteNonQuery();
                        transactionScope.Commit();
                    }
                    catch (Exception)
                    {
                        transactionScope.Rollback();
                    }
                    finally
                    {
                        connection.Close();
                    }
                }
            }
        }

        public void Update(string commandText, CommandType commandType, SqlParameter[] parameters = null)
        {
            using (var command = new SqlCommand(commandText, SqlConnection, SqlTransaction))
            {
                command.CommandType = commandType;
                if (parameters != null)
                {
                    foreach (var parameter in parameters)
                    {
                        command.Parameters.Add(parameter);
                    }
                }

                try
                {
                    command.ExecuteNonQuery();
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Update with Transaction Exception: {ex}");
                    throw;
                }
            }
        }

        public void UpdateWithTransaction(string commandText, CommandType commandType, IsolationLevel isolationLevel,
            SqlParameter[] parameters)
        {
            SqlTransaction transactionScope = null;
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();
                transactionScope = connection.BeginTransaction(isolationLevel);

                using (var command = new SqlCommand(commandText, connection))
                {
                    command.Transaction = transactionScope;
                    command.CommandType = commandType;
                    if (parameters != null)
                    {
                        foreach (var parameter in parameters)
                        {
                            command.Parameters.Add(parameter);
                        }
                    }

                    try
                    {
                        command.ExecuteNonQuery();
                        transactionScope.Commit();
                    }
                    catch (Exception ex)
                    {
                        transactionScope.Rollback();
                    }
                    finally
                    {
                        connection.Close();
                    }
                }
            }
        }

        public object GetScalarValue(string commandText, CommandType commandType, SqlParameter[] parameters = null)
        {
            using (var connection = new SqlConnection(ConnectionString))
            {
                connection.Open();

                using (var command = new SqlCommand(commandText, connection))
                {
                    command.CommandType = commandType;
                    if (parameters != null)
                    {
                        foreach (var parameter in parameters)
                        {
                            command.Parameters.Add(parameter);
                        }
                    }

                    return command.ExecuteScalar();
                }
            }
        }
    }
}