CREATE TABLE [dbo].[configurations]
(
	[id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL,
	[project] varchar(100) NULL,
	[user_id] int NOT NULL,
	[uom] varchar(100) NULL,
	[key] varchar(100) NOT NULL,
	[value] varchar(max) NOT NULL,
	[description] varchar(100) NULL,
	[active_flag] bit NOT NULL
)
