using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;
using LP.Finance.Common.Models;

namespace LP.Finance.Common.Models
{
    public class AccountDefTag : IDbAction
    {
        public AccountDefTag()
        {
        }
        public string PropertyName { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }

    public class Account : IDbAction, IDbActionSaveUpdate, IDbActionIdentity
    {
        public static List<Account> All { private set;  get; }

        public static Account[] Load(SqlConnection connection)
        {
            All = new List<Account>();

            var list = new List<Account>();

            var query = new SqlCommand("select id, name, account_type_id from account with(nolock)", connection);
            var reader = query.ExecuteReader(System.Data.CommandBehavior.SingleResult);

            while (reader.Read())
            {
                list.Add(new Account
                {
                    Id = reader.GetFieldValue<int>(0),
                    Name = reader.GetFieldValue<string>(1),
                    Type = AccountType.Find(reader.GetFieldValue<int>(2)),
                    Exists = true,
                });
            }
            reader.Close();

            All.AddRange(list);

            return All.ToArray();
        }

        /// <summary>
        /// Check to see if the Account has already been saved, if so then don't bother saving again
        /// </summary>
        public bool Exists { get; set; }

        public int Id { get; set; }
        [Required]
        public AccountType Type { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }

        public List<AccountTag> Tags { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = "insert into account (name, description, account_type_id) values (@name, @description, @type)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("name", Name),
                    new SqlParameter("description", Description),
                    new SqlParameter("type", Type.Id),
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update
        {
            get { var sql = @"update account set description=@description where name=@name";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("id", Id),
                    new SqlParameter("name", Name),
                    new SqlParameter("description", Description),
                    new SqlParameter("category", Type.Id),
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams); }
        }

        public KeyValuePair<string, SqlParameter[]> SaveUpdate
        {
            get {
                var sql = @"update account 
                        set description=@description 
                        where name=@name and account_type_id = @type
                        IF @@ROWCOUNT=0 insert into account(name, description, account_type_id) values (@name, @description, @type)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("id", Id),
                    new SqlParameter("name", Name),
                    new SqlParameter("description", Description),
                    new SqlParameter("type", Type.Id),
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Identity
        {
            get
            {
                var sql = @"select id from account where name=@name and account_type_id=@type";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("name", Name),
                    new SqlParameter("type", Type.Id),
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Delete
        {
            get
            {
                var sql = @"delete from account where name=@name";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("name", Name),
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }
    }

    public class AccountTag : IDbAction
    {
        public Account Account { get; set; }
        public Tag Tag { get; set; }
        public string TagValue { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = "insert into account_tag (account_id, tag_id, tag_value) values (@account_id, @tag_id, @tag_value)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("account_id", Account.Id),
                    new SqlParameter("tag_id", Tag.Id),
                    new SqlParameter("tag_value", TagValue),
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }
}
