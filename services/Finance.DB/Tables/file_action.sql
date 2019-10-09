CREATE TABLE [dbo].[file_action](
	[file_action_id] [int] IDENTITY(1,1) NOT NULL,
	[file_id] [int] NOT NULL,
	[action] [varchar](100) NOT NULL,
	[action_start_date] [datetime] NOT NULL,
	[action_end_date] [datetime] NULL,
 CONSTRAINT [PK_File_Action] PRIMARY KEY CLUSTERED 
(
	[file_action_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[file_action]  WITH CHECK ADD  CONSTRAINT [FK_File_Action_File] FOREIGN KEY([file_id])
REFERENCES [dbo].[file] ([id])
GO

ALTER TABLE [dbo].[file_action] CHECK CONSTRAINT [FK_File_Action_File]
GO
