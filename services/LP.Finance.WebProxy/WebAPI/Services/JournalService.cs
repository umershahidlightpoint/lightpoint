using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Diagnostics;
using System.Linq;
using System.Net;
using System.Text;
using LP.Finance.Common;
using LP.Finance.Common.Dtos;
using LP.Finance.Common.Mappers;
using LP.Finance.Common.Model;
using LP.Finance.Common.Models;
using Newtonsoft.Json;
using PostingEngine;
using SqlDAL.Core;

namespace LP.Finance.WebProxy.WebAPI.Services
{
    public class journalStats
    {
        public double totalDebit { get; set; }
        public double totalCredit { get; set; }
    }

    class JournalService : IJournalService
    {
        private static readonly string
            connectionString = ConfigurationManager.ConnectionStrings["FinanceDB"].ToString();

        private static readonly NLog.Logger Logger = NLog.LogManager.GetCurrentClassLogger();

        public SqlHelper sqlHelper = new SqlHelper(connectionString);
        private readonly EntityMapper mapper = new EntityMapper();
        private static readonly string allocationsURL = "/api/allocation?period=ITD";

        public object Data(string symbol, int pageNumber, int pageSize, string sortColumn = "id",
            string sortDirection = "asc", int accountId = 0, int value = 0)
        {
            dynamic result = JsonConvert.DeserializeObject("{}");

            switch (symbol)
            {
                case "ALL":
                    result = AllData(pageNumber, pageSize, sortColumn, sortDirection, accountId, value);
                    Utils.SaveAsync(result, "journal_for_ui");
                    break;

                default:
                    result = Only(symbol);
                    break;
            }

            return result;
        }

        private object AllData(int pageNumber, int pageSize, string sortColum = "id", string sortDirection = "asc",
            int accountId = 0, int value = 0)
        {
            try
            {
                // Get the Data, We will Get the Results Later
                var transactionResults = Utils.GetWebApiData(allocationsURL);

                dynamic postingEngine = new PostingEngineService().GetProgress();

                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                journalStats journalStats = new journalStats();
                bool whereAdded = false;

                // Depending on Type
                var query = $@"select 
                        d.debit,
                        d.credit, 
                        abs(d.debit) - abs(d.credit) as balance,
                        d.[id],
                        d.[account_id],
                        d.[fund],
                        d.[symbol] as Symbol,
                        d.[security_id],
                        d.AccountCategory,
                        d.AccountType,
                        d.accountName,
                        d.accountDescription,
                        d.[value],
                        d.[source],
                        d.[when],
                        d.[event],
                        d.[start_price],
                        d.[end_price],
                        d.[fxrate],
                        d.modifiable
                        from(
                            SELECT
                                    (CASE 

										WHEN [account_category].[name] in ('Asset', 'Expenses') and value < 0  THEN ABS(value) 
                                        WHEN [account_category].[name] not in ('Asset', 'Expenses') and value > 0  THEN ABS(value) 
										Else 0
										END  ) credit,
                                    (CASE 
										WHEN [account_category].[name] in ('Asset','Expenses') and value > 0  THEN ABS(value) 
                                        WHEN [account_category].[name] not in ('Asset','Expenses') and value < 0  THEN ABS(value) 
										Else 0
										END  ) debit,
                                    [journal].[id],
                                    [account_id],
                                    [fund],
                                    [symbol],
                                    [security_id],
                                    [account_category].[name] as AccountCategory,  
                                    [account_type].[name] as AccountType,  
                                    [account].[name] as accountName,
                                    [account].[description] as accountDescription,
                                    [value],
                                    [source],
                                    [when],
                                    [event],
                                    [start_price],
                                    [end_price],
                                    [fxrate],
                                    (CASE WHEN [journal].[generated_by] = 'user' THEN 'true' else 'false' END  ) modifiable
                                    FROM [journal] with(nolock) 
                        join account with(nolock) on [journal]. [account_id] = account.id 
                        join [account_type] with(nolock) on  [account].account_type_id = [account_type].id
                        join [account_category] with(nolock) on  [account_type].account_category_id = [account_category].id";

                List<SqlParameter> sqlParams = new List<SqlParameter>();
                sqlParams.Add(new SqlParameter("pageNumber", pageNumber));
                sqlParams.Add(new SqlParameter("pageSize", pageSize));

                if (accountId > 0 || value > 0)
                {
                    query = query + "where";
                }

                if (accountId > 0)
                {
                    query = query + "   account.id = @accountId";
                    whereAdded = true;
                    sqlParams.Add(new SqlParameter("accountId", accountId));
                }

                if (value > 0)
                {
                    if (whereAdded)
                    {
                        query = query + " and  [journal].[value] > @value";
                    }
                    else
                    {
                        query = query + "  [journal].[value] > " + @value;
                    }

                    sqlParams.Add(new SqlParameter("@value", @value));
                }


                if (sortColum == "id" && sortDirection == "1")
                {
                    query = query + "  ORDER BY  [journal].[id] asc ";
                }

                if (sortColum == "source" && sortDirection == "1")
                {
                    query = query + "  ORDER BY  [journal].[source] asc ";
                }

                if (sortColum == "source" && sortDirection == "-1")
                {
                    query = query + "  ORDER BY  [journal].[source] desc ";
                }

                if (sortColum == "when" && sortDirection == "1")
                {
                    query = query + "  ORDER BY  [journal].[when] asc ";
                }

                if (sortColum == "when" && sortDirection == "-1")
                {
                    query = query + "  ORDER BY  [journal].[when] desc ";
                }

                query = query + " ) as d ORDER BY  [d].[id] desc";

                if (pageSize > 0)
                {
                    query = query + " OFFSET(@pageNumber -1) * @pageSize ROWS FETCH NEXT @pageSize  ROWS ONLY";
                }


                Console.WriteLine("===");
                Console.WriteLine(query);
                Console.WriteLine("===");

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

                transactionResults.Wait();

                var res = JsonConvert.DeserializeObject<PayLoad>(transactionResults.Result);

                var elements = JsonConvert.DeserializeObject<Transaction[]>(res.payload);
                var dictionary = elements.ToDictionary(i => i.TradeId, i => i);

                foreach (var element in dataTable.Rows)
                {
                    var dataRow = element as DataRow;

                    dataRow["debit"] = Math.Abs(Convert.ToDecimal(dataRow["debit"]));
                }

                HelperFunctions.Join(dataTable, dictionary, "source");

                var metaData = MetaData.ToMetaData(dataTable);

                metaData.Total = dataTable.Rows.Count > 0 ? dataTable.Rows.Count : 0;
//                journalStats.totalCredit =
//                    dataTable.Rows.Count > 0 ? Convert.ToDouble(dataTable.Rows[0]["totalDebit"]) : 0;
//                journalStats.totalDebit = dataTable.Rows.Count > 0
//                    ? Math.Abs(Convert.ToDouble(dataTable.Rows[0]["totalCredit"]))
//                    : 0;

                journalStats.totalCredit = 0;
                journalStats.totalDebit = 0;

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                dynamic json = JsonConvert.DeserializeObject(jsonResult);

                var returnResult = Utils.Wrap(true, json, HttpStatusCode.OK, null, metaData, journalStats);

                return returnResult;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
        }

        public object GetJournal(Guid source)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("source", source.ToString())
            };

            var query = $@"SELECT [journal].[id]
                        ,[account_id] 
						,[account_category_id]
						,[account_category].[name] AS 'account_category'
						,[account_type_id]
						,[account_type].[name] AS 'account_type'
                        ,[value]
                        ,[source]
                        ,[when]
                        ,[fx_currency]
                        ,[fxrate]
                        ,[fund]
                        ,[generated_by]
						,[quantity]
						,[last_modified_on]
						,[symbol]
						,[event]
						,[start_price]
						,[end_price]
						,[credit_debit]
						,[security_id]
						,[comment_id]
						,[is_account_to],
						[comment]
                        FROM [journal]
						LEFT JOIN [journal_comments]
						ON [journal].[comment_id] = [journal_comments].[id] 
						INNER JOIN [account] 
						ON [journal].[account_id] = [account].[id] 
						INNER JOIN [account_type] 
						ON [account].[account_type_id] = [account_type].[id] 
						INNER JOIN [account_category] 
						ON [account_type].[account_category_id] = [account_category].[id]
                        WHERE [journal].[source] = @source";

            List<JournalOutputDto> journal = new List<JournalOutputDto>();
            using (var reader =
                sqlHelper.GetDataReader(query, CommandType.Text, sqlParameters.ToArray(), out var sqlConnection))
            {
                while (reader.Read())
                {
                    journal.Add(mapper.MapJournal(reader));
                }

                reader.Close();
                sqlConnection.Close();
            }

            var payload = new
            {
                journal[0].Source,
                journal[0].When,
                journal[0].FxRate,
                journal[0].Fund,
                journal[0].GeneratedBy,
                journal[0].Quantity,
                journal[0].LastModifiedOn,
                journal[0].Event,
                journal[0].StartPrice,
                journal[0].EndPrice,
                journal[0].SecurityId,
                journal[0].CommentId,
                journal[0].Comment,
                AccountFrom = journal[0]?.AccountFrom ?? (journal.Count > 1 ? journal[1]?.AccountFrom : null),
                AccountTo = journal[0]?.AccountTo ?? (journal.Count > 1 ? journal[1]?.AccountTo : null)
            };

            return Utils.Wrap(true, payload, HttpStatusCode.OK);
        }

        private int? CheckIfAccountExists(string name, SqlHelper sqlHelper)
        {
            var query = $"SELECT id FROM account with(NOLOCK) WHERE name = '{name}'";
            var accountId = (int?) sqlHelper.GetScalarValue(query, CommandType.Text);

            return accountId;
        }

        private int CreateAccount(AccountInputDto account, SqlHelper sqlHelper)
        {
            string accountName = account.Description;
            List<SqlParameter> accountParameters = new List<SqlParameter>
            {
                new SqlParameter("name", accountName), new SqlParameter("description", account.Description),
                new SqlParameter("type", account.Type)
            };

            var accountQuery = $@"INSERT INTO [account]
                        ([name]
                        ,[description]
                        ,[account_type_id])
                        VALUES
                        (@name
                        ,@description
                        ,@type)
                        SELECT SCOPE_IDENTITY() AS 'Identity'";

            sqlHelper.Insert(accountQuery, CommandType.Text, accountParameters.ToArray(), out int accountId);

            return accountId;
        }

        private int CreateIfAccountNotPresent(string name, int accountTypeId, SqlHelper sqlHelper)
        {
            var accountId = CheckIfAccountExists(name, sqlHelper);
            if (accountId.HasValue)
            {
                return accountId.Value;
            }

            AccountInputDto accountInputDto = new AccountInputDto {Description = name, Type = accountTypeId};
            var id = CreateAccount(accountInputDto, sqlHelper);

            return id;
        }

        public object AddJournal(JournalInputDto journal)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);
            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var commentsId = InsertJournalComment(journal, sqlHelper);
                var fxCurrency = GetBaseCurrency();

                var accountsName = GetAccountsName(journal);
                var accountToName = accountsName.Item1;
                var accountFromName = accountsName.Item2;

                journal.AccountTo.AccountId =
                    CreateIfAccountNotPresent(accountToName, journal.AccountTo.AccountTypeId, sqlHelper);
                if (!journal.AccountFrom.AccountCategory.ToLowerInvariant().Equals("dummy"))
                {
                    journal.AccountFrom.AccountId =
                        CreateIfAccountNotPresent(accountFromName, journal.AccountFrom.AccountTypeId, sqlHelper);
                }

                var accountToValue = journal.Value;
                var source = Guid.NewGuid().ToString().ToLower();
                var fxRate = "1.000000000";
                var generatedBy = "user";
                var quantity = 0;
                var lastModifiedOn = DateTime.Now.ToString("yyyy-MM-dd");
                var symbol = string.IsNullOrWhiteSpace(journal.AccountTo.AccountSymbol)
                    ? ""
                    : journal.AccountTo.AccountSymbol;
                var eventType = "manual";
                var startPrice = 0;
                var endPrice = 0;
                var securityId = -1;

                var query = $@"INSERT INTO [journal]
                                    ([account_id], [value], [source], [when], [fx_currency], [fxrate]
                                    ,[fund], [generated_by], [quantity], [last_modified_on]
                                    ,[symbol], [event], [start_price], [end_price], [credit_debit]
                                    ,[security_id], [comment_id], [is_account_to])
                                    VALUES
                                    (@accountId, @value, @source, @when, @fxCurrency, @fxRate
                                    ,@fund, @generatedBy, @quantity, @lastModifiedOn
                                    ,@symbol, @eventType, @startPrice, @endPrice, @entryType
                                    ,@securityId, @commentsId, @isAccountTo)
                                    SELECT SCOPE_IDENTITY() AS 'Identity'";

                if (!journal.ContraEntryMode)
                {
                    var journalsValue = GetJournalsValue(journal);

                    accountToValue = journalsValue.Item1;
                    var accountFromValue = journal.AccountFrom.AccountCategoryId == 0
                        ? accountToValue * -1
                        : journalsValue.Item2;

                    List<SqlParameter> accountFromParameters = new List<SqlParameter>
                    {
                        new SqlParameter("accountId", journal.AccountFrom.AccountId),
                        new SqlParameter("value", accountFromValue),
                        new SqlParameter("source", source),
                        new SqlParameter("when", journal.AsOf),
                        new SqlParameter("fxCurrency", fxCurrency),
                        new SqlParameter("fxRate", fxRate),
                        new SqlParameter("fund", journal.Fund),
                        new SqlParameter("generatedBy", generatedBy),
                        new SqlParameter("quantity", quantity),
                        new SqlParameter("lastModifiedOn", lastModifiedOn),
                        new SqlParameter("symbol", journal.AccountFrom.AccountSymbol),
                        new SqlParameter("eventType", eventType),
                        new SqlParameter("startPrice", startPrice),
                        new SqlParameter("endPrice", endPrice),
                        new SqlParameter("entryType", journal.AccountFrom.EntryType),
                        new SqlParameter("securityId", securityId),
                        new SqlParameter("commentsId", commentsId),
                        new SqlParameter("isAccountTo", Convert.ToInt32(0))
                    };

                    sqlHelper.Insert(query, CommandType.Text, accountFromParameters.ToArray(),
                        out int fromJournalId);

                    SqlParameter[] fromJournalParameters = {new SqlParameter("journalId", fromJournalId)};
                    sqlHelper.Insert("SyncManualJournal", CommandType.StoredProcedure, fromJournalParameters);
                }

                List<SqlParameter> accountToParameters = new List<SqlParameter>
                {
                    new SqlParameter("accountId", journal.AccountTo.AccountId),
                    new SqlParameter("value", accountToValue),
                    new SqlParameter("source", source),
                    new SqlParameter("when", journal.AsOf),
                    new SqlParameter("fxCurrency", fxCurrency),
                    new SqlParameter("fxRate", fxRate),
                    new SqlParameter("fund", journal.Fund),
                    new SqlParameter("generatedBy", generatedBy),
                    new SqlParameter("quantity", quantity),
                    new SqlParameter("lastModifiedOn", lastModifiedOn),
                    new SqlParameter("symbol", journal.AccountTo.AccountSymbol),
                    new SqlParameter("eventType", eventType),
                    new SqlParameter("startPrice", startPrice),
                    new SqlParameter("endPrice", endPrice),
                    new SqlParameter("entryType", journal.AccountTo.EntryType),
                    new SqlParameter("securityId", securityId),
                    new SqlParameter("commentsId", commentsId),
                    new SqlParameter("isAccountTo", 1)
                };

                sqlHelper.Insert(query, CommandType.Text, accountToParameters.ToArray(), out int toJournalId);

                SqlParameter[] toJournalParameters = {new SqlParameter("journalId", toJournalId)};
                sqlHelper.Insert("SyncManualJournal", CommandType.StoredProcedure, toJournalParameters);

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();

                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");

                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        private Tuple<double, double> GetJournalsValue(JournalInputDto journal)
        {
            var accountTo = new Account
            {
                Type = new AccountType
                {
                    Category = new AccountCategory
                    {
                        Id = journal.AccountTo.AccountCategoryId
                    }
                }
            };
            var accountFrom = new Account
            {
                Type = new AccountType
                {
                    Category = new AccountCategory
                    {
                        Id = journal.AccountFrom.AccountCategoryId
                    }
                }
            };
            double accountToValue;
            double accountFromValue;

            if (journal.AccountTo.EntryType.Equals("debit"))
            {
                accountToValue = SignedValue(accountTo, accountFrom, true, journal.Value);
                accountFromValue = SignedValue(accountTo, accountFrom, false, journal.Value);
            }
            else
            {
                accountFromValue = SignedValue(accountFrom, accountTo, true, journal.Value);
                accountToValue = SignedValue(accountFrom, accountTo, false, journal.Value);
            }

            return new Tuple<double, double>(accountToValue, accountFromValue);
        }

        /// <summary>
        /// Determine how to set the Value of the Journal, this will be based on the 
        /// </summary>
        /// <param name="fromAccount">The account from where the flow will start</param>
        /// <param name="toAccount">The account to where the flow will end</param>
        /// <param name="debit">Is this from the perspective of the debit account</param>
        /// <param name="value">The value to be posted</param>
        /// <returns>The correct signed value</returns>
        public double SignedValue(Account fromAccount, Account toAccount, bool debit, double value)
        {
            if (debit)
                return value;

            if (fromAccount.Type.Category.Id == toAccount.Type.Category.Id)
            {
                return value * -1;
            }

            if (fromAccount.Type.Category.Id == AccountCategory.AC_ASSET)
            {
                switch (toAccount.Type.Category.Id)
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

            if (fromAccount.Type.Category.Id == AccountCategory.AC_LIABILITY)
            {
                switch (toAccount.Type.Category.Id)
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

            if (fromAccount.Type.Category.Id == AccountCategory.AC_REVENUES)
            {
                switch (toAccount.Type.Category.Id)
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

            if (fromAccount.Type.Category.Id == AccountCategory.AC_EQUITY)
            {
                switch (toAccount.Type.Category.Id)
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

            if (fromAccount.Type.Category.Id == AccountCategory.AC_EXPENCES)
            {
                switch (toAccount.Type.Category.Id)
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

        private string GetBaseCurrency()
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            var query = $@"SELECT TOP (1) [currency_code]
                        FROM [settings]";

            var result = sqlHelper.GetScalarValue(query, CommandType.Text, null);

            return result != null ? result.ToString() : "USD";
        }

        private int InsertJournalComment(JournalInputDto journal, SqlHelper sqlHelper)
        {
            List<SqlParameter> journalCommentsParameters = new List<SqlParameter>
            {
                new SqlParameter("createdBy", "John Smith"),
                new SqlParameter("createdDate", DateTime.Now.ToString("MM-dd-yyyy")),
                new SqlParameter("comment", journal.Comments)
            };

            var commentsQuery = $@"INSERT INTO [journal_comments]
                            ([created_by], [created_date], [comment])
                            VALUES
                            (@createdBy, @createdDate, @comment)
                            SELECT SCOPE_IDENTITY() AS 'Identity'";

            sqlHelper.Insert(commentsQuery, CommandType.Text, journalCommentsParameters.ToArray(),
                out int commentsId);

            return commentsId;
        }

        public object UpdateJournal(Guid source, JournalInputDto journal)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            if (!IsModifiable(source))
            {
                return Utils.Wrap(false, null, HttpStatusCode.OK, "System Generated Journals are not Editable");
            }

            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                UpdateJournalComment(journal, sqlHelper);
                var fxCurrency = GetBaseCurrency();

                var accountsName = GetAccountsName(journal);
                var accountToName = accountsName.Item1;
                var accountFromName = accountsName.Item2;

                journal.AccountTo.AccountId =
                    CreateIfAccountNotPresent(accountToName, journal.AccountTo.AccountTypeId, sqlHelper);
                if (!journal.AccountFrom.AccountCategory.ToLowerInvariant().Equals("dummy"))
                {
                    journal.AccountFrom.AccountId =
                        CreateIfAccountNotPresent(accountFromName, journal.AccountFrom.AccountTypeId, sqlHelper);
                }

                var accountToValue = journal.Value;
                var lastModifiedOn = DateTime.Now.ToString("yyyy-MM-dd");
                var symbol = string.IsNullOrWhiteSpace(journal.AccountTo.AccountSymbol)
                    ? ""
                    : journal.AccountTo.AccountSymbol;

                var journalQuery = $@"UPDATE [journal]
                            SET [account_id] = @accountId
                            ,[value] = @value
                            ,[when] = @when
                            ,[fx_currency] = @fxCurrency
                            ,[fund] = @fund
                            ,[last_modified_on] = @lastModifiedOn
                            ,[symbol] = @symbol
                            ,[credit_debit] = @entryType
                            WHERE [journal].[source] = @source AND [journal].[is_account_to] = @isAccountTo";

                if (!journal.ContraEntryMode)
                {
                    var journalsValue = GetJournalsValue(journal);

                    accountToValue = journalsValue.Item1;
                    var accountFromValue = journal.AccountFrom.AccountCategoryId == 0
                        ? accountToValue * -1
                        : journalsValue.Item2;

                    List<SqlParameter> accountFromParameters = new List<SqlParameter>
                    {
                        new SqlParameter("accountId", journal.AccountFrom.AccountId),
                        new SqlParameter("value", accountFromValue),
                        new SqlParameter("when", journal.AsOf),
                        new SqlParameter("fxCurrency", fxCurrency),
                        new SqlParameter("fund", journal.Fund),
                        new SqlParameter("lastModifiedOn", lastModifiedOn),
                        new SqlParameter("symbol", journal.AccountFrom.AccountSymbol),
                        new SqlParameter("entryType", journal.AccountFrom.EntryType),
                        new SqlParameter("source", source.ToString()),
                        new SqlParameter("isAccountTo", Convert.ToInt32(0))
                    };

                    sqlHelper.Update(journalQuery, CommandType.Text, accountFromParameters.ToArray());

                    SqlParameter[] fromJournalParameters =
                        {new SqlParameter("journalId", journal.AccountFrom.JournalId)};
                    sqlHelper.Update("UpdateManualJournal", CommandType.StoredProcedure, fromJournalParameters);
                }

                List<SqlParameter> accountToParameters = new List<SqlParameter>
                {
                    new SqlParameter("accountId", journal.AccountTo.AccountId),
                    new SqlParameter("value", accountToValue),
                    new SqlParameter("when", journal.AsOf),
                    new SqlParameter("fxCurrency", fxCurrency),
                    new SqlParameter("fund", journal.Fund),
                    new SqlParameter("lastModifiedOn", lastModifiedOn),
                    new SqlParameter("symbol", journal.AccountTo.AccountSymbol),
                    new SqlParameter("entryType", journal.AccountTo.EntryType),
                    new SqlParameter("source", source.ToString()),
                    new SqlParameter("isAccountTo", 1)
                };

                sqlHelper.Update(journalQuery, CommandType.Text, accountToParameters.ToArray());

                SqlParameter[] toJournalParameters = {new SqlParameter("journalId", journal.AccountTo.JournalId)};
                sqlHelper.Update("UpdateManualJournal", CommandType.StoredProcedure, toJournalParameters);

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();

                Console.WriteLine($"SQL Rollback Transaction Exception: {ex}");

                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        private Tuple<string, string> GetAccountsName(JournalInputDto journal)
        {
            List<string> accountToNameList = new List<string>();
            List<string> accountFromNameList = new List<string>();

            accountToNameList.Add(journal.AccountTo.AccountType);
            accountToNameList.Add(journal.AccountTo.AccountSymbol);
            accountToNameList.Add(journal.AccountTo.AccountCurrency);

            accountFromNameList.Add(journal.AccountFrom.AccountType);
            accountFromNameList.Add(journal.AccountFrom.AccountSymbol);
            accountFromNameList.Add(journal.AccountFrom.AccountCurrency);

            string accountToName = string.Join("-", accountToNameList.Select(x => x));
            string accountFromName = string.Join("-", accountFromNameList.Select(x => x));

            return new Tuple<string, string>(accountToName, accountFromName);
        }

        private void UpdateJournalComment(JournalInputDto journal, SqlHelper sqlHelper)
        {
            List<SqlParameter> journalCommentsParameters = new List<SqlParameter>
            {
                new SqlParameter("commentId", journal.CommentId),
                new SqlParameter("lastUpdatedBy", "John Smith"),
                new SqlParameter("lastUpdatedDate", DateTime.Now.ToString("MM-dd-yyyy")),
                new SqlParameter("comment", journal.Comments)
            };

            var commentsQuery = $@"UPDATE [dbo].[journal_comments]
                                SET [last_updated_by] = @lastUpdatedBy
                                ,[last_updated_date] = @lastUpdatedDate
                                ,[comment] = @comment
                                WHERE [journal_comments].[id] = @commentId";

            sqlHelper.Update(commentsQuery, CommandType.Text, journalCommentsParameters.ToArray());
        }

        public object DeleteJournal(Guid source)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            if (!IsModifiable(source))
            {
                return Utils.Wrap(false, null, HttpStatusCode.OK, "System Generated Journals are not Editable");
            }

            try
            {
                sqlHelper.VerifyConnection();
                sqlHelper.SqlBeginTransaction();

                var commentId = GetJournalCommentId(source);

                List<SqlParameter> journalParameters = new List<SqlParameter>
                {
                    new SqlParameter("source", source.ToString())
                };

                List<SqlParameter> currentJournalParameters = new List<SqlParameter>
                {
                    new SqlParameter("source", source.ToString())
                };

                var journalQuery = $@"DELETE FROM [journal]
                                    WHERE [journal].[source] = @source";

                var currentJournalQuery = $@"DELETE FROM [current_journal_full]
                                    WHERE [current_journal_full].[source] = @source";

                List<SqlParameter> commentParameters = new List<SqlParameter>
                {
                    new SqlParameter("commentId", commentId)
                };

                var commentQuery = $@"DELETE FROM [journal_comments] 
                                    WHERE [journal_comments].[id] = @commentId";

                sqlHelper.Delete(journalQuery, CommandType.Text, journalParameters.ToArray());
                sqlHelper.Delete(currentJournalQuery, CommandType.Text, currentJournalParameters.ToArray());
                sqlHelper.Delete(commentQuery, CommandType.Text, commentParameters.ToArray());

                sqlHelper.SqlCommitTransaction();
                sqlHelper.CloseConnection();
            }
            catch (Exception ex)
            {
                sqlHelper.SqlRollbackTransaction();
                sqlHelper.CloseConnection();
                Console.WriteLine($"SQL Exception: {ex}");
                return Utils.Wrap(false);
            }

            return Utils.Wrap(true);
        }

        private int GetJournalCommentId(Guid source)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("source", source.ToString())
            };

            var query = $@"SELECT TOP (1) 
                        [comment_id]
                        FROM [journal] 
                        WHERE [journal].[source] = @source";

            return Convert.ToInt32(sqlHelper.GetScalarValue(query, CommandType.Text, sqlParameters.ToArray()));
        }

        private bool IsModifiable(Guid source)
        {
            SqlHelper sqlHelper = new SqlHelper(connectionString);

            List<SqlParameter> sqlParameters = new List<SqlParameter>
            {
                new SqlParameter("source", source.ToString())
            };

            var query = $@"SELECT
                        CASE WHEN [journal].[generated_by] = 'user'
	                    THEN 'true'
	                    ELSE 'false'
	                    END AS 'is_modifiable'
                        FROM [journal]
	                    WHERE [journal].[source] = @source";

            var modifiable = sqlHelper.GetScalarValue(query, CommandType.Text, sqlParameters.ToArray());

            return Convert.ToBoolean(modifiable);
        }

        public object GetCostBasisReport(DateTime? date, string symbol, string fund)
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();
                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                var businessDate = System.DateTime.Now.PrevBusinessDate();

                if (date.HasValue)
                    businessDate = date.Value.Date;

                List<SqlParameter> sqlParams = new List<SqlParameter>();

                var query = $@"select * from vwCostBasis";


                if (date.HasValue)
                {
                    sqlParams.Add(new SqlParameter("date", date));
                    query = query + " where business_date = @date";
                }

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());
                var reportObject = Utils.Wrap(true, dataTable, HttpStatusCode.OK);

                return reportObject;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
        }

