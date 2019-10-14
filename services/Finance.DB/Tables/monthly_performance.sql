CREATE TABLE [dbo].[monthly_performance]
(
	[id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[created_date] DATETIME NOT NULL, 
	[last_updated_date] DATETIME NOT NULL, 
	[entry_date] DATETIME NOT NULL, 
	[fund] NVARCHAR(100) NOT NULL, 
	[portfolio] NVARCHAR(100) NOT NULL, 
	[monthly_end_nav] DECIMAL(18, 6) NOT NULL, 
	[performance] DECIMAL(18, 6) NOT NULL, 
	[mtd] DECIMAL(18, 6) NOT NULL, 
	[ytd_net_performance] DECIMAL(18, 6) NOT NULL, 
	[qtd_net_perc] DECIMAL(18, 6) NOT NULL, 
	[ytd_net_perc] DECIMAL(18, 6) NOT NULL, 
	[itd_net_perc] DECIMAL(18, 6) NOT NULL

)
