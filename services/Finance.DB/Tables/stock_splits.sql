CREATE TABLE [dbo].[stock_splits]
(
	[id] INT identity(1,1) NOT NULL PRIMARY KEY, 
    [created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL, 
    [symbol] VARCHAR(100) NOT NULL, 
    [notice_date] DATETIME NULL, 
    [execution_date] DATETIME NULL, 
    [top_ratio] NUMERIC(18, 9) NOT NULL, 
    [bottom_ratio] NUMERIC(18, 9) NOT NULL, 
    [adjustment_factor] NUMERIC(18, 9) NOT NULL, 
    [active_flag] BIT NOT NULL DEFAULT 1
)
