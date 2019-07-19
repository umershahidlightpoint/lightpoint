using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    public class AccountCategory : IDbAction
    {
        public static readonly int AC_ASSET = 1;
        public static readonly int AC_LIABILITY = 2;
        public static readonly int AC_EQUITY = 3;
        public static readonly int AC_REVENUES = 4;
        public static readonly int AC_EXPENCES = 5;

        private static AccountCategory[] _categories;
        private static Tag[] _tags;
        public static AccountCategory[] Categories { get { return _categories; } }
        public int Id { get; set; }
        public string Name { get; set; }

        public static AccountCategory[] Load(SqlConnection connection)
        {
            var list = new List<AccountCategory>();

            var query = new SqlCommand("select * from account_category", connection);
            var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                list.Add(new AccountCategory {
                Id = reader.GetFieldValue<Int32>(0),
                Name = reader.GetFieldValue<string>(1)});
            }
            reader.Close();

            _categories = list.ToArray();

            return _categories;
        }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = "insert into account_category (id, name) values (@id, @name)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("name", Name),
                    new SqlParameter("id", Id),
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }
}
