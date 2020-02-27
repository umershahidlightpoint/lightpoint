using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using PostingEngine.PostingRules.Utilities;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PostingEngine.Tasks.Implementation
{
    public class DisburseDividends : IPostingTask
    {
        public bool Run(PostingEngineEnvironment env)
        {
            throw new NotImplementedException();
        }

        public object PreviewJournals(string symbol, DateTime executionDate, string connectionString)
        {
            var cc = new SqlConnection(connectionString);
            cc.Open();
            var dividends = CashDividends.Load(cc);
            SetupEnvironment.Setup(cc);
            cc.Close();

            var qualifiedDividend = dividends.Where(x => x.Symbol == symbol && x.ExecutionDate == executionDate).FirstOrDefault();
            var qualifiedTaxLots = TaxLotStatus.All.Where(x => x.Symbol == symbol && x.TradeDate <= executionDate).ToList();
            PostingEngineEnvironment env = new PostingEngineEnvironment();
            var journals = Disburse(qualifiedDividend, qualifiedTaxLots,env, true);
            return journals;
        }

        public object Disburse(CashDividends dividend, List<TaxLotStatus> taxlots, PostingEngineEnvironment env, bool preview)
        {
            var journals = new List<Journal>();
            var accountType = $"Net Income Current Year";
            var valueDate = DateTime.Now;

            if (AccountType.Find(AccountCategory.AC_EQUITY, accountType, false) == null)
            {
                // Need to create the Account Type
                var createdAccountType = AccountType.FindOrCreate(AccountCategory.AC_EQUITY, accountType);
                if (!preview)
                {
                    new AccountUtils().Save(env, createdAccountType);
                }
            }
            foreach (var item in taxlots)
            {
                var account = new AccountUtils().GetAccount(env, accountType, new string[] { dividend.Currency }.ToList(), true);
                var baseGrossDividend = item.Quantity * Convert.ToDouble(dividend.Rate);

                var debit = new Journal(account, "dividend_disbursement", valueDate)
                {
                    Source = "dividend",
                    Fund = item.Fund,
                    Quantity = item.Quantity,
                    FxCurrency = dividend.Currency,
                    Symbol = dividend.Symbol,
                    SecurityId = -1,
                    FxRate = Convert.ToDouble(dividend.FxRate),
                    StartPrice = 0,
                    EndPrice = 0,
                    Value = baseGrossDividend,
                    CreditDebit = env.DebitOrCredit(account, baseGrossDividend),
                };

                journals.Add(debit);
            }

            if (!preview && journals.Count() > 0)
            {
                env.CollectData(journals);
            }

            var result = journals.Select(x => new
            {
                Source = x.Source,
                Fund = x.Fund,
                Quantity = x.Quantity,
                FxCurrency = x.FxCurrency,
                Symbol = x.Symbol,
                SecurityId = x.SecurityId,
                FxRate = x.FxRate,
                StartPrice = x.StartPrice,
                EndPrice = x.EndPrice,
                Value = x.Value,
                CreditDebit = x.CreditDebit,
                AccountName = x.Account.Name,
                Event = x.Event,
                When = x.When
            }).ToList();

            return result;
        }
    
    }
}
