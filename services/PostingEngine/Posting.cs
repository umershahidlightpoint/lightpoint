using ConsoleApp1;
using LP.Finance.Common.Models;
using System.Data.SqlClient;
using System.Linq;
using System.Text;

namespace PostingEngine
{
    class Posting
    {
        private SqlConnection _connection;
        private SqlTransaction _transaction;

        public Posting(SqlConnection connection, SqlTransaction transaction)
        {
            this._connection = connection;
            this._transaction = transaction;
        }

        /// <summary>
        /// Process the transaction recieved, it will generate two offesting journal entries.
        /// </summary>
        /// <param name="element"></param>
        public void Process(Transaction element)
        {
            // For each row in the database determine the account Id associated with that Transaction, this is going to be based on some rules
            var existingJournals = GetJournals(element);

            if (existingJournals.Count() > 0)
            {
                // need to remove those entries

                // And recreate them
            }
            else
            {
                var accountToFrom = GetFromToAccount(element);
                accountToFrom.From.SaveUpdate(_connection, _transaction);
                accountToFrom.From.Id = accountToFrom.From.Identity(_connection, _transaction);
                accountToFrom.To.Id = accountToFrom.To.SaveUpdate(_connection, _transaction);
                accountToFrom.To.Id = accountToFrom.To.Identity(_connection, _transaction);

                var debit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = element.TradeDate,
                    Value = element.Commission * -1,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                debit.Save(_connection, _transaction);

                var credit = new Journal
                {
                    Source = element.LpOrderId,
                    Account = accountToFrom.To,
                    When = element.TradeDate,
                    Value = element.Commission,
                    GeneratedBy = "system",
                    Fund = element.Fund,
                };

                credit.Save(_connection, _transaction);

                // Now have two entries / credit / debit

                // Need to save both now
            }
        }

        private Journal[] GetJournals(Transaction element)
        {
            return new Journal[] { };
        }

        private AccountToFrom GetFromToAccount(Transaction element)
        {
            var type = element.GetType();
            var accountDefs = AccountDef.Defaults;

            var assetAccountDef = accountDefs.Where(i => i.AccountCategory == AccountCategory.AC_ASSET).First();
            var assetAccountName = new StringBuilder();

            // Create a tag to identify the account
            foreach (var tag in assetAccountDef.Tags)
            {
                var property = type.GetProperty(tag.PropertyName);
                var value = property.GetValue(element);
                assetAccountName.Append(value).Append("-");
            }
            var assetAccount = new Account { Category = assetAccountDef.AccountCategory, Description = assetAccountName.ToString(), Name = assetAccountName.ToString() };

            if (element.SecurityType.Equals("Journals"))
            {

                var expencesAccountDef = accountDefs.Where(i => i.AccountCategory == AccountCategory.AC_EXPENCES).First();
                var expencesAccountName = new StringBuilder();

                // Create a tag to identify the account
                foreach (var tag in expencesAccountDef.Tags)
                {
                    var property = type.GetProperty(tag.PropertyName);
                    var value = property.GetValue(element);
                    expencesAccountName.Append(value).Append("-");

                }

                var expencesAccount = new Account { Category = expencesAccountDef.AccountCategory, Description = expencesAccountName.ToString(), Name = expencesAccountName.ToString() };


                // The symbol will determine how to generate the Journal entry for these elements.
                switch (element.Symbol.ToUpper())
                {
                    case "ZZ_ACCOUNTING_FEES":
                        break;
                    case "ZZ_ADMINISTRATIVE_FEES":
                        break;
                    case "ZZ_BANK_SERVICE_FEES":
                        break;
                    case "ZZ_INVESTOR_CONTRIBUTIONS":
                        break;
                    case "ZZ_CUSTODY_FEES":
                        break;
                    default:
                        break;
                }

                return new AccountToFrom
                {
                    From = assetAccount,
                    To = expencesAccount
                };
            }


            var liabilitiesAccountDef = accountDefs.Where(i => i.AccountCategory == AccountCategory.AC_LIABILITY).First();


            var liabilitiesAccountName = new StringBuilder();

            // Create a tag to identify the account
            foreach (var tag in liabilitiesAccountDef.Tags)
            {
                var property = type.GetProperty(tag.PropertyName);
                var value = property.GetValue(element);
                liabilitiesAccountName.Append(value).Append("-");
            }

            var liabilitiesAccount = new Account { Category = liabilitiesAccountDef.AccountCategory, Description = liabilitiesAccountName.ToString(), Name = liabilitiesAccountName.ToString() };

            return new AccountToFrom
            {
                From = assetAccount,
                To = liabilitiesAccount
            };
        }
    }
}
