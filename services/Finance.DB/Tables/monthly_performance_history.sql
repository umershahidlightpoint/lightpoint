CREATE TABLE [dbo].[monthly_performance_history]
(
	[id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
	[performance_id] INT NOT NULL,
	[created_date] DATETIME NOT NULL, 
	[last_updated_date] DATETIME NOT NULL, 
	[created_by] NVARCHAR(100) NULL,
	[last_updated_by] NVARCHAR(100) NULL,
	[performance_date] DATETIME NOT NULL, 
	[fund] NVARCHAR(100) NULL, 
	[portfolio] NVARCHAR(100) NULL,
	[start_month_estimate_nav] DECIMAL(18, 6) NOT NULL DEFAULT 0,
	[monthly_end_nav] DECIMAL(18, 6) NOT NULL, 
	[performance] DECIMAL(18, 6) NOT NULL, 
	[mtd] DECIMAL(24, 16) NOT NULL, 
	[ytd_net_performance] DECIMAL(18, 6) NOT NULL, 
	[qtd_net_perc] DECIMAL(24, 16) NOT NULL, 
	[ytd_net_perc] DECIMAL(24, 16) NOT NULL, 
	[itd_net_perc] DECIMAL(24, 16) NOT NULL,
	[estimated] BIT NOT NULL DEFAULT 0
)
