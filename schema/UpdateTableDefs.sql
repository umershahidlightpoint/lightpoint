/**
THis is destructive, it drops all tables and re-creates
*/
USE [Finance]
GO

drop table [dbo].[journal]
go

drop table [dbo].[journal_log]
go

drop table [dbo].[ledger]
go

drop table [dbo].[account_tag]
go

drop table [dbo].[tag]
go

drop table [dbo].[account]
go

drop table [dbo].[account_category]
go

/****** Object:  Table [dbo].[account]    Script Date: 7/18/2019 1:09:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](100) NOT NULL,
	[description] [varchar](100) NOT NULL,
	[account_category_id] [int] NOT NULL,
 CONSTRAINT [PK_account] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[account_category]    Script Date: 7/18/2019 1:09:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account_category](
	[id] [int] NOT NULL,
	[name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_account_category] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[account_tag]    Script Date: 7/18/2019 1:09:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account_tag](
	[id] [int] NOT NULL,
	[account_id] [int] NOT NULL,
	[tag_id] [int] NOT NULL,
	[tag_value] [int] NOT NULL,
 CONSTRAINT [PK_account_tag] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[journal]    Script Date: 7/18/2019 1:09:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[journal](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_id] [int] NOT NULL,
	[value] [numeric](18, 0) NOT NULL,
	[source] [varchar](50) NOT NULL,
	[when] [datetime] NOT NULL,
	[fund] [varchar](50) NOT NULL,
	[generated_by] [varchar](20) NOT NULL,
 CONSTRAINT [PK_journal] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[journal_log]    Script Date: 7/18/2019 1:09:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[journal_log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[action_on] [datetime] NOT NULL,
	[action] [varchar](100) NOT NULL,
 CONSTRAINT [PK_journal_log] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ledger]    Script Date: 7/18/2019 1:09:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
/****** Object:  Table [dbo].[tag]    Script Date: 7/18/2019 1:09:54 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tag](
	[id] [int] NOT NULL,
	[table_name] [varchar](50) NOT NULL,
	[pk_name] [varchar](50) NOT NULL,
	[column_name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_tag] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[journal] ADD  CONSTRAINT [DF_journal_generated_by]  DEFAULT ('system') FOR [generated_by]
GO
ALTER TABLE [dbo].[account]  WITH CHECK ADD  CONSTRAINT [FK_account_account_category] FOREIGN KEY([account_category_id])
REFERENCES [dbo].[account_category] ([id])
GO
ALTER TABLE [dbo].[account] CHECK CONSTRAINT [FK_account_account_category]
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
ALTER TABLE [dbo].[journal]  WITH CHECK ADD  CONSTRAINT [FK_journal_account] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO
ALTER TABLE [dbo].[journal] CHECK CONSTRAINT [FK_journal_account]
GO
ALTER TABLE [dbo].[ledger]  WITH CHECK ADD  CONSTRAINT [FK_ledger_account] FOREIGN KEY([account_id])
REFERENCES [dbo].[account] ([id])
GO
ALTER TABLE [dbo].[ledger] CHECK CONSTRAINT [FK_ledger_account]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_Description', @value=N'This should be either ''system'' or ''manual''  ( system can not be modified, ''manual'' can be deleted/modified )' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'journal', @level2type=N'COLUMN',@level2name=N'generated_by'
GO
