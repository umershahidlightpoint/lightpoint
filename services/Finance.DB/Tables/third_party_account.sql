CREATE TABLE [dbo].[third_party_account]
(
	[id] INT identity(1,1) NOT NULL PRIMARY KEY,
	[created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL, 
	[third_party_organization_id] INT NOT NULL,
	[third_party_account_name] VARCHAR(100) NOT NULL,
	[third_party_account_code] VARCHAR(50) NOT NULL, 
    CONSTRAINT [FK_third_party_accounts_To_third_party_organization] FOREIGN KEY ([third_party_organization_id]) REFERENCES [third_party_organization]([id])
)
