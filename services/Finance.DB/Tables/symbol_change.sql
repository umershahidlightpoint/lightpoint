CREATE TABLE [dbo].[symbol_change]
(
	[id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL,
	[old_symbol] VARCHAR(100) NOT NULL,
	[new_symbol] VARCHAR(100) NOT NULL,
	[notice_date] DATETIME NOT NULL,
	[execution_date] DATETIME NOT NULL,
	[active_flag] BIT NOT NULL DEFAULT 1
)
