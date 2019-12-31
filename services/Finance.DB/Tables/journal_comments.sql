CREATE TABLE [dbo].[journal_comments]
(
	[id] INT identity(1,1) NOT NULL PRIMARY KEY,
	[created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL,
	[comment] NVARCHAR(MAX) NOT NULL
)
