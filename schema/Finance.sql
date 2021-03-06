USE [master]
GO
/****** Object:  Database [Finance]    Script Date: 6/27/2019 7:40:57 AM ******/
CREATE DATABASE [Finance]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'Finance', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.SQLEXPRESS\MSSQL\DATA\Finance.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'Finance_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL14.SQLEXPRESS\MSSQL\DATA\Finance_log.ldf' , SIZE = 73728KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
GO
ALTER DATABASE [Finance] SET COMPATIBILITY_LEVEL = 140
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [Finance].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [Finance] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [Finance] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [Finance] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [Finance] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [Finance] SET ARITHABORT OFF 
GO
ALTER DATABASE [Finance] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [Finance] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [Finance] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [Finance] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [Finance] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [Finance] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [Finance] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [Finance] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [Finance] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [Finance] SET  DISABLE_BROKER 
GO
ALTER DATABASE [Finance] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [Finance] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [Finance] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [Finance] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [Finance] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [Finance] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [Finance] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [Finance] SET RECOVERY SIMPLE 
GO
ALTER DATABASE [Finance] SET  MULTI_USER 
GO
ALTER DATABASE [Finance] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [Finance] SET DB_CHAINING OFF 
GO
ALTER DATABASE [Finance] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [Finance] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [Finance] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [Finance] SET QUERY_STORE = OFF
GO
USE [Finance]
GO
/****** Object:  User [test]    Script Date: 6/27/2019 7:40:57 AM ******/
CREATE USER [test] FOR LOGIN [test] WITH DEFAULT_SCHEMA=[dbo]
GO
/****** Object:  Table [dbo].[account]    Script Date: 6/27/2019 7:40:57 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[account](
	[id] [int] NOT NULL,
	[name] [varchar](50) NOT NULL,
	[description] [varchar](100) NULL,
	[account_category_id] [int] NOT NULL,
 CONSTRAINT [PK_account] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[account_category]    Script Date: 6/27/2019 7:40:58 AM ******/
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
/****** Object:  Table [dbo].[account_tag]    Script Date: 6/27/2019 7:40:58 AM ******/
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
/****** Object:  Table [dbo].[journal]    Script Date: 6/27/2019 7:40:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[journal](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_id] [int] NOT NULL,
	[value] [numeric](18, 0) NOT NULL,
	[source] [varchar](50) NOT NULL,
	[when] [datetime] NULL,
 CONSTRAINT [PK_journal] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[journal_log]    Script Date: 6/27/2019 7:40:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[journal_log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[actionOn] [datetime] NOT NULL,
	[action] [varchar](100) NOT NULL,
 CONSTRAINT [PK_journal_log] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ledger]    Script Date: 6/27/2019 7:40:58 AM ******/
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
/****** Object:  Table [dbo].[tag]    Script Date: 6/27/2019 7:40:58 AM ******/
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
/****** Object:  StoredProcedure [dbo].[setup]    Script Date: 6/27/2019 7:40:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[setup]
as
set nocount on

delete from account_category

insert into account_category (id, name) values (1, 'Cash')
insert into account_category (id, name) values (2, 'Asset')
insert into account_category (id, name) values (3, 'Expences')
insert into account_category (id, name) values (4, 'Liabilities')
insert into account_category (id, name) values (5, 'Fees')

INSERT INTO [dbo].[account] ([id] ,[name] ,[description]  ,[account_category_id]) values( 1,	'First Account',	'Account For Test'	,1);
INSERT INTO [dbo].[account] ([id] ,[name] ,[description]  ,[account_category_id]) values(2,	'Second Account',	'Second Account For Test',	2);
  



return
GO
/****** Object:  StoredProcedure [dbo].[trialbalance]    Script Date: 6/27/2019 7:40:58 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [dbo].[trialbalance]
as

	select ac.name as 'Category', a.name 'Account Name', 
		iif(l.value>0, l.value, 0) as credit, 
		iif(l.value<0, l.value, 0) as debit from account a
	inner join account_category ac on ac.id = a.account_category_id
	inner join ledger l on l.account_id = a.id
	order by a.name desc


return
GO
USE [master]
GO
ALTER DATABASE [Finance] SET  READ_WRITE 
GO


