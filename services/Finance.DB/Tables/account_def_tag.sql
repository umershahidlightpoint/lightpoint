CREATE TABLE [dbo].[account_def_tag](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_def_id] [int] NOT NULL,
	[tag_id] [int] NOT NULL,
 CONSTRAINT [PK_account_def_tag] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[account_def_tag]  WITH CHECK ADD  CONSTRAINT [FK_account_def_tag_account_def] FOREIGN KEY([account_def_id])
REFERENCES [dbo].[account_def] ([id])
GO

ALTER TABLE [dbo].[account_def_tag] CHECK CONSTRAINT [FK_account_def_tag_account_def]
GO

ALTER TABLE [dbo].[account_def_tag]  WITH CHECK ADD  CONSTRAINT [FK_account_def_tag_tag] FOREIGN KEY([tag_id])
REFERENCES [dbo].[tag] ([id])
GO

ALTER TABLE [dbo].[account_def_tag] CHECK CONSTRAINT [FK_account_def_tag_tag]
GO