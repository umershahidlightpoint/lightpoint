using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace LP.Shared.Sql
{
    public interface IDbModel
    {
        void PopulateRow(DataRow row);

        DataTable MetaData(SqlConnection connection);
    }

    public interface IDbAction
    {
        KeyValuePair<string, SqlParameter[]> Insert { get; }
        KeyValuePair<string, SqlParameter[]> Update { get; }
        KeyValuePair<string, SqlParameter[]> Delete { get; }
    }

    public interface IDbActionSaveUpdate
    {
        KeyValuePair<string, SqlParameter[]> SaveUpdate { get; }
    }

    public interface IDbActionIdentity
    {
        KeyValuePair<string, SqlParameter[]> Identity { get; }
    }
}