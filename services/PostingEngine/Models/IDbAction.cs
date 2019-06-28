using System.Collections.Generic;
using System.Data.SqlClient;

namespace ConsoleApp1.Models
{
    public interface IDbAction
    {
        KeyValuePair<string, SqlParameter[]> Insert { get; }
        KeyValuePair<string, SqlParameter[]> Update { get; }
        KeyValuePair<string, SqlParameter[]> Delete { get; }
    }

}
