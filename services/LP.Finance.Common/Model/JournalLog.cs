using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    public class JournalLog : IDbAction
    {
        public KeyValuePair<string, SqlParameter[]> Insert => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }

}
