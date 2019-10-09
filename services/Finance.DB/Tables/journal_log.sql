CREATE TABLE [dbo].[journal_log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[action_on] [datetime] NOT NULL,
	[action] [text] NOT NULL,
	[rundate] [datetime] NULL,
	[log_key] [uniqueidentifier] NULL,
 CONSTRAINT [PK_journal_log] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO