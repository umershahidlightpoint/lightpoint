using System;
using System.Collections.Generic;
using System.Data;
using LP.Finance.Common.Dtos;

namespace LP.Finance.Common.Mappers
{
    public class EntityMapper : IEntityMapper
    {
        public AccountsOutputDto MapAccounts(IDataReader reader)
        {
            var accountsOutputDto = new AccountsOutputDto
            {
                AccountId = Convert.ToInt32(reader["account_id"]),
                AccountName = reader["name"].ToString(),
                Description = reader["description"].ToString(),
                TypeId = Convert.ToInt32(reader["type_id"]),
                Type = reader["type"].ToString(),
                CategoryId = Convert.ToInt32(reader["category_id"]),
                Category = reader["category"].ToString(),
                HasJournal = reader["has_journal"].ToString(),
                CanDeleted = reader["has_journal"].ToString() == "No",
                CanEdited = reader["has_journal"].ToString() == "No"
            };

            return accountsOutputDto;
        }

        public AccountsOutputDto MapThirdPartyMappedAccounts(IDataReader reader)
        {
            var accountsOutputDto = new AccountsOutputDto
            {
                AccountId = Convert.ToInt32(reader["account_id"]),
                AccountName = reader["name"].ToString(),
                Description = reader["description"].ToString(),
                TypeId = Convert.ToInt32(reader["type_id"]),
                Type = reader["type"].ToString(),
                CategoryId = Convert.ToInt32(reader["category_id"]),
                Category = reader["category"].ToString(),
                HasMapping = reader["map_id"] != DBNull.Value,
                ThirdPartyMappedAccounts = reader["map_id"] == DBNull.Value
                    ? new List<MappedAccountsOutputDto>()
                    : new List<MappedAccountsOutputDto>
                    {
                        new MappedAccountsOutputDto
                        {
                            MapId = Convert.ToInt32(reader["map_id"]),
                            ThirdPartyAccountId = Convert.ToInt32(reader["third_party_account_id"]),
                            OrganizationName = reader["organization_name"].ToString(),
                            ThirdPartyAccountName = reader["third_party_account_name"].ToString()
                        }
                    }
            };

            return accountsOutputDto;
        }

        public AccountOutputDto MapAccount(IDataReader reader)
        {
            var accountOutputDto = new AccountOutputDto
            {
                AccountId = Convert.ToInt32(reader["account_id"]),
                AccountName = reader["name"].ToString(),
                Description = reader["description"].ToString(),
                TypeId = Convert.ToInt32(reader["type_id"]),
                Type = reader["type"].ToString(),
                CategoryId = Convert.ToInt32(reader["category_id"]),
                Category = reader["category"].ToString(),
                HasJournal = reader["has_journal"].ToString(),
                CanDeleted = reader["has_journal"].ToString() == "No",
                CanEdited = reader["has_journal"].ToString() == "No",
                Tags = reader["tag_id"] == DBNull.Value
                    ? new List<AccountTagOutputDto>()
                    : new List<AccountTagOutputDto>
                    {
                        new AccountTagOutputDto
                            {Id = Convert.ToInt32(reader["tag_id"]), Value = reader["tag_value"].ToString()}
                    }
            };

            return accountOutputDto;
        }

        public JournalOutputDto MapJournal(IDataReader reader)
        {
            var journalOutputDto = new JournalOutputDto
            {
                Source = reader["source"].ToString(),
                When = reader["when"].ToString(),
                FxCurrency = reader["fx_currency"].ToString(),
                FxRate = Convert.ToDecimal(reader["fxrate"]),
                Fund = reader["fund"].ToString(),
                GeneratedBy = reader["generated_by"].ToString(),
                Quantity = Convert.ToDouble(reader["quantity"]),
                LastModifiedOn = reader["last_modified_on"].ToString(),
                Symbol = reader["symbol"].ToString(),
                Event = reader["event"].ToString(),
                StartPrice = Convert.ToDouble(reader["start_price"]),
                EndPrice = Convert.ToDouble(reader["end_price"]),
                SecurityId = Convert.ToInt32(reader["security_id"]),
                CommentId = Convert.ToInt32(reader["comment_id"]),
                Comment = reader["comment"].ToString(),
                AccountFrom = !Convert.ToBoolean(reader["is_account_to"])
                    ? new JournalAccountOutputDto
                    {
                        JournalId = Convert.ToInt32(reader["id"]),
                        AccountId = Convert.ToInt32(reader["account_id"]),
                        Value = Convert.ToDecimal(reader["value"]),
                        CreditDebit = reader["credit_debit"].ToString()
                    }
                    : null,
                AccountTo = Convert.ToBoolean(reader["is_account_to"])
                    ? new JournalAccountOutputDto
                    {
                        JournalId = Convert.ToInt32(reader["id"]),
                        AccountId = Convert.ToInt32(reader["account_id"]),
                        Value = Convert.ToDecimal(reader["value"]),
                        CreditDebit = reader["credit_debit"].ToString()
                    }
                    : null
            };

            return journalOutputDto;
        }
    }
}