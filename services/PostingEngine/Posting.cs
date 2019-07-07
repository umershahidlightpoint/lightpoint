using ConsoleApp1;
using LP.Finance.Common.Models;
using System.Data.SqlClient;
using System.Linq;

namespace PostingEngine
{
    class Posting
    {
        /// <summary>
        /// Process the transaction recieved, it will generate two offesting journal entries.
        /// </summary>
        /// <param name="element"></param>
        public void Process(Transaction element, SqlConnection connection, SqlTransaction transaction)
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

                var debit = new Journal
                {
                    Fund = element.Fund,
                    Source = element.LpOrderId,
                    Account = accountToFrom.From,
                    When = element.TradeDate,
                    Value = element.Commission * -1
                };

                debit.Save(connection, transaction);

                var credit = new Journal
                {
                    Fund = element.Fund,
                    Source = element.LpOrderId,
                    Account = accountToFrom.To,
                    When = element.TradeDate,
                    Value = element.Commission
                };

                credit.Save(connection, transaction);

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
            return new AccountToFrom
            {
                From = new Account { Category = 1, Description = "", Name = "Cash", Id = 1},
                To = new Account { Category = 1, Description = "", Name = "Cash", Id = 2 },
            };
        }
    }
}
