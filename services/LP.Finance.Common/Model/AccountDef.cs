using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using LP.Shared.Sql;

namespace LP.Finance.Common.Model
{
    /// <summary>
    /// Definition of Account Structure
    /// </summary>
    public class AccountDef : IDbAction
    {
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
                        AccountCategory = LP.Finance.Common.Model.AccountCategory.AC_ASSET, // Asset
                        Tags = new Tag[]
                        {
                            Tag.Tags.Where(t=>t.PropertyName.Equals("SecurityType")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("Symbol")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("CustodianCode")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("ExecutionBroker")).First(),
                        }
                    },
                    new AccountDef
                    {
                        AccountCategory = LP.Finance.Common.Model.AccountCategory.AC_LIABILITY, // Liability
                        Tags = new Tag[]
                        {
                            Tag.Tags.Where(t=>t.PropertyName.Equals("SecurityType")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("CustodianCode")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("ExecutionBroker")).First(),
                        }
                    },
                    new AccountDef
                    {
                        AccountCategory = LP.Finance.Common.Model.AccountCategory.AC_EQUITY, // Equity
                        Tags = new Tag[]
                        {
                            Tag.Tags.Where(t=>t.PropertyName.Equals("SecurityType")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("CustodianCode")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("ExecutionBroker")).First(),
                        }
                    },
                    new AccountDef
                    {
                        AccountCategory = LP.Finance.Common.Model.AccountCategory.AC_REVENUES, // Revenues
                        Tags = new Tag[]
                        {
                            Tag.Tags.Where(t=>t.PropertyName.Equals("SecurityType")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("CustodianCode")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("ExecutionBroker")).First(),
                        }
                    },
                    new AccountDef
                    {
                        AccountCategory = LP.Finance.Common.Model.AccountCategory.AC_EXPENCES, // Expences
                        Tags = new Tag[]
                        {
                            Tag.Tags.Where(t=>t.PropertyName.Equals("SecurityType")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("Symbol")).First(),
                            Tag.Tags.Where(t=>t.PropertyName.Equals("CustodianCode")).First(),
                        }
                    }
                };
            }
        }

        public AccountDef()
        {
        }

        public int AccountCategory { get; set; }

        public Tag[] Tags { get; set; }

        public string ColumnName { get; set; }

        public KeyValuePair<string, SqlParameter[]> Insert => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Update => throw new NotImplementedException();

        public KeyValuePair<string, SqlParameter[]> Delete => throw new NotImplementedException();
    }
}
