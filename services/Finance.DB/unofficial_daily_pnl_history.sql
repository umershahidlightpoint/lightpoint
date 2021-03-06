﻿CREATE TABLE [dbo].[unofficial_daily_pnl_history]
(
	[id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[unofficial_daily_pnl_id] INT NOT NULL,
	[created_by] NVARCHAR(100) NOT NULL,
	[created_date] datetime NOT NULL,
	[last_updated_by] NVARCHAR(100) NULL,
	[last_updated_date] datetime NULL,
	[business_date] datetime NOT NULL, 
    [portfolio] NVARCHAR(100) NULL, 
    [fund] NCHAR(100) NULL, 
    [trading_mtd_pnl] DECIMAL(18, 2) NOT NULL, 
    [calc_trading_mtd_pnl] DECIMAL(18, 2) NOT NULL, 
    [trading_ytd_pnl] DECIMAL(18, 2) NOT NULL, 
    [mtd_final_pnl] DECIMAL(18, 2) NOT NULL, 
    [ytd_final_pnl] DECIMAL(18, 2) NOT NULL, 
    [mtd_ipo_pnl] DECIMAL(18, 2) NOT NULL, 
    [ytd_ipo_pnl] DECIMAL(18, 2) NOT NULL, 
    [mtd_total_pnl] DECIMAL(18, 2) NOT NULL, 
    [calc_mtd_total] DECIMAL(18, 2) NOT NULL, 
    [ytd_total_pnl] DECIMAL(18, 2) NOT NULL
)
