CREATE TABLE [dbo].[account](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](100) NOT NULL,
	[description] [varchar](100) NOT NULL,
	[account_type_id] [int] NOT NULL,
    CONSTRAINT [PK_account] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[account]  WITH CHECK ADD  CONSTRAINT [FK_account_account_type] FOREIGN KEY([account_type_id])
REFERENCES [dbo].[account_type] ([id])
GO

ALTER TABLE [dbo].[account] CHECK CONSTRAINT [FK_account_account_type]
GO