CREATE TABLE [dbo].[settings]
(
	[id] INT identity(1,1) NOT NULL PRIMARY KEY, 
    [created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL, 
    [currency_code] VARCHAR(100) NOT NULL, 
    [tax_methodology] VARCHAR(100) NOT NULL, 
    [fiscal_month] VARCHAR(20) NOT NULL, 
    [fiscal_day] INT NOT NULL
)
