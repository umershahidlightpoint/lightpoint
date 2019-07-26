using System;
using System.Collections.Generic;
using System.Data.SqlClient;

namespace LP.Finance.Common.Models
{
    public class AccountType : IDbAction
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public AccountCategory Category { get; set; }

        private readonly static List<AccountType> _all = new List<AccountType>();

        public static List<AccountType> All { get { return _all; } }

        public static AccountType[] Load(SqlConnection connection)
        {
            var list = new List<AccountType>();

            var query = new SqlCommand("select id, name, account_category_id from account_type", connection);
            var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                list.Add(new AccountType
                {
                Id = reader.GetFieldValue<Int32>(0),
                Name = reader.GetFieldValue<string>(1),
                Category = AccountCategory.Find(reader.GetFieldValue<Int32>(2))
                });
            }
            reader.Close();

            All.AddRange(list);

            return All.ToArray();
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
