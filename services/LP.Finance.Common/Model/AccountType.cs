using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using iText.IO.Font;
using LP.Shared.Sql;

namespace LP.Finance.Common.Model
{
    public class AccountType : IDbAction, IDbActionIdentity
    {
        public bool Exists { get; set; }
        public int Id { get; set; }
        public string Name { get; set; }
        public AccountCategory Category { get; set; }

        private readonly static List<AccountType> _all = new List<AccountType>();

        public static List<AccountType> All { get { return _all; } }

        public static void Add(AccountType item)
        {
            All.Add(item);
        }

        public static AccountType Find(int id)
        {
            return All.Where(i => i.Id == id).FirstOrDefault();
        }

        public static AccountType FindByName(string name)
        {
            return All.Where(i => i.Name.Equals(name)).FirstOrDefault();
        }

        public static AccountType Find(string key)
        {
            var accountType = All.Where(i => i.Name.Equals(key)).FirstOrDefault();
            if (accountType != null)
                return accountType;

            throw new ApplicationException($"AccountType [{key}] does not exist");
        }

        public static AccountType Find(string accountCategory, string key, bool raiseError = true)
        {
            var accountType = All.Where(i => i.Name.Equals(key) && i.Category.Name.Equals(accountCategory)).FirstOrDefault();
            if (accountType != null)
                return accountType;

            if (raiseError)
                throw new ApplicationException($"AccountType [{key}] does not exist");

            return null;
        }

        public static AccountType Find(int id, string key, bool raiseError = true)
        {
            var accountType = All.Where(i => i.Name.Equals(key) && i.Category.Id == id).FirstOrDefault();
            if (accountType != null)
                return accountType;

            if ( raiseError)
                throw new ApplicationException($"AccountType [{key}] does not exist");

            return null;
        }

        public static AccountType[] Load(SqlConnection connection)
        {
            var list = new List<AccountType>();

            var query = new SqlCommand("select id, name, account_category_id from account_type", connection);
            var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                list.Add(new AccountType
                {
                Id = reader.GetFieldValue<int>(0),
                Name = reader.GetFieldValue<string>(1),
                Category = AccountCategory.Find(reader.GetFieldValue<int>(2))
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
                var sql = "insert into account_type (account_category_id, name) values (@account_category_id, @name)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("name", Name),
                    new SqlParameter("account_category_id", Category.Id),
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();

        public static AccountType FindOrCreate(int category, string AccountTypeName)
        {
            var accountType = new AccountType
            {
                Category = AccountCategory.Find(category),
                Name = AccountTypeName
            };

            All.Add(accountType);

            return accountType;
        }

        public static AccountType FindOrCreate(string category, string AccountTypeName)
        {
            var accountType = new AccountType
            {
                Category = AccountCategory.Find(category),
                Name = AccountTypeName
            };

            All.Add(accountType);

            return accountType;
        }

        public KeyValuePair<string, SqlParameter[]> Identity
        {
            get
            {
                var sql = @"select id from account_type where name=@name";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("name", Name),
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        /*
         * Account Type Literals
         */

        public static readonly string CUDCFX_TRANSLATION = "Change in Unrealized Derivatives Contracts due to FX Translation";
        public static readonly string CHANGE_UNREALIZED_FXTRANSLATION = "change in unrealized do to fx translation";

        // FX TRANSLATION
        public static readonly string M2M_LONGS_FXTRANSLATION = "Mark to Market longs fx translation gain or loss";
        public static readonly string M2M_SHORTS_FXTRANSLATION = "Mark to Market shorts fx translation gain or loss";
        public static readonly string M2M_DERIVATIVES_FXTRANSLATION_ASSETS = "Mark to Market Derivatives Contracts due to FX Translation (Assets)";
        public static readonly string M2M_DERIVATIVES_FXTRANSLATION_LIABILITIES = "Mark to Market Derivatives Contracts due to FX  Translation (Liabilities)";
    }
}
