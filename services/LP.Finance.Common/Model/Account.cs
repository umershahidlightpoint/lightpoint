﻿using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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
        public int Category { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }

        public List<AccountTag> Tags { get; set; }

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

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

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

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }

    public class Tag : IDbAction
    {
        public int Id { get; set; }
        public string TypeName { get; set; }
        public string PkName { get; set; }
        public string PropertyName { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert
        {
            get
            {
                var sql = "insert into tag (table_name, pk_name, column_name) values (@table_name, @pk_name, @column_name)";
                var sqlParams = new SqlParameter[]
                {
                    new SqlParameter("table_name", TypeName),
                    new SqlParameter("pk_name", PkName),
                    new SqlParameter("column_name", PropertyName)
            };

                return new KeyValuePair<string, SqlParameter[]>(sql, sqlParams);
            }
        }

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
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
