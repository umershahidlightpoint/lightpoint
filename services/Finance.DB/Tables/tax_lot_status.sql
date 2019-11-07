CREATE TABLE [dbo].[tax_lot_status](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[open_id] [varchar](127) NOT NULL,
	[symbol] [varchar](127) NOT NULL,
	[side] [varchar](10) NULL,
	[status] [varchar](20) NOT NULL,
	[original_quantity] [decimal](18, 6) NOT NULL DEFAULT 0,
	[quantity] [decimal](18, 6) NOT NULL,
	[business_date] [date] NOT NULL,
	[generated_on] [datetime] NOT NULL,
 [trade_date] DATETIME NOT NULL DEFAULT getdate(), 
    [investment_at_cost] DECIMAL(18, 6) NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_tax_lot_status] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tax_lot_status] ADD  CONSTRAINT [DF_tax_lot_status_symbol]  DEFAULT ('UNKNOWN') FOR [symbol]
GO

ALTER TABLE [dbo].[tax_lot_status] ADD  CONSTRAINT [DF_tax_lot_status_generated_on]  DEFAULT (getdate()) FOR [generated_on]
GO