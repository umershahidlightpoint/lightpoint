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

drop table [dbo].[account_def_tag]
go

drop table [dbo].[account_def]
go

drop table [dbo].[account_tag]
go

drop table [dbo].[tag]
go

drop table [dbo].[account]
go

drop table [dbo].[account_category]
go

drop table [dbo].[account_type]
go

USE [Finance]
GO
/****** Object:  Table [dbo].[account]    Script Date: 8/6/2019 10:28:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
/****** Object:  Table [dbo].[account_category]    Script Date: 8/6/2019 10:28:52 PM ******/
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
/****** Object:  Table [dbo].[account_def]    Script Date: 8/6/2019 10:28:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account_def](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_category_id] [int] NOT NULL,
	[description] [varchar](255) NULL,
 CONSTRAINT [PK_account_def] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[account_def_tag]    Script Date: 8/6/2019 10:28:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
/****** Object:  Table [dbo].[account_tag]    Script Date: 8/6/2019 10:28:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
/****** Object:  Table [dbo].[account_type]    Script Date: 8/6/2019 10:28:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
/****** Object:  Table [dbo].[journal]    Script Date: 8/6/2019 10:28:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
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
 CONSTRAINT [PK_journal] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[journal_log]    Script Date: 8/6/2019 10:28:52 PM ******/
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
/****** Object:  Table [dbo].[ledger]    Script Date: 8/6/2019 10:28:52 PM ******/
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
/****** Object:  Table [dbo].[tag]    Script Date: 8/6/2019 10:28:52 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tag](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[table_name] [varchar](50) NOT NULL,
	[pk_name] [varchar](50) NOT NULL,
	[column_name] [varchar](50) NOT NULL,
 CONSTRAINT [PK_tag] PRIMARY KEY CLUSTERED 
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
ALTER TABLE [dbo].[account]  WITH CHECK ADD  CONSTRAINT [FK_account_account_type] FOREIGN KEY([account_type_id])
REFERENCES [dbo].[account_type] ([id])
GO
ALTER TABLE [dbo].[account] CHECK CONSTRAINT [FK_account_account_type]
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
ALTER TABLE [dbo].[account_type]  WITH CHECK ADD  CONSTRAINT [FK_account_type_account_category] FOREIGN KEY([account_category_id])
REFERENCES [dbo].[account_category] ([id])
GO
ALTER TABLE [dbo].[account_type] CHECK CONSTRAINT [FK_account_type_account_category]
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
