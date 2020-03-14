CREATE TABLE [dbo].[cash_dividends]
(
	[id] INT identity(1,1) NOT NULL PRIMARY KEY,
	[created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL,
	[symbol] VARCHAR(100) NOT NULL,
	[notice_date] DATETIME NULL,
	[execution_date] DATETIME NULL,
	[record_date] DATETIME NULL,
	[pay_date] DATETIME NULL,
	[rate] numeric(18,9) NOT NULL,
	[currency] varchar(100) NOT NULL,
	[withholding_rate] numeric(18,9) NOT NULL,
	[fx_rate] numeric(22,9) NOT NULL,
	[active_flag] bit NOT NULL DEFAULT 1,
	[maturity_date] datetime null
)
