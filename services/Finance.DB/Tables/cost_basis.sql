CREATE TABLE [dbo].[cost_basis](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[business_date] [date] NOT NULL,
	[symbol] [varchar](100) NOT NULL,
	[balance] [numeric](18, 9) NOT NULL,
	[quantity] [numeric](18, 9) NOT NULL,
	[cost_basis] [numeric](18, 9) NOT NULL,
	[side] [varchar](10) NULL,
	[generated_on] [datetime] NOT NULL,
 [realized_pnl] NUMERIC(18, 9) NULL DEFAULT 0, 
    [unrealized_pnl] NUMERIC(18, 9) NULL DEFAULT 0, 
    [eod_price] NUMERIC(18, 9) NULL DEFAULT 0, 
    CONSTRAINT [PK_cost_basis] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[cost_basis] ADD  CONSTRAINT [DF_cost_basis_generated_on]  DEFAULT (getdate()) FOR [generated_on]
GO