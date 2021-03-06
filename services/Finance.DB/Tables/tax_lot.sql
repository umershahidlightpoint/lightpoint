﻿CREATE TABLE [dbo].[tax_lot](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[closing_lot_id] [varchar](127) NOT NULL,
	[open_lot_id] [varchar](127) NOT NULL,
	[quantity] [numeric](18, 9) NOT NULL,
	[generated_on] [datetime] NOT NULL,
	[business_date] [date] NOT NULL,
	[cost_basis] [numeric](18, 9) NOT NULL,
	[trade_price] [numeric](18, 9) NOT NULL,
	[trade_date] [date] NOT NULL,
	[investment_at_cost] [numeric](22, 9) NOT NULL,
	[realized_pnl] [numeric](22, 9) NOT NULL,
 [active_flag] BIT NOT NULL DEFAULT 1, 
    CONSTRAINT [PK_tax_lots] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tax_lot] ADD  CONSTRAINT [DF_tax_lot_generated_on]  DEFAULT (getdate()) FOR [generated_on]
GO

ALTER TABLE [dbo].[tax_lot] ADD  CONSTRAINT [DF_tax_lot_cost_basis]  DEFAULT ((0)) FOR [cost_basis]
GO

ALTER TABLE [dbo].[tax_lot] ADD  CONSTRAINT [DF_tax_lot_trade_price]  DEFAULT ((0)) FOR [trade_price]
GO

ALTER TABLE [dbo].[tax_lot] ADD  DEFAULT (getdate()) FOR [trade_date]
GO

ALTER TABLE [dbo].[tax_lot] ADD  DEFAULT ((0)) FOR [investment_at_cost]
GO

ALTER TABLE [dbo].[tax_lot] ADD  CONSTRAINT [DF_tax_lot_realized_pnl]  DEFAULT ((0)) FOR [realized_pnl]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The closing lot Id' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'tax_lot', @level2type=N'COLUMN',@level2name=N'closing_lot_id'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The is a reference back to the open / partially closed tax_lot that this closing lot decreases' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'tax_lot', @level2type=N'COLUMN',@level2name=N'open_lot_id'
GO


