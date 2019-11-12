CREATE TABLE [dbo].[market_prices]
(
	[Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [business_date] DATETIME NOT NULL, 
	[security_id] int not null,
	[symbol] varchar(20) not null,
    [event] VARCHAR(10) NOT NULL, 
    [price] DECIMAL(18,9) Not NULL,
	[last_updated_by] varchar(20) not null,
	[last_updated_on] DateTime not null
)
Go

ALTER TABLE [dbo].[market_prices] ADD  CONSTRAINT [DF_market_prices_last_updated_on]  DEFAULT (getdate()) FOR [last_updated_on]
GO

