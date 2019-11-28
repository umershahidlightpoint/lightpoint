CREATE TABLE [dbo].[fx_rates]
(
	[Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [business_date] DATETIME NOT NULL, 
	[currency] varchar(100) not null,
    [event] VARCHAR(10) NOT NULL, 
    [price] DECIMAL(18,9) Not NULL,
	[last_updated_by] varchar(20) not null,
	[last_updated_on] DateTime not null
)
Go

ALTER TABLE [dbo].[fx_rates] ADD  CONSTRAINT [DF_fx_rates_last_updated_on]  DEFAULT (getdate()) FOR [last_updated_on]
GO