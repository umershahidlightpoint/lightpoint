using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace LP.Finance.Common.Models
{
    public class AccountCategory : IDbAction
    {
        public const int AC_ASSET = 1;
        public const int AC_LIABILITY = 2;
        public const int AC_EQUITY = 3;
        public const int AC_REVENUES = 4;
        public const int AC_EXPENCES = 5;

        public static AccountCategory Find(int id)
        {
            return Categories.Where(i => i.Id == id).FirstOrDefault();
        }

        public static AccountCategory[] Categories { get; private set; }
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

            Categories = list.ToArray();

            return Categories;
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
