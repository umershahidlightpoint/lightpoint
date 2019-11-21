CREATE TABLE [dbo].[journal](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_id] [int] NOT NULL,
	[value] [decimal](22, 9) NOT NULL,
	[source] [varchar](50) NOT NULL,
	[when] [datetime] NOT NULL,
	[fx_currency] [varchar](3) NOT NULL,
	[fxrate] [decimal](22, 9) NOT NULL,
	[fund] [varchar](50) NOT NULL,
	[generated_by] [varchar](20) NOT NULL,
	[quantity] [decimal](22, 9) NOT NULL,
	[last_modified_on] [datetime] NULL,
	[symbol] [varchar](100) NULL,
	[event] VARCHAR(100) NULL DEFAULT (''), 
    [start_price] DECIMAL(22, 9) NOT NULL DEFAULT 0.0, 
    [end_price] DECIMAL(22, 9) NOT NULL DEFAULT 0.0, 
    [credit_debit] NCHAR(10) NOT NULL DEFAULT '', 
	[security_id] [int] NULL DEFAULT -1,
    CONSTRAINT [PK_journal] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[journal] ADD  CONSTRAINT [DF_journal_fx_currency]  DEFAULT ('USD') FOR [fx_currency]
GO

ALTER TABLE [dbo].[journal] ADD  CONSTRAINT [DF_journal_fxrate]  DEFAULT ((1.0)) FOR [fxrate]
GO

ALTER TABLE [dbo].[journal] ADD  CONSTRAINT [DF_journal_generated_by]  DEFAULT ('system') FOR [generated_by]
GO

ALTER TABLE [dbo].[journal] ADD  CONSTRAINT [DF_journal_quantity]  DEFAULT ((0)) FOR [quantity]
GO

ALTER TABLE [dbo].[journal] ADD  CONSTRAINT [DF_journal_last_modified_on]  DEFAULT (getdate()) FOR [last_modified_on]
GO

ALTER TABLE [dbo].[journal] ADD  CONSTRAINT [DF_journal_symbol]  DEFAULT ('') FOR [symbol]
GO

ALTER TABLE [dbo].[journal]  WITH NOCHECK ADD  CONSTRAINT [FK_journal_account] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO

ALTER TABLE [dbo].[journal] CHECK CONSTRAINT [FK_journal_account]
GO

EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'This should be either ''system'' or ''manual''  ( system can not be modified, ''manual'' can be deleted/modified )' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'journal', @level2type=N'COLUMN',@level2name=N'generated_by'
GO