        public object GetCostBasisChart(string symbol)
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();

                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                List<SqlParameter> sqlParams = new List<SqlParameter>
                {
                    new SqlParameter("symbol", symbol)
                };

                var query = $@"select * from vwCostBasis
                        where symbol = @symbol 
                        order BY business_date asc";

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());
                var reportObject = Utils.Wrap(true, dataTable, HttpStatusCode.OK);

                return reportObject;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
        }

        public object GetTaxLotReport(DateTime? from, DateTime? to, string fund, string symbol, bool side = true)
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();
                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                bool whereAdded = false;

                List<SqlParameter> sqlParams = new List<SqlParameter>();

                var businessDate = System.DateTime.Now.PrevBusinessDate();

                if (from.HasValue)
                    businessDate = from.Value.Date;

                var query = $@"SELECT * FROM fnTaxLotReport('{businessDate.ToString("yyyy-MM-dd")}') as tls";

                if (!string.IsNullOrEmpty(symbol))
                {
                    sqlParams.Add(new SqlParameter("symbol", symbol));
                    if (whereAdded == true)
                    {
                        query += " AND tls.[symbol] LIKE '%' +@symbol+'%'";
                    }
                    else
                    {
                        query = query + " WHERE tls.[symbol] LIKE '%' +@symbol+'%'";
                    }
                }

                if (side)
                {
                    sqlParams.Add(new SqlParameter("side", side));
                    query += string.IsNullOrEmpty(symbol)
                        ? " WHERE tls.[side] = 'BUY' OR tls.[side] = 'SHORT'"
                        : " AND (tls.[side] = 'BUY' OR tls.[side] = 'SHORT')";
                }

                query += " ORDER BY symbol, trade_date ASC";

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());
                var reportObject = Utils.Wrap(true, dataTable, HttpStatusCode.OK);

                return reportObject;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(true, null, HttpStatusCode.InternalServerError);
            }
        }

        public object GetTaxLotsReport(DateTime? from = null, DateTime? to = null, string fund = "")
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();
                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                var query = $@"select *, (cost_basis - trade_price)*quantity as realized_pnl from tax_lot";

                List<SqlParameter> sqlParams = new List<SqlParameter>();

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

                var reportObject = Utils.Wrap(true, dataTable, HttpStatusCode.OK);

                return reportObject;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
        }

        public object GetClosingTaxLots(string orderid = null, DateTime? to = null)
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();
                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                if (!string.IsNullOrEmpty(orderid) && to.HasValue)
                {
                    var query =
                        $@"select * from tax_lot where open_lot_id='{orderid}' and active_flag = 1 and trade_date <='{to?.ToString("yyyy-MM-dd")}'";
                    List<SqlParameter> sqlParams = new List<SqlParameter>();
                    var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());
                    var reportObject = Utils.Wrap(true, dataTable, HttpStatusCode.OK);
                    return reportObject;
                }
                else
                {
                    var query =
                        $@"select * from tax_lot where active_flag = 1";
                    var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
                    var reportObject = Utils.Wrap(true, dataTable, HttpStatusCode.OK);
                    return reportObject;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object GetReconReport(String source, DateTime? date, string fund)
        {
            var query = "DayPnlReconcile";

            if (!String.IsNullOrEmpty(source))
            {
                if (source.Equals("exposure"))
                {
                    query = "BookmonReconcile";
                }
                else if (source.Equals("fundadmin"))
                {
                    query = "FundAdminReconcile";
                }
            }

            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();
                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                var businessDate = System.DateTime.Now.PrevBusinessDate();
                if (date.HasValue)
                    businessDate = date.Value.Date;

                List<SqlParameter> sqlParams = new List<SqlParameter>();
                sqlParams.Add(new SqlParameter("@businessDate", businessDate));

                var dataTable = sqlHelper.GetDataTables(query, CommandType.StoredProcedure, sqlParams.ToArray());
                var reportObject = Utils.Wrap(true, dataTable, HttpStatusCode.OK);

                return reportObject;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
        }

        public object GetTrialBalanceReport(DateTime? from = null, DateTime? to = null, string fund = "")
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();

                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                bool whereAdded = false;

                var query =
                    $@"select account.name as AccountName, account_category.name as AccountCategory, account_type.name as AccountType,
                        summary.Debit, summary.Credit,
                        abs(summary.Debit) - abs(summary.Credit) as Balance,
                        (SUM(summary.Debit) over()) as DebitSum, 
                        (SUM(summary.Credit) over()) as CreditSum
                        from ( 
                            select account_id, 
                            sum(debit) Debit,
                            sum(credit) Credit
				            from vwJournal with(nolock) ";

                List<SqlParameter> sqlParams = new List<SqlParameter>();

                if (from.HasValue)
                {
                    query = query + " where vwJournal.[when] >= @from";
                    whereAdded = true;
                    sqlParams.Add(new SqlParameter("from", from));
                }

                if (to.HasValue)
                {
                    if (whereAdded)
                    {
                        query = query + " and vwJournal.[when] <= @to";
                        sqlParams.Add(new SqlParameter("to", to));
                    }
                    else
                    {
                        query = query + " where vwJournal.[when] <= @to";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("to", to));
                    }
                }

                if (fund != "ALL")
                {
                    if (whereAdded)
                    {
                        query = query + " and vwJournal.[fund] = @fund";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("fund", fund));
                    }
                    else
                    {
                        query = query + " where vwJournal.[fund] = @fund";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("fund", fund));
                    }
                }

                query = query +
                        "  group by vwJournal.account_id ) summary " +
                        "right join account on summary.account_id = account.id " +
                        "left join account_type on account_type.id = account.account_type_id " +
                        "right join account_category on account_category.id = account_type.account_category_id ";

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

                journalStats stats = new journalStats();
                List<TrialBalanceReportOutPutDto> trialBalanceReport = new List<TrialBalanceReportOutPutDto>();

                stats.totalDebit = dataTable.Rows[0]["DebitSum"] != DBNull.Value
                    ? Math.Abs(Convert.ToDouble(dataTable.Rows[0]["DebitSum"]))
                    : 0;
                stats.totalCredit = dataTable.Rows[0]["CreditSum"] != DBNull.Value
                    ? Convert.ToDouble(dataTable.Rows[0]["CreditSum"])
                    : 0;

                foreach (DataRow row in dataTable.Rows)
                {
                    TrialBalanceReportOutPutDto trialBalance = new TrialBalanceReportOutPutDto();
                    trialBalance.AccountCategory =
                        row["AccountCategory"] != DBNull.Value ? (string) row["AccountCategory"] : "";
                    trialBalance.AccountType = row["AccountType"] != DBNull.Value ? (string) row["AccountType"] : "";
                    trialBalance.AccountName = row["AccountName"] != DBNull.Value ? (string) row["AccountName"] : "";
                    trialBalance.Credit = GetDecimal(row["Credit"]);
                    trialBalance.Debit = GetDecimal(row["Debit"]);
                    trialBalance.Balance = GetDecimal(row["Balance"], false);

                    if (trialBalance.Credit.HasValue)
                    {
                        trialBalance.CreditPercentage = stats.totalCredit > 0
                            ? Math.Abs((trialBalance.Credit.Value / Convert.ToInt64(stats.totalCredit)) * 100)
                            : 0;
                    }

                    if (trialBalance.Debit.HasValue)
                    {
                        trialBalance.DebitPercentage = stats.totalDebit > 0
                            ? Math.Abs((trialBalance.Debit.Value / Convert.ToInt64(stats.totalCredit)) * 100)
                            : 0;
                    }

                    trialBalanceReport.Add(trialBalance);
                }

                return Utils.Wrap(true, trialBalanceReport, HttpStatusCode.OK, null, null, stats);
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
        }

        private decimal? GetDecimal(object o, bool absValue = true)
        {
            if (!absValue)
            {
                return o == DBNull.Value ? 0 : Convert.ToDecimal(o);
            }

            return o == DBNull.Value ? 0 : Math.Abs(Convert.ToDecimal(o));
        }

        public object GetAccountingTileData(DateTime? from, DateTime? to, string fund)
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();

                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                bool whereAdded = false;
                var query = $@"select fund,account.name as AccountName,  
                        summary.Debit, summary.Credit
                        from ( 
                        select fund,account_id, 
                        sum( (CASE WHEN value < 0 THEN value else 0 END  )) Debit,
                        sum( (CASE WHEN value > 0 THEN value else 0 END  )) Credit
				        from journal with(nolock)";

                List<SqlParameter> sqlParams = new List<SqlParameter>();

                if (from.HasValue)
                {
                    query = query + " where journal.[when] >= @from";
                    whereAdded = true;
                    sqlParams.Add(new SqlParameter("from", from));
                }

                if (to.HasValue)
                {
                    if (whereAdded)
                    {
                        query = query + " and journal.[when] <= @to";
                        sqlParams.Add(new SqlParameter("to", to));
                    }
                    else
                    {
                        query = query + " where journal.[when] <= @to";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("to", to));
                    }
                }

                if (fund != "ALL")
                {
                    if (whereAdded)
                    {
                        query = query + " and journal.[fund] = @fund";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("fund", fund));
                    }
                    else
                    {
                        query = query + " where journal.[fund] = @fund";
                        whereAdded = true;
                        sqlParams.Add(new SqlParameter("fund", fund));
                    }
                }

                query = query +
                        "  group by fund,journal.account_id ) summary right join  account on summary.account_id= account.id ";
                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sqlParams.ToArray());

                List<TrialBalanceTileOutputDto> trialBalanceList = new List<TrialBalanceTileOutputDto>();

                foreach (DataRow row in dataTable.Rows)
                {
                    TrialBalanceTileOutputDto trialBalance = new TrialBalanceTileOutputDto();
                    AccountListTileOutputDto accountsList = new AccountListTileOutputDto();
                    trialBalance.FundName = (row["fund"] != DBNull.Value && (string) row["fund"] != "")
                        ? (string) row["fund"]
                        : "N/A";
                    trialBalance.FundCredit = row["Credit"] == DBNull.Value ? 0 : Convert.ToDecimal(row["Credit"]);
                    ;
                    trialBalance.FundDebit =
                        row["Debit"] == DBNull.Value ? 0 : Math.Abs(Convert.ToDecimal(row["Debit"]));
                    trialBalance.FundBalance = trialBalance.FundCredit.Value - trialBalance.FundDebit.Value;

                    accountsList.AccountName = (string) row["AccountName"];
                    accountsList.AccountCredit = row["Credit"] == DBNull.Value ? 0 : Convert.ToDecimal(row["Credit"]);
                    accountsList.AccountDebit =
                        row["Debit"] == DBNull.Value ? 0 : Math.Abs(Convert.ToDecimal(row["Debit"]));
                    accountsList.AccountBalance = accountsList.AccountDebit.Value - accountsList.AccountCredit.Value;
                    trialBalance.Accounts = new List<AccountListTileOutputDto>();
                    trialBalance.Accounts.Add(accountsList);
                    trialBalanceList.Add(trialBalance);
                }

                var tileData = trialBalanceList.GroupBy(x => x.FundName).Select(y => new TrialBalanceTileOutputDto
                {
                    FundName = y.Key,
                    FundCredit = y.Sum(z => z.FundCredit),
                    FundDebit = y.Sum(z => z.FundDebit),
                    FundBalance = y.Sum(z => z.FundBalance),
                    Accounts = y.SelectMany(z => z.Accounts).ToList()
                }).ToList();

                var tileObject = Utils.Wrap(true, tileData, HttpStatusCode.OK);
                return tileObject;
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError);
            }
        }

        private object Only(string orderId)
        {
            var content = "{}";

            var date = DateTime.Now.Date;

            while (date.DayOfWeek == DayOfWeek.Saturday || date.DayOfWeek == DayOfWeek.Sunday)
                date = date.AddDays(-1);

            var startdate = date.ToString("MM-dd-yyyy") + " 09:00";
            var enddate = date.ToString("MM-dd-yyyy") + " 16:30";

            var query =
                $@"select LpOrderId, Action, Symbol, Side, Quantity, SecurityType, CustodianCode, ExecutionBroker, TradeId, Fund, PMCode, PortfolioCode, TradePrice, TradeDate, Trader, Status, Commission, Fees, NetMoney, UpdatedOn from Trade nolock
                        where LPOrderId='{orderId}'
                        order by UpdatedOn desc";

            using (var con = new SqlConnection(connectionString))
            {
                var sda = new SqlDataAdapter(query, con);
                var dataTable = new DataTable();

                con.Open();
                sda.Fill(dataTable);
                con.Close();

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                content = jsonResult;

                Console.WriteLine("Done");
            }

            dynamic json = JsonConvert.DeserializeObject(content);

            return json;
        }

        public object GetSummarizedJournal(List<GridLayoutDto> layout)
        {
            try
            {
                var groups = layout.Where(x => x.rowGroupIndex.HasValue).OrderBy(x => x.rowGroupIndex).ToList();

                if (groups.Count > 0)
                {
                    var map = new Dictionary<string, string>();

                    map.Add("fund", "fund");
                    map.Add("AccountCategory", "[account_category].[name] as AccountCategory");
                    map.Add("AccountType", "[account_type].[name] as AccountType");
                    map.Add("accountName", "[account].[name] as accountName");
                    map.Add("when", "[when]");
                    map.Add("Quantity", "Quantity");
                    map.Add("Symbol", "Symbol");

                    StringBuilder dynamicMainSelect = new StringBuilder();
                    StringBuilder dynamicInnerSelect = new StringBuilder();
                    StringBuilder dynamicGrouping = new StringBuilder();

                    foreach (var item in groups)
                    {
                        dynamicMainSelect.Append("d.[").Append(item.colId).Append("],");
                        dynamicInnerSelect.Append(map[item.colId]).Append(",");
                        dynamicGrouping.Append("d.[").Append(item.colId).Append("],");
                    }

                    string mainSelect = dynamicMainSelect.ToString();
                    string innerSelect = dynamicInnerSelect.ToString();
                    string grouping = dynamicGrouping.ToString().TrimEnd(',');

                    var query = $@"select 
                        count(*) as count,
                        {mainSelect}
						sum(d.debit) as debitSum,
                        sum(d.credit) as creditSum
                        from(
                            SELECT
                                    {innerSelect}
                                    (CASE
                                        WHEN[account_category].[name] in ('Asset', 'Expenses') and value < 0  THEN ABS(value)
                                        WHEN[account_category].[name] not in ('Asset', 'Expenses') and value > 0  THEN ABS(value)
                                        Else 0
                                        END) credit,
                                    (CASE
                                        WHEN[account_category].[name] in ('Asset', 'Expenses') and value > 0  THEN ABS(value)
                                        WHEN[account_category].[name] not in ('Asset', 'Expenses') and value < 0  THEN ABS(value)
                                        Else 0
                                        END) debit
                                    FROM[journal] with(nolock)
                        join account with(nolock) on[journal]. [account_id] = account.id
                        join[account_type] with(nolock) on[account].account_type_id = [account_type].id
                        join[account_category] with(nolock) on[account_type].account_category_id = [account_category].id ) as d group by {grouping}";

                    Console.WriteLine(query);

                    var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
                    var metaData = MetaData.ToMetaData(dataTable);

                    foreach (var item in metaData.Columns)
                    {
                        var group = groups.Where(x => x.colId == item.field).FirstOrDefault();
                        if (group != null)
                        {
                            item.colId = item.field;
                            item.rowGroupIndex = group.rowGroupIndex;
                        }
                        else
                        {
                            item.aggFunc = "sum";
                        }
                    }

                    var jsonResult = JsonConvert.SerializeObject(dataTable);
                    dynamic json = JsonConvert.DeserializeObject(jsonResult);
                    var result = Utils.Wrap(true, json, HttpStatusCode.OK, null, metaData);

                    return result;
                }
                else
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Grouping is not Present in this Layout");
                }
            }
            catch (Exception ex)
            {
                return Utils.Wrap(false, null, HttpStatusCode.InternalServerError, "Something Bad Happened!");
            }
        }

        private static int COUNT = 0;

        public object serverSideJournals(ServerRowModel obj)
        {
            var sw = new Stopwatch();
            sw.Start();
            var count = COUNT++;

            Logger.Info($"{count} started serverSideJournals at {DateTime.UtcNow}");
            var viewName = "vwFullJournal";

            try
            {
                journalStats journalStats = new journalStats();

                var sql = ServerSideRowModelHelper.BuildSql(obj, viewName);
                var query = sql.Item1 + " OPTION(MAXDOP 1)";
                Logger.Info("serverSideJournals query {query}", query);
                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sql.Item3.ToArray());
                int lastRow = ServerSideRowModelHelper.GetRowCount(obj, dataTable);
                bool rootNodeGroupOrNoGrouping =
                    ServerSideRowModelHelper.isDoingGroupingByRootNodeOrNoGrouping(obj.rowGroupCols, obj.groupKeys);

                var metaData = MetaData.ToMetaData(dataTable);
                metaData.Total = dataTable.Rows.Count > 0 ? dataTable.Rows.Count : 0;
                metaData.LastRow = lastRow;
                metaData.FooterSum = rootNodeGroupOrNoGrouping;
                journalStats.totalCredit = 0;
                journalStats.totalDebit = 0;

                var jsonResult = JsonConvert.SerializeObject(dataTable);
                dynamic json = JsonConvert.DeserializeObject(jsonResult);

                var returnResult = Utils.Wrap(true, json, HttpStatusCode.OK, sql.Item2, metaData, journalStats);
                sw.Stop();
                Logger.Info($"{count} finished serverSideJournals in {sw.ElapsedMilliseconds} ms");
                return returnResult;
            }
            catch (Exception ex)
            {
                sw.Stop();
                Logger.Error(ex, "serverSideJournals failed after {elapsedTime} ms", sw.ElapsedMilliseconds);
                throw ex;
            }
        }

        public object GetTotalCount(ServerRowModel obj)
        {
            try
            {
                journalStats journalStats = new journalStats();

                var sql = ServerSideRowModelHelper.BuildSql(obj, "vwFullJournal", true);
                var query = $@"select p.debit, p.credit, (abs(p.debit) - abs(p.credit)) as balance from (
                                select sum(t.debit) as debit, sum(t.credit) as credit from (
                                select [AccountCategory], sum(debit) as debit,
                                sum(credit) as credit
                                from vwFullJournal
                                {sql.Item1}
                                group by [AccountCategory]) t ) p OPTION(MAXDOP 4)";

                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, sql.Item3.ToArray());
                var resp = JsonConvert.SerializeObject(dataTable);
                var stats = JsonConvert.DeserializeObject(resp);

                return Utils.Wrap(true, stats, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                throw ex;
            }
        }

        public object AppMetaData(DateTime previousDay, DateTime currentDay)
        {
            try
            {
                SqlConnectionStringBuilder connectionStringBuilder = new SqlConnectionStringBuilder(connectionString);
                string environment = connectionStringBuilder.DataSource;

                var baseCurrency = GetBaseCurrency();

                List<SqlParameter> toParams = new List<SqlParameter>
                {
                    new SqlParameter("previousDay", previousDay),
                };

                var query =
                    $@"SELECT TOP 1 (CASE WHEN[journal].[when] = @previousDay THEN 1 ELSE 0 END) AS 'hasJournalsForPreviousDay' FROM[journal]";
                var dataTable = sqlHelper.GetDataTable(query, CommandType.Text, toParams.ToArray());

                var response = new
                {
                    hasJournalsForPreviousDay = Convert.ToBoolean(dataTable.Rows[0]["hasJournalsForPreviousDay"]),
                    baseCurrency,
                    environment
                };

                return Utils.Wrap(true, response, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                Console.Write(ex);
                throw ex;
            }
        }

        public object GetJournalsMetaData(JournalMetaInputDto obj)
        {
            Logger.Info($"GetJournalsMetaData {obj.GridName}");

            try
            {
                SqlHelper sqlHelper = new SqlHelper(connectionString);

                var filterConfigQuery = $@"SELECT col_name as ColumnName, 
                                        source as Source, 
                                        meta_info as MetaInfo 
                                        from server_side_filter_config where grid_name = '{obj.GridName}'";

                var filterConfigDataTable = sqlHelper.GetDataTable(filterConfigQuery, CommandType.Text);

                var serializedConfig = JsonConvert.SerializeObject(filterConfigDataTable);
                var filters = JsonConvert.DeserializeObject<List<ServerSideFilterConfig>>(serializedConfig);

                var metaInfo = filters.Select(x => x.MetaInfo).FirstOrDefault();

                // Default Value, Just to Ensure that Column Meta Data is returned even if Filters are not Present.
                if (string.IsNullOrEmpty(metaInfo))
                {
                    metaInfo = "vwFullJournal";
                }

                var columnsQuery = $@"SELECT TOP 0 * FROM {metaInfo}";

                var dataTable = sqlHelper.GetDataTable(columnsQuery, CommandType.Text);

                var meta = MetaData.ToMetaData(dataTable);

                var fundRangeQuery = $@"SELECT Year([when]) AS 'Year'
                                    ,[fund]
                                    FROM {metaInfo}
                                    GROUP BY YEAR([when]), [fund]
                                    ORDER BY YEAR([when])";

                var fundRangeDataTable = sqlHelper.GetDataTable(fundRangeQuery, CommandType.Text);

                var fundRangeSerialized = JsonConvert.SerializeObject(fundRangeDataTable);
                var fundRanges = JsonConvert.DeserializeObject(fundRangeSerialized);

                meta.FundsRange = fundRanges;

                var filtersQueries = new List<string>();
                if (filters.Count > 0)
                {
                    for (var i = 0; i < filters.Count; i++)
                    {
                        filtersQueries.Insert(i,
                            $@"SELECT DISTINCT t.{filters[i].ColumnName} FROM {filters[i].Source} t");
                    }

                    meta.Filters = new List<FilterValues>();
                    for (var i = 0; i < filters.Count; i++)
                    {
                        Logger.Info($"Getting Filters for {obj.GridName}::{filtersQueries[i]}");

                        List<object> filterValues;
                        using (var reader =
                            sqlHelper.GetDataReader(filtersQueries[i], CommandType.Text, null,
                                out var sqlConnection))
                        {
                            filterValues = new List<object>();
                            while (reader.Read())
                            {
                                filterValues.Add(reader[filters[i].ColumnName]);
                            }

                            reader.Close();
                            sqlConnection.Close();
                        }

                        meta.Filters.Insert(i,
                            new FilterValues() {ColumnName = filters[i].ColumnName, Values = filterValues});
                    }

                    return Utils.Wrap(true, meta, HttpStatusCode.OK);
                }
                else
                {
                    return Utils.Wrap(true, meta, HttpStatusCode.NotFound);
                }
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                throw;
            }
        }

        public object GetLastJournalPostedDate()
        {
            var query = "select top 1 [when] from journal where [event] != 'manual' order by [when] desc";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
            var serialized = JsonConvert.SerializeObject(dataTable);
            var resp = JsonConvert.DeserializeObject(serialized);

            return Utils.Wrap(true, resp, HttpStatusCode.OK);
        }

        public object GetPeriodJournals(string symbol, DateTime now, string period)
        {
            try
            {
                List<SqlParameter> sqlParams = new List<SqlParameter>();
                sqlParams.Add(new SqlParameter("@Now", now));
                sqlParams.Add(new SqlParameter("@Symbol", symbol));
                sqlParams.Add(new SqlParameter("@Period", period));

                var dataTable =
                    sqlHelper.GetDataTable("PeriodJournals", CommandType.StoredProcedure, sqlParams.ToArray());
                var meta = MetaData.ToMetaData(dataTable);
                var serialized = JsonConvert.SerializeObject(dataTable);
                var data = JsonConvert.DeserializeObject(serialized);

                return Utils.Wrap(true, data, HttpStatusCode.OK, "Journals fetched successfully", meta);
            }

            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object GetValidDates(string columnName, string source)
        {
            var query = $"select distinct {columnName} from {source} order by {columnName} desc";

            var dataTable = sqlHelper.GetDataTable(query, CommandType.Text);
            List<DateTime> dates = new List<DateTime>();
            foreach (DataRow dr in dataTable.Rows)
            {
                dates.Add((DateTime) dr["business_date"]);
            }

            return Utils.Wrap(true, dates, HttpStatusCode.OK);
        }

        public object GetMarketValueAppraisalReport(DateTime? date)
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();
                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                var businessDate = System.DateTime.Now.PrevBusinessDate();

                if (date.HasValue)
                {
                    businessDate = date.Value.Date;
                }

                List<SqlParameter> sqlParams = new List<SqlParameter>();
                sqlParams.Add(new SqlParameter("date", businessDate));
                var dataTable = sqlHelper.GetDataTable("MarketValueAppraisalReport", CommandType.StoredProcedure,
                    sqlParams.ToArray());
                var reportObject = Utils.Wrap(true, dataTable, HttpStatusCode.OK);
                return reportObject;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public object ExcludeTrade(TradeExclusionInputDto trade)
        {
            try
            {
                sqlHelper.VerifyConnection();
                List<SqlParameter> exclusionParams = new List<SqlParameter>
                {
                    new SqlParameter("lpOrderId", trade.LpOrderId),
                    new SqlParameter("reason", string.IsNullOrEmpty(trade.Reason) ? DBNull.Value : (object)trade.Reason)
                };
                var query = $@"INSERT INTO [dbo].[trade_exclusion]
                               ([lporderid]
                               ,[reason])
                         VALUES
                               (@lpOrderId
                               ,@reason)";

                sqlHelper.Insert(query, CommandType.Text, exclusionParams.ToArray());
                sqlHelper.CloseConnection();
                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                sqlHelper.CloseConnection();
            }
        }

        public object ReverseTradeExclusion(TradeExclusionInputDto trade)
        {
            try
            {
                sqlHelper.VerifyConnection();
                List<SqlParameter> exclusionParams = new List<SqlParameter>
                {
                    new SqlParameter("lpOrderId", trade.LpOrderId)
                };
                var query = $@"UPDATE [dbo].[trade_exclusion]
                           SET [exclude] = 'N'
                         WHERE lporderid = @lpOrderId";

                sqlHelper.Update(query, CommandType.Text, exclusionParams.ToArray());
                sqlHelper.CloseConnection();
                return Utils.Wrap(true, null, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                sqlHelper.CloseConnection();
            }
        }

        public object GetDetailPnLToDateReport(DateTime from, DateTime to, string symbol)
        {
            try
            {
                dynamic postingEngine = new PostingEngineService().GetProgress();
                if (postingEngine.IsRunning)
                {
                    return Utils.Wrap(false, null, HttpStatusCode.OK, "Posting Engine is currently Running");
                }

                List<SqlParameter> sqlParams = new List<SqlParameter>()
                {
                    new SqlParameter("From", from),
                    new SqlParameter("Now", to)
                };

                if (!string.IsNullOrWhiteSpace(symbol))
                {
                    sqlParams.Add(new SqlParameter("symbol", symbol));
                }

                var dataTable =
                    sqlHelper.GetDataTable("DetailPnlToDate", CommandType.StoredProcedure, sqlParams.ToArray());

                return Utils.Wrap(true, dataTable, HttpStatusCode.OK);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}