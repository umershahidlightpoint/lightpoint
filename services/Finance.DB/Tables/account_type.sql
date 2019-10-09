CREATE TABLE [dbo].[account_type](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_category_id] [int] NOT NULL,
	[name] [varchar](100) NOT NULL,
 CONSTRAINT [PK_account_type] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[account_type]  WITH CHECK ADD  CONSTRAINT [FK_account_type_account_category] FOREIGN KEY([account_category_id])
REFERENCES [dbo].[account_category] ([id])
GO

ALTER TABLE [dbo].[account_type] CHECK CONSTRAINT [FK_account_type_account_category]
GO