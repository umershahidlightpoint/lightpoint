CREATE TABLE [dbo].[fx_rates_history]
(
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[fx_rate_id] [int] NOT NULL,
	[business_date] DATETIME NOT NULL, 
	[currency] varchar(100) not null,
    [event] VARCHAR(10) NOT NULL, 
    [price] DECIMAL(18,9) Not NULL,
	[last_updated_by] varchar(20) not null,
	[last_updated_on] DateTime not null,
	CONSTRAINT [FK_fx_rates_history_To_fx_rates] FOREIGN KEY ([fx_rate_id]) REFERENCES [fx_rates]([Id])
)
