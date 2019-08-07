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
    }
}