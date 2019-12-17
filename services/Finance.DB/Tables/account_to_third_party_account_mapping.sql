CREATE TABLE [dbo].[account_to_third_party_account_mapping]
(
	[id] INT identity(1,1) NOT NULL PRIMARY KEY,
	[created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL,
	[account_id] INT NOT NULL,
	[third_party_account_id] INT NOT NULL, 
    CONSTRAINT [FK_account_to_third_party_account_mapping_To_account] FOREIGN KEY ([account_id]) REFERENCES [account]([id]),
	CONSTRAINT [FK_account_to_third_party_account_mapping_To_third_party_account] FOREIGN KEY ([third_party_account_id]) REFERENCES [third_party_account]([id])

)
