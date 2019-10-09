CREATE TABLE [dbo].[ledger](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_id] [int] NOT NULL,
	[value] [numeric](18, 0) NOT NULL,
 CONSTRAINT [PK_ledger] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[ledger]  WITH CHECK ADD  CONSTRAINT [FK_ledger_account] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO

ALTER TABLE [dbo].[ledger] CHECK CONSTRAINT [FK_ledger_account]
GO