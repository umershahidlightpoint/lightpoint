using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data.SqlClient;

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
    /// <summary>
    /// Definition of Account Structure
    /// </summary>
    public class AccountDef : IDbAction
    {
        public static AccountDef Default
        {
            get
            {
                return new AccountDef { Tags = new AccountDefTag[] {
                    new AccountDefTag { PropertyName = "SecurityType"},
                    new AccountDefTag { PropertyName = "CustodianCode"},
                    new AccountDefTag { PropertyName = "ExecutionBroker"},
                    new AccountDefTag { PropertyName = "Fund"},
                }
                };
            }
        }

        /// <summary>
        /// For each of the Account Categories we have a defined AccountDef, this is the set of fields that make up the account definition
        /// </summary>
        public static AccountDef[] Defaults
        {
            get
            {
                return new AccountDef[]
                {
                    new AccountDef
                    {
                        AccountCategory = 1, // Asset
                        Tags = new AccountDefTag[] 
                        {
                            new AccountDefTag { PropertyName = "SecurityType"},
                            new AccountDefTag { PropertyName = "Symbol"},
                            new AccountDefTag { PropertyName = "CustodianCode"},
                            new AccountDefTag { PropertyName = "ExecutionBroker"},
                            new AccountDefTag { PropertyName = "Long"},
                        }
                    },
                    new AccountDef
                    {
                        AccountCategory = 2, // Liability
                        Tags = new AccountDefTag[]
                        {
                            new AccountDefTag { PropertyName = "SecurityType"},
                            new AccountDefTag { PropertyName = "CustodianCode"},
                            new AccountDefTag { PropertyName = "ExecutionBroker"},
                            new AccountDefTag { PropertyName = "Fund"},
                        }
                    },
                    new AccountDef
                    {
                        AccountCategory = 3, // Equity
                        Tags = new AccountDefTag[]
                        {
                            new AccountDefTag { PropertyName = "SecurityType"},
                            new AccountDefTag { PropertyName = "CustodianCode"},
                            new AccountDefTag { PropertyName = "ExecutionBroker"},
                            new AccountDefTag { PropertyName = "Fund"},
                        }
                    },
                    new AccountDef
                    {
                        AccountCategory = 4, // Revenues
                        Tags = new AccountDefTag[]
                        {
                            new AccountDefTag { PropertyName = "SecurityType"},
                            new AccountDefTag { PropertyName = "CustodianCode"},
                            new AccountDefTag { PropertyName = "ExecutionBroker"},
                            new AccountDefTag { PropertyName = "Fund"},
                        }
                    },
                    new AccountDef
                    {
                        AccountCategory = 5, // Expences
                        Tags = new AccountDefTag[]
                        {
                            new AccountDefTag { PropertyName = "SecurityType"},
                            new AccountDefTag { PropertyName = "Symbol"},
                            new AccountDefTag { PropertyName = "CustodianCode"},
                            new AccountDefTag { PropertyName = "Fund"},
                        }
                    }
                };
            }
        }

        public AccountDef()
        {
        }

        public int AccountCategory { get; set; }

        public AccountDefTag[] Tags { get; set; }

        public string ColumnName { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }

    public class Account : IDbAction, IDbActionSaveUpdate, IDbActionIdentity
    {
        public int Id { get; set; }
        [Required]
        public int Category { get; set; }
        [Required]
        public string Name { get; set; }
        [Required]
        public string Description { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = "insert into account (name, description, account_category_id) values (@name, @description, @category)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("name", Name),
                    new SqlParameter("description", Description),
                    new SqlParameter("category", Category),
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
                    new SqlParameter("category", Category),
                };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams); }
        }

        public KeyValuePair<string, SqlParameter[]> SaveUpdate
        {
            get {
                var sql = @"update account set description=@description where name=@name IF @@ROWCOUNT=0 insert into account(name, description, account_category_id) values (@name, @description, @category)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("id", Id),
                    new SqlParameter("name", Name),
                    new SqlParameter("description", Description),
                    new SqlParameter("category", Category),
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Identity
        {
            get
            {
                var sql = @"select id from account where name=@name";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("name", Name),
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
}
