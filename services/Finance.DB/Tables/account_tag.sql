CREATE TABLE [dbo].[account_tag](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_id] [int] NOT NULL,
	[tag_id] [int] NOT NULL,
	[tag_value] [varchar](50) NOT NULL,
 CONSTRAINT [PK_account_tag] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[account_tag]  WITH CHECK ADD  CONSTRAINT [FK_account_tag_account] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO

ALTER TABLE [dbo].[account_tag] CHECK CONSTRAINT [FK_account_tag_account]
GO

ALTER TABLE [dbo].[account_tag]  WITH CHECK ADD  CONSTRAINT [FK_account_tag_tag] FOREIGN KEY([tag_id])
REFERENCES [dbo].[tag] ([id])
GO

ALTER TABLE [dbo].[account_tag] CHECK CONSTRAINT [FK_account_tag_tag]
GO