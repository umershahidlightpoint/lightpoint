CREATE TABLE [dbo].[market_prices_history]
(
	[Id] [int] IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[market_price_id] [int] NOT NULL,
	[business_date] DATETIME NOT NULL, 
	[security_id] int not null,
	[symbol] varchar(20) not null,
    [event] VARCHAR(10) NOT NULL, 
    [price] DECIMAL(18,9) Not NULL,
	[last_updated_by] varchar(20) not null,
	[last_updated_on] DateTime not null, 
    CONSTRAINT [FK_market_prices_history_To_market_prices] FOREIGN KEY ([market_price_id]) REFERENCES [market_prices]([Id])
)
