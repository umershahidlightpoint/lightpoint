using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;

namespace LP.Finance.Common.Models
{
    /* Account      Increase    Decrease
    * Assets       Debit       Credit
    * Expences     Debit       Credit
    * Liabilities  Credit      Debit
    * Equity       Credit      Debit
    * Revenue      Credit      Debit
    */

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
            query.CommandTimeout = 120;
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

        /// <summary>
        /// Determine how to set the Value of the Journal, this will be based on the 
        /// </summary>
        /// <param name="fromAccount">The account from where the flow will start</param>
        /// <param name="toAccount">The account to where the flow will end</param>
        /// <param name="debit">Is this from the perspective of the debit account</param>
        /// <param name="value">The value to be posted</param>
        /// <returns>The correct signed value</returns>
        /// 

        public static double SignedValue(Account fromAccount, Account toAccount, bool debit, double value)
        {
            return SignedValue(fromAccount.Type.Category.Id, toAccount.Type.Category.Id, debit, value);
        }

        public static double SignedValue(int fromCategory, int toCategory, bool debit, double value)
        {
            if (debit)
                return value;

            if (fromCategory == toCategory)
            {
                return value * -1;
            }

            if (fromCategory == AccountCategory.AC_ASSET)
            {
                switch (toCategory)
                {
                    case AccountCategory.AC_ASSET:
                        return value * -1;
                    case AccountCategory.AC_LIABILITY:
                        return value;
                    case AccountCategory.AC_REVENUES:
                        return value;
                    case AccountCategory.AC_EQUITY:
                        return value;
                    case AccountCategory.AC_EXPENCES:
                        return value * -1;
                }
            }

            if (fromCategory == AccountCategory.AC_LIABILITY)
            {
                switch (toCategory)
                {
                    case AccountCategory.AC_ASSET:
                        return value;
                    case AccountCategory.AC_LIABILITY:
                        return value * -1;
                    case AccountCategory.AC_REVENUES:
                        return value * -1;
                    case AccountCategory.AC_EQUITY:
                        return value * -1;
                    case AccountCategory.AC_EXPENCES:
                        return value;
                }
            }

            if (fromCategory == AccountCategory.AC_REVENUES)
            {
                switch (toCategory)
                {
                    case AccountCategory.AC_ASSET:
                        return value;
                    case AccountCategory.AC_LIABILITY:
                        return value * -1;
                    case AccountCategory.AC_REVENUES:
                        return value * -1;
                    case AccountCategory.AC_EQUITY:
                        return value * -1;
                    case AccountCategory.AC_EXPENCES:
                        return value;
                }
            }

            if (fromCategory == AccountCategory.AC_EQUITY)
            {
                switch (toCategory)
                {
                    case AccountCategory.AC_ASSET:
                        return value;
                    case AccountCategory.AC_LIABILITY:
                        return value * -1;
                    case AccountCategory.AC_REVENUES:
                        return value * -1;
                    case AccountCategory.AC_EQUITY:
                        return value * -1;
                    case AccountCategory.AC_EXPENCES:
                        return value;
                }
            }

            if (fromCategory == AccountCategory.AC_EXPENCES)
            {
                switch (toCategory)
                {
                    case AccountCategory.AC_ASSET:
                        return value * -1;
                    case AccountCategory.AC_LIABILITY:
                        return value;
                    case AccountCategory.AC_REVENUES:
                        return value;
                    case AccountCategory.AC_EQUITY:
                        return value;
                    case AccountCategory.AC_EXPENCES:
                        return value * -1;
                }
            }

            return value;
        }

        public static double GetInitialSignedValue(Account ac, bool debit, double value)
        {
            return GetInitialSignedValue(ac.Type.Category.Id, debit, value);
        }

        public static double GetInitialSignedValue(int accountCategory, bool debit, double value)
        {
            switch (accountCategory)
            {
                case AccountCategory.AC_ASSET:
                    return debit ? value : value * -1;
                case AccountCategory.AC_LIABILITY:
                    return debit ? value * -1 : value;
                case AccountCategory.AC_REVENUES:
                    return debit ? value * -1 : value;
                case AccountCategory.AC_EQUITY:
                    return debit ? value * -1 : value;
                case AccountCategory.AC_EXPENCES:
                    return debit ? value : value * -1;
                default:
                    return value;
            }
        }

    }
}
