/****** Object:  Table [dbo].[tax_lot]    Script Date: 10/7/2019 4:29:35 AM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[tax_lot](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[closing_lot_id] [varchar](127) NOT NULL,
	[open_lot_id] [varchar](127) NOT NULL,
	[quantity] [numeric](18, 9) NOT NULL,
	[generated_on] [datetime] NOT NULL,
	[business_date] [date] NOT NULL,
 CONSTRAINT [PK_tax_lots] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tax_lot] ADD  CONSTRAINT [DF_tax_lot_generated_on]  DEFAULT (getdate()) FOR [generated_on]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The closing lot Id' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'tax_lot', @level2type=N'COLUMN',@level2name=N'closing_lot_id'
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'The is a reference back to the open / partially closed tax_lot that this closing lot decreases' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'tax_lot', @level2type=N'COLUMN',@level2name=N'open_lot_id'
GO


CREATE TABLE [dbo].[tax_lot_status](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[open_id] [varchar](127) NOT NULL,
	[symbol] [varchar](127) NOT NULL,
	[status] [varchar](20) NOT NULL,
	[quantity] [decimal](18, 6) NOT NULL,
	[business_date] [date] NULL,
	[generated_on] [datetime] NOT NULL,
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


CREATE TABLE [dbo].[cost_basis](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[business_date] [date] NOT NULL,
	[symbol] [varchar](100) NOT NULL,
	[balance] [numeric](18, 9) NOT NULL,
	[quantity] [numeric](18, 9) NOT NULL,
	[cost_basis] [numeric](18, 9) NOT NULL,
	[generated_on] [datetime] NOT NULL,
 CONSTRAINT [PK_cost_basis] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[cost_basis] ADD  CONSTRAINT [DF_cost_basis_generated_on]  DEFAULT (getdate()) FOR [generated_on]
GO


