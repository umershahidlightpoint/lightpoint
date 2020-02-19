CREATE TABLE [dbo].[stock_splits_audit_trail]
(
	[id] INT identity(1,1) NOT NULL PRIMARY KEY,
    [stock_split_id] INT NOT NULL, 
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
    [active_flag] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [FK_stock_splits_audit_trail_To_stock_splits] FOREIGN KEY ([stock_split_id]) REFERENCES [stock_splits]([id]))
