CREATE TABLE [dbo].[third_party_organization]
(
	[id] INT identity(1,1) NOT NULL PRIMARY KEY,
	[created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL,
	[organization_name] VARCHAR(50) NOT NULL
)
