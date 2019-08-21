USE [master]
GO
/****** Object:  Database [FundAccounting]    Script Date: 8/20/2019 11:10:28 PM ******/
CREATE DATABASE [FundAccounting]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'FundAccounting', FILENAME = N'E:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\Data\FundAccounting.mdf' , SIZE = 4096KB , MAXSIZE = UNLIMITED, FILEGROWTH = 1024KB )
 LOG ON 
( NAME = N'FundAccounting_log', FILENAME = N'F:\Program Files\Microsoft SQL Server\MSSQL11.MSSQLSERVER\MSSQL\Data\FundAccounting_log.ldf' , SIZE = 1024KB , MAXSIZE = 2048GB , FILEGROWTH = 10%)
GO
ALTER DATABASE [FundAccounting] SET COMPATIBILITY_LEVEL = 110
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [FundAccounting].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [FundAccounting] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [FundAccounting] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [FundAccounting] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [FundAccounting] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [FundAccounting] SET ARITHABORT OFF 
GO
ALTER DATABASE [FundAccounting] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [FundAccounting] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [FundAccounting] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [FundAccounting] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [FundAccounting] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [FundAccounting] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [FundAccounting] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [FundAccounting] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [FundAccounting] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [FundAccounting] SET  DISABLE_BROKER 
GO
ALTER DATABASE [FundAccounting] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [FundAccounting] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [FundAccounting] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [FundAccounting] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [FundAccounting] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [FundAccounting] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [FundAccounting] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [FundAccounting] SET RECOVERY FULL 
GO
ALTER DATABASE [FundAccounting] SET  MULTI_USER 
GO
ALTER DATABASE [FundAccounting] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [FundAccounting] SET DB_CHAINING OFF 
GO
ALTER DATABASE [FundAccounting] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [FundAccounting] SET TARGET_RECOVERY_TIME = 0 SECONDS 
GO
USE [FundAccounting]
GO
/****** Object:  User [ggtuser]    Script Date: 8/20/2019 11:10:28 PM ******/
CREATE USER [ggtuser] FOR LOGIN [ggtuser] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [ggtuser]
GO
/****** Object:  Table [dbo].[Account]    Script Date: 8/20/2019 11:10:28 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Account](
	[AccountId] [int] IDENTITY(1,1) NOT NULL,
	[AccountCode] [int] NOT NULL,
	[AccountName] [varchar](200) NOT NULL,
	[AccountType] [char](1) NOT NULL,
	[CurrencyCode] [varchar](5) NOT NULL,
 CONSTRAINT [PK_Account] PRIMARY KEY CLUSTERED 
(
	[AccountId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Account] UNIQUE NONCLUSTERED 
(
	[AccountCode] ASC,
	[AccountName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AccountingPeriod]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccountingPeriod](
	[AccountingPeriodId] [int] IDENTITY(1,1) NOT NULL,
	[PeriodStart] [datetime] NOT NULL,
	[PeriodStartType] [varchar](20) NOT NULL,
	[PeriodEnd] [datetime] NOT NULL,
	[PeriodEndType] [varchar](20) NOT NULL,
 CONSTRAINT [PK_AccountingPeriod] PRIMARY KEY CLUSTERED 
(
	[AccountingPeriodId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_AccountingPeriod] UNIQUE NONCLUSTERED 
(
	[PeriodStart] ASC,
	[PeriodStartType] ASC,
	[PeriodEnd] ASC,
	[PeriodEndType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AccountingPeriodLocked]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AccountingPeriodLocked](
	[AccountingPeriodLockedId] [int] IDENTITY(1,1) NOT NULL,
	[AccountingPeriodId] [int] NOT NULL,
	[IsLocked] [bit] NOT NULL,
	[When] [datetime] NOT NULL,
	[Who] [varchar](100) NOT NULL,
 CONSTRAINT [PK_AccountingPeriodLocked] PRIMARY KEY CLUSTERED 
(
	[AccountingPeriodLockedId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_AccountingPeriodLocked] UNIQUE NONCLUSTERED 
(
	[AccountingPeriodId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Activity]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Activity](
	[ActivityId] [int] IDENTITY(1,1) NOT NULL,
	[AccountingPeriodId] [int] NOT NULL,
	[OriginalAccountId] [int] NOT NULL,
	[AccountId] [int] NOT NULL,
	[EntityId] [int] NOT NULL,
	[Currency] [varchar](3) NOT NULL,
	[ActivitySource] [varchar](50) NOT NULL,
	[OriginalValue] [float] NOT NULL,
	[Value] [float] NOT NULL,
 CONSTRAINT [PK_Activity] PRIMARY KEY CLUSTERED 
(
	[ActivityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Activity] UNIQUE NONCLUSTERED 
(
	[AccountingPeriodId] ASC,
	[OriginalAccountId] ASC,
	[AccountId] ASC,
	[EntityId] ASC,
	[Currency] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Allocation]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Allocation](
	[AllocationId] [int] IDENTITY(1,1) NOT NULL,
	[AccountingPeriodId] [int] NOT NULL,
	[InvestmentId] [int] NOT NULL,
	[AllocationEntityEntityId] [int] NOT NULL,
	[RunDatetime] [datetime] NOT NULL,
 CONSTRAINT [PK_Allocation] PRIMARY KEY CLUSTERED 
(
	[AllocationId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Allocation] UNIQUE NONCLUSTERED 
(
	[AccountingPeriodId] ASC,
	[InvestmentId] ASC,
	[AllocationEntityEntityId] ASC,
	[RunDatetime] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[AllocationValue]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AllocationValue](
	[AllocationValueId] [int] IDENTITY(1,1) NOT NULL,
	[AllocationId] [int] NOT NULL,
	[WorksheetTableColumnName] [varchar](255) NOT NULL,
	[DisplayName1] [varchar](50) NULL,
	[BaseValue] [float] NULL,
	[LocalValue] [float] NULL,
	[StringValue] [varchar](255) NULL,
 CONSTRAINT [PK_AllocationValue] PRIMARY KEY CLUSTERED 
(
	[AllocationValueId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_AllocationValue] UNIQUE NONCLUSTERED 
(
	[AllocationId] ASC,
	[WorksheetTableColumnName] ASC,
	[DisplayName1] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[CapitalActivity]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[CapitalActivity](
	[CapitalActivityId] [int] IDENTITY(1,1) NOT NULL,
	[AccountingPeriodId] [int] NOT NULL,
	[FromInvestmentId] [int] NOT NULL,
	[ToInvestmentId] [int] NOT NULL,
	[Value] [float] NOT NULL,
 CONSTRAINT [PK_CapitalActivity] PRIMARY KEY CLUSTERED 
(
	[CapitalActivityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_CapitalActivity] UNIQUE NONCLUSTERED 
(
	[AccountingPeriodId] ASC,
	[FromInvestmentId] ASC,
	[ToInvestmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Deal]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Deal](
	[DealId] [int] IDENTITY(1,1) NOT NULL,
	[DealName] [varchar](200) NOT NULL,
 CONSTRAINT [PK_Deal] PRIMARY KEY CLUSTERED 
(
	[DealId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Deal] UNIQUE NONCLUSTERED 
(
	[DealName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DealEntity]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DealEntity](
	[DealEntityId] [int] IDENTITY(1,1) NOT NULL,
	[DealId] [int] NOT NULL,
	[EntityId] [int] NOT NULL,
 CONSTRAINT [PK_DealEntity] PRIMARY KEY CLUSTERED 
(
	[DealEntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_DealEntity] UNIQUE NONCLUSTERED 
(
	[DealId] ASC,
	[EntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[DealOrder]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[DealOrder](
	[DealOrderId] [int] IDENTITY(1,1) NOT NULL,
	[DealId] [int] NOT NULL,
	[EntityId] [int] NOT NULL,
	[Order] [int] NOT NULL,
 CONSTRAINT [PK_DealOrder] PRIMARY KEY CLUSTERED 
(
	[DealOrderId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_DealOrder] UNIQUE NONCLUSTERED 
(
	[DealId] ASC,
	[EntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[dev_entity]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[dev_entity](
	[EntityName] [varchar](64) NOT NULL,
	[EntityHierarchyName] [varchar](64) NULL,
	[NodeId] [hierarchyid] NULL,
	[IsRoot] [bit] NOT NULL,
	[Description] [varchar](256) NOT NULL,
	[EntityType] [varchar](32) NOT NULL,
	[IsInternal] [bit] NOT NULL,
	[InternalBookName] [varchar](64) NULL,
	[MurexFundName] [varchar](3) NULL,
	[MurexCounterpartyName] [varchar](15) NULL,
	[MurexInstrumentName] [varchar](20) NULL,
	[IFSFundName] [varchar](32) NULL,
	[JurisdictionName] [varchar](64) NULL,
	[CompanyRegistrationNumber] [varchar](64) NULL,
	[MarkitEntityIdentifier] [char](10) NULL,
	[EmployerIdentificationNumber] [int] NULL,
	[Comment] [varchar](256) NULL,
	[LegalEntityCode] [char](12) NULL,
	[ObjectVersion] [timestamp] NOT NULL
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Entity]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Entity](
	[EntityId] [int] IDENTITY(1,1) NOT NULL,
	[EntityName] [varchar](64) NOT NULL,
	[EntityType] [varchar](32) NOT NULL,
	[Description] [varchar](256) NOT NULL,
	[IFSFundName] [varchar](32) NOT NULL,
	[IsOffshore] [bit] NOT NULL,
	[AreFeesAllocated] [bit] NOT NULL,
	[IsTradingEntity] [bit] NOT NULL,
 CONSTRAINT [PK_Entity] PRIMARY KEY CLUSTERED 
(
	[EntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Entity] UNIQUE NONCLUSTERED 
(
	[EntityName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntityAccount]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntityAccount](
	[EntityAccountId] [int] IDENTITY(1,1) NOT NULL,
	[AccountingPeriodId] [int] NOT NULL,
	[EntityId] [int] NOT NULL,
	[OriginalAccountId] [int] NOT NULL,
	[AccountId] [int] NOT NULL,
	[Currency] [varchar](3) NOT NULL,
	[Include] [bit] NOT NULL,
 CONSTRAINT [PK_EntityAccount] PRIMARY KEY CLUSTERED 
(
	[EntityAccountId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_EntityAccount] UNIQUE NONCLUSTERED 
(
	[AccountingPeriodId] ASC,
	[EntityId] ASC,
	[OriginalAccountId] ASC,
	[AccountId] ASC,
	[Currency] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntityCapitalActivity]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntityCapitalActivity](
	[EntityCapitalActivityId] [int] IDENTITY(1,1) NOT NULL,
	[AccountingPeriodId] [int] NOT NULL,
	[FromEntityId] [int] NOT NULL,
	[ToEntityId] [int] NOT NULL,
	[TargetEntityId] [int] NULL,
	[ActivityType] [varchar](50) NOT NULL,
	[Value] [float] NOT NULL,
 CONSTRAINT [PK_EntityCapitalActivity] PRIMARY KEY CLUSTERED 
(
	[EntityCapitalActivityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_EntityCapitalActivity] UNIQUE NONCLUSTERED 
(
	[AccountingPeriodId] ASC,
	[FromEntityId] ASC,
	[ToEntityId] ASC,
	[TargetEntityId] ASC,
	[ActivityType] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntityOpeningCapital]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntityOpeningCapital](
	[EntityOpeningCapitalId] [int] IDENTITY(1,1) NOT NULL,
	[AccountingPeriodId] [int] NOT NULL,
	[FromEntityId] [int] NOT NULL,
	[ToEntityId] [int] NOT NULL,
	[Balance] [float] NOT NULL,
	[AccruedIncentive] [float] NOT NULL,
	[AccruedIncome] [float] NOT NULL,
 CONSTRAINT [PK_EntityOpeningCapital] PRIMARY KEY CLUSTERED 
(
	[EntityOpeningCapitalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_EntityOpeningCapital] UNIQUE NONCLUSTERED 
(
	[AccountingPeriodId] ASC,
	[FromEntityId] ASC,
	[ToEntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[EntityRelationship]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[EntityRelationship](
	[EntityRelationshipId] [int] IDENTITY(1,1) NOT NULL,
	[FromEntityId] [int] NOT NULL,
	[ToEntityId] [int] NOT NULL,
	[RootEntityId] [int] NOT NULL,
 CONSTRAINT [PK_EntityRelationship] PRIMARY KEY CLUSTERED 
(
	[EntityRelationshipId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_EntityRelationship] UNIQUE NONCLUSTERED 
(
	[FromEntityId] ASC,
	[ToEntityId] ASC,
	[RootEntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[FxRate]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[FxRate](
	[FxRateId] [int] IDENTITY(1,1) NOT NULL,
	[Date] [date] NOT NULL,
	[Ccy] [char](3) NOT NULL,
	[Rate] [float] NOT NULL,
 CONSTRAINT [PK_FxRate] PRIMARY KEY CLUSTERED 
(
	[FxRateId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_FxRate] UNIQUE NONCLUSTERED 
(
	[Date] ASC,
	[Ccy] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Investment]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Investment](
	[InvestmentId] [int] IDENTITY(1,1) NOT NULL,
	[InvestorId] [int] NOT NULL,
	[ShareClassSeriesId] [int] NOT NULL,
	[InvestmentDate] [date] NOT NULL,
	[Value] [float] NOT NULL,
 CONSTRAINT [PK_Investment] PRIMARY KEY CLUSTERED 
(
	[InvestmentId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Investment] UNIQUE NONCLUSTERED 
(
	[InvestorId] ASC,
	[ShareClassSeriesId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Investor]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Investor](
	[InvestorId] [int] IDENTITY(1,1) NOT NULL,
	[InvestorName] [varchar](200) NOT NULL,
 CONSTRAINT [PK_Investor] PRIMARY KEY CLUSTERED 
(
	[InvestorId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Investor] UNIQUE NONCLUSTERED 
(
	[InvestorName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[OpeningCapital]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OpeningCapital](
	[OpeningCapitalId] [int] IDENTITY(1,1) NOT NULL,
	[AccountingPeriodId] [int] NOT NULL,
	[InvestmentId] [int] NOT NULL,
	[LevelEntityId] [int] NOT NULL,
	[Balance] [float] NOT NULL,
	[AccruedIncentive] [float] NOT NULL,
	[AccruedIncome] [float] NOT NULL,
	[HighWaterMark] [float] NOT NULL,
 CONSTRAINT [PK_OpeningCapital] PRIMARY KEY CLUSTERED 
(
	[OpeningCapitalId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_OpeningCapital] UNIQUE NONCLUSTERED 
(
	[AccountingPeriodId] ASC,
	[InvestmentId] ASC,
	[LevelEntityId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Permission]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Permission](
	[PermissionId] [int] IDENTITY(1,1) NOT NULL,
	[UsersId] [int] NOT NULL,
	[Check] [varchar](50) NOT NULL,
 CONSTRAINT [PK_Permission] PRIMARY KEY CLUSTERED 
(
	[PermissionId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Permission] UNIQUE NONCLUSTERED 
(
	[UsersId] ASC,
	[Check] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ShareClass]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShareClass](
	[ShareClassId] [int] IDENTITY(1,1) NOT NULL,
	[EntityId] [int] NOT NULL,
	[ShareClassName] [varchar](64) NOT NULL,
	[DisplayName] [varchar](64) NOT NULL,
	[Comment] [varchar](256) NULL,
	[IsCarriedInterestClass] [bit] NOT NULL,
	[InceptionDate] [date] NULL,
	[ClosedDate] [date] NULL,
	[ManagementFee] [decimal](28, 14) NULL,
	[PerformanceFee] [decimal](28, 14) NULL,
	[HurdleRate] [decimal](28, 14) NULL,
 CONSTRAINT [PK_ShareClass] PRIMARY KEY CLUSTERED 
(
	[ShareClassId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_ShareClass] UNIQUE NONCLUSTERED 
(
	[EntityId] ASC,
	[ShareClassName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[ShareClassSeries]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ShareClassSeries](
	[ShareClassSeriesId] [int] IDENTITY(1,1) NOT NULL,
	[ShareClassId] [int] NOT NULL,
	[IFSClassId] [int] NOT NULL,
	[Ccy] [char](3) NOT NULL,
	[IsNewIssueRestricted] [bit] NOT NULL,
	[IsInternal] [bit] NOT NULL,
	[SeriesName] [varchar](64) NOT NULL,
	[Comment] [varchar](64) NULL,
 CONSTRAINT [PK_ShareClassSeries] PRIMARY KEY CLUSTERED 
(
	[ShareClassSeriesId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_ShareClassSeries] UNIQUE NONCLUSTERED 
(
	[ShareClassId] ASC,
	[IFSClassId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Users]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[UsersId] [int] IDENTITY(1,1) NOT NULL,
	[UserName] [varchar](64) NOT NULL,
 CONSTRAINT [PK_Users] PRIMARY KEY CLUSTERED 
(
	[UsersId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_Users] UNIQUE NONCLUSTERED 
(
	[UserName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[XLCrosstab]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[XLCrosstab](
	[XLCrosstabId] [int] IDENTITY(1,1) NOT NULL,
	[CrosstabName] [varchar](255) NOT NULL,
	[XLWorksheetId] [int] NOT NULL,
	[ViewName] [varchar](50) NOT NULL,
 CONSTRAINT [PK_XLCrosstab] PRIMARY KEY CLUSTERED 
(
	[XLCrosstabId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_XLCrosstab] UNIQUE NONCLUSTERED 
(
	[CrosstabName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[XLCrosstabRowColumn]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[XLCrosstabRowColumn](
	[XLCrosstabRowColumnId] [int] IDENTITY(1,1) NOT NULL,
	[CrosstabRowColumnName] [varchar](255) NOT NULL,
	[XLCrosstabId] [int] NOT NULL,
	[IsRow] [bit] NOT NULL,
	[Ordering] [int] NOT NULL,
 CONSTRAINT [PK_XLCrosstabRowColumn] PRIMARY KEY CLUSTERED 
(
	[XLCrosstabRowColumnId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_XLCrosstabRowColumn] UNIQUE NONCLUSTERED 
(
	[CrosstabRowColumnName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[XLWorkbook]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[XLWorkbook](
	[XLWorkbookId] [int] IDENTITY(1,1) NOT NULL,
	[WorkbookName] [varchar](255) NOT NULL,
 CONSTRAINT [PK_XLWorkbook] PRIMARY KEY CLUSTERED 
(
	[XLWorkbookId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_XLWorkbook] UNIQUE NONCLUSTERED 
(
	[WorkbookName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[XLWorksheet]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[XLWorksheet](
	[XLWorksheetId] [int] IDENTITY(1,1) NOT NULL,
	[WorksheetName] [varchar](255) NOT NULL,
	[XLWorkbookId] [int] NOT NULL,
 CONSTRAINT [PK_XLWorksheet] PRIMARY KEY CLUSTERED 
(
	[XLWorksheetId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_XLWorksheet] UNIQUE NONCLUSTERED 
(
	[WorksheetName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[XLWorksheetTable]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[XLWorksheetTable](
	[XLWorksheetTableId] [int] IDENTITY(1,1) NOT NULL,
	[WorksheetTableName] [varchar](255) NOT NULL,
	[XLWorksheetId] [int] NOT NULL,
	[ViewName] [varchar](50) NOT NULL,
	[PivotViewName] [varchar](50) NOT NULL,
 CONSTRAINT [PK_XLWorksheetTable] PRIMARY KEY CLUSTERED 
(
	[XLWorksheetTableId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_XLWorksheetTable] UNIQUE NONCLUSTERED 
(
	[WorksheetTableName] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[XLWorksheetTableColumn]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[XLWorksheetTableColumn](
	[XLWorksheetTableColumnId] [int] IDENTITY(1,1) NOT NULL,
	[WorksheetTableColumnName] [varchar](255) NOT NULL,
	[DisplayName1] [varchar](50) NULL,
	[XLWorksheetTableId] [int] NOT NULL,
	[ViewColumn] [varchar](50) NULL,
	[DisplayName2] [varchar](50) NULL,
	[Formula] [varchar](2000) NULL,
	[Ordering] [int] NOT NULL,
	[ForEach] [varchar](50) NULL,
	[Grouping] [varchar](50) NULL,
	[Format] [varchar](50) NULL,
	[FXExceptionTyp] [varchar](50) NULL,
	[MasterExceptionTyp] [varchar](50) NULL,
	[IsPivotViewKey] [bit] NULL,
 CONSTRAINT [PK_XLWorksheetTableColumn] PRIMARY KEY CLUSTERED 
(
	[XLWorksheetTableColumnId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY],
 CONSTRAINT [UQ_XLWorksheetTableColumn] UNIQUE NONCLUSTERED 
(
	[WorksheetTableColumnName] ASC,
	[DisplayName1] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  View [dbo].[vw_Entity]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

	CREATE VIEW [dbo].[vw_Entity]
	AS
	SELECT

	-- <GENERATOR COMMENT>
	-- Script auto generated on 6/17/2015 12:28:56 PM by DWIM.Core.DatabaseSchemaGenerator, Version=18.33.2.0, Culture=neutral, PublicKeyToken=null
	-- Domain Object Type: DWIM.Core.TradeDataModel.StaticData.Entity, DWIM.Core.TradeDataModel, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
	-- Do not modify by hand unless you know what you're doing
	-- </GENERATOR COMMENT>

	base.[EntityName] as [EntityName],
	base.[EntityHierarchyName] as [EntityHierarchyName],
	base.[NodeId] as [NodeId],
	base.[IsRoot] as [IsRoot],
	base.[Description] as [Description],
	base.[EntityType] as [EntityType],
	base.[IsInternal] as [IsInternal],
	base.[InternalBookName] as [InternalBookName],
	base.[MurexFundName] as [MurexFundName],
	base.[MurexCounterpartyName] as [MurexCounterpartyName],
	base.[MurexInstrumentName] as [MurexInstrumentName],
	base.[IFSFundName] as [IFSFundName],
	base.[JurisdictionName] as [JurisdictionName],
	base.[CompanyRegistrationNumber] as [CompanyRegistrationNumber],
	base.[MarkitEntityIdentifier] as [MarkitEntityIdentifier],
	base.[EmployerIdentificationNumber] as [EmployerIdentificationNumber],
	base.[Comment] as [Comment],
	base.[LegalEntityCode] as [LegalEntityCode],
	base.[ObjectVersion] as [ObjectVersion]
	FROM dev_Entity base

GO
ALTER TABLE [dbo].[Entity] ADD  CONSTRAINT [DF_Entity_IsOffshore]  DEFAULT ((0)) FOR [IsOffshore]
GO
ALTER TABLE [dbo].[Entity] ADD  CONSTRAINT [DF_Entity_AreFeesAllocated]  DEFAULT ((0)) FOR [AreFeesAllocated]
GO
ALTER TABLE [dbo].[Entity] ADD  CONSTRAINT [DF_Entity_IsTradingEntity]  DEFAULT ((0)) FOR [IsTradingEntity]
GO
ALTER TABLE [dbo].[AccountingPeriodLocked]  WITH CHECK ADD  CONSTRAINT [FK_AccountingPeriodLocked_AccountingPeriodId] FOREIGN KEY([AccountingPeriodId])
REFERENCES [dbo].[AccountingPeriod] ([AccountingPeriodId])
GO
ALTER TABLE [dbo].[AccountingPeriodLocked] CHECK CONSTRAINT [FK_AccountingPeriodLocked_AccountingPeriodId]
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD  CONSTRAINT [FK_Activity_AccountId] FOREIGN KEY([AccountId])
REFERENCES [dbo].[Account] ([AccountId])
GO
ALTER TABLE [dbo].[Activity] CHECK CONSTRAINT [FK_Activity_AccountId]
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD  CONSTRAINT [FK_Activity_AccountingPeriodId] FOREIGN KEY([AccountingPeriodId])
REFERENCES [dbo].[AccountingPeriod] ([AccountingPeriodId])
GO
ALTER TABLE [dbo].[Activity] CHECK CONSTRAINT [FK_Activity_AccountingPeriodId]
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD  CONSTRAINT [FK_Activity_EntityId] FOREIGN KEY([EntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[Activity] CHECK CONSTRAINT [FK_Activity_EntityId]
GO
ALTER TABLE [dbo].[Activity]  WITH CHECK ADD  CONSTRAINT [FK_Activity_OriginalAccountId] FOREIGN KEY([OriginalAccountId])
REFERENCES [dbo].[Account] ([AccountId])
GO
ALTER TABLE [dbo].[Activity] CHECK CONSTRAINT [FK_Activity_OriginalAccountId]
GO
ALTER TABLE [dbo].[Allocation]  WITH CHECK ADD  CONSTRAINT [FK_Allocation_AccountingPeriodId] FOREIGN KEY([AccountingPeriodId])
REFERENCES [dbo].[AccountingPeriod] ([AccountingPeriodId])
GO
ALTER TABLE [dbo].[Allocation] CHECK CONSTRAINT [FK_Allocation_AccountingPeriodId]
GO
ALTER TABLE [dbo].[Allocation]  WITH CHECK ADD  CONSTRAINT [FK_Allocation_AllocationEntityEntityId] FOREIGN KEY([AllocationEntityEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[Allocation] CHECK CONSTRAINT [FK_Allocation_AllocationEntityEntityId]
GO
ALTER TABLE [dbo].[Allocation]  WITH CHECK ADD  CONSTRAINT [FK_Allocation_InvestmentId] FOREIGN KEY([InvestmentId])
REFERENCES [dbo].[Investment] ([InvestmentId])
GO
ALTER TABLE [dbo].[Allocation] CHECK CONSTRAINT [FK_Allocation_InvestmentId]
GO
ALTER TABLE [dbo].[AllocationValue]  WITH CHECK ADD  CONSTRAINT [FK_AllocationValue_AllocationId] FOREIGN KEY([AllocationId])
REFERENCES [dbo].[Allocation] ([AllocationId])
GO
ALTER TABLE [dbo].[AllocationValue] CHECK CONSTRAINT [FK_AllocationValue_AllocationId]
GO
ALTER TABLE [dbo].[CapitalActivity]  WITH CHECK ADD  CONSTRAINT [FK_CapitalActivity_AccountingPeriodId] FOREIGN KEY([AccountingPeriodId])
REFERENCES [dbo].[AccountingPeriod] ([AccountingPeriodId])
GO
ALTER TABLE [dbo].[CapitalActivity] CHECK CONSTRAINT [FK_CapitalActivity_AccountingPeriodId]
GO
ALTER TABLE [dbo].[CapitalActivity]  WITH CHECK ADD  CONSTRAINT [FK_CapitalActivity_FromInvestmentId] FOREIGN KEY([FromInvestmentId])
REFERENCES [dbo].[Investment] ([InvestmentId])
GO
ALTER TABLE [dbo].[CapitalActivity] CHECK CONSTRAINT [FK_CapitalActivity_FromInvestmentId]
GO
ALTER TABLE [dbo].[CapitalActivity]  WITH CHECK ADD  CONSTRAINT [FK_CapitalActivity_ToInvestmentId] FOREIGN KEY([ToInvestmentId])
REFERENCES [dbo].[Investment] ([InvestmentId])
GO
ALTER TABLE [dbo].[CapitalActivity] CHECK CONSTRAINT [FK_CapitalActivity_ToInvestmentId]
GO
ALTER TABLE [dbo].[DealEntity]  WITH CHECK ADD  CONSTRAINT [FK_DealEntity_DealId] FOREIGN KEY([DealId])
REFERENCES [dbo].[Deal] ([DealId])
GO
ALTER TABLE [dbo].[DealEntity] CHECK CONSTRAINT [FK_DealEntity_DealId]
GO
ALTER TABLE [dbo].[DealEntity]  WITH CHECK ADD  CONSTRAINT [FK_DealEntity_EntityId] FOREIGN KEY([EntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[DealEntity] CHECK CONSTRAINT [FK_DealEntity_EntityId]
GO
ALTER TABLE [dbo].[DealOrder]  WITH CHECK ADD  CONSTRAINT [FK_DealOrder_DealId] FOREIGN KEY([DealId])
REFERENCES [dbo].[Deal] ([DealId])
GO
ALTER TABLE [dbo].[DealOrder] CHECK CONSTRAINT [FK_DealOrder_DealId]
GO
ALTER TABLE [dbo].[DealOrder]  WITH CHECK ADD  CONSTRAINT [FK_DealOrder_EntityId] FOREIGN KEY([EntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[DealOrder] CHECK CONSTRAINT [FK_DealOrder_EntityId]
GO
ALTER TABLE [dbo].[EntityAccount]  WITH CHECK ADD  CONSTRAINT [FK_EntityAccount_AccountId] FOREIGN KEY([AccountId])
REFERENCES [dbo].[Account] ([AccountId])
GO
ALTER TABLE [dbo].[EntityAccount] CHECK CONSTRAINT [FK_EntityAccount_AccountId]
GO
ALTER TABLE [dbo].[EntityAccount]  WITH CHECK ADD  CONSTRAINT [FK_EntityAccount_AccountingPeriodId] FOREIGN KEY([AccountingPeriodId])
REFERENCES [dbo].[AccountingPeriod] ([AccountingPeriodId])
GO
ALTER TABLE [dbo].[EntityAccount] CHECK CONSTRAINT [FK_EntityAccount_AccountingPeriodId]
GO
ALTER TABLE [dbo].[EntityAccount]  WITH CHECK ADD  CONSTRAINT [FK_EntityAccount_EntityId] FOREIGN KEY([EntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[EntityAccount] CHECK CONSTRAINT [FK_EntityAccount_EntityId]
GO
ALTER TABLE [dbo].[EntityAccount]  WITH CHECK ADD  CONSTRAINT [FK_EntityAccount_OriginalAccountId] FOREIGN KEY([OriginalAccountId])
REFERENCES [dbo].[Account] ([AccountId])
GO
ALTER TABLE [dbo].[EntityAccount] CHECK CONSTRAINT [FK_EntityAccount_OriginalAccountId]
GO
ALTER TABLE [dbo].[EntityCapitalActivity]  WITH CHECK ADD  CONSTRAINT [FK_EntityCapitalActivity_AccountingPeriodId] FOREIGN KEY([AccountingPeriodId])
REFERENCES [dbo].[AccountingPeriod] ([AccountingPeriodId])
GO
ALTER TABLE [dbo].[EntityCapitalActivity] CHECK CONSTRAINT [FK_EntityCapitalActivity_AccountingPeriodId]
GO
ALTER TABLE [dbo].[EntityCapitalActivity]  WITH CHECK ADD  CONSTRAINT [FK_EntityCapitalActivity_FromEntityId] FOREIGN KEY([FromEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[EntityCapitalActivity] CHECK CONSTRAINT [FK_EntityCapitalActivity_FromEntityId]
GO
ALTER TABLE [dbo].[EntityCapitalActivity]  WITH CHECK ADD  CONSTRAINT [FK_EntityCapitalActivity_TargetEntityId] FOREIGN KEY([TargetEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[EntityCapitalActivity] CHECK CONSTRAINT [FK_EntityCapitalActivity_TargetEntityId]
GO
ALTER TABLE [dbo].[EntityCapitalActivity]  WITH CHECK ADD  CONSTRAINT [FK_EntityCapitalActivity_ToEntityId] FOREIGN KEY([ToEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[EntityCapitalActivity] CHECK CONSTRAINT [FK_EntityCapitalActivity_ToEntityId]
GO
ALTER TABLE [dbo].[EntityOpeningCapital]  WITH CHECK ADD  CONSTRAINT [FK_EntityOpeningCapital_AccountingPeriodId] FOREIGN KEY([AccountingPeriodId])
REFERENCES [dbo].[AccountingPeriod] ([AccountingPeriodId])
GO
ALTER TABLE [dbo].[EntityOpeningCapital] CHECK CONSTRAINT [FK_EntityOpeningCapital_AccountingPeriodId]
GO
ALTER TABLE [dbo].[EntityOpeningCapital]  WITH CHECK ADD  CONSTRAINT [FK_EntityOpeningCapital_FromEntityId] FOREIGN KEY([FromEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[EntityOpeningCapital] CHECK CONSTRAINT [FK_EntityOpeningCapital_FromEntityId]
GO
ALTER TABLE [dbo].[EntityOpeningCapital]  WITH CHECK ADD  CONSTRAINT [FK_EntityOpeningCapital_ToEntityId] FOREIGN KEY([ToEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[EntityOpeningCapital] CHECK CONSTRAINT [FK_EntityOpeningCapital_ToEntityId]
GO
ALTER TABLE [dbo].[EntityRelationship]  WITH CHECK ADD  CONSTRAINT [FK_EntityRelationship_FromEntityId] FOREIGN KEY([FromEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[EntityRelationship] CHECK CONSTRAINT [FK_EntityRelationship_FromEntityId]
GO
ALTER TABLE [dbo].[EntityRelationship]  WITH CHECK ADD  CONSTRAINT [FK_EntityRelationship_RootEntityId] FOREIGN KEY([RootEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[EntityRelationship] CHECK CONSTRAINT [FK_EntityRelationship_RootEntityId]
GO
ALTER TABLE [dbo].[EntityRelationship]  WITH CHECK ADD  CONSTRAINT [FK_EntityRelationship_ToEntityId] FOREIGN KEY([ToEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[EntityRelationship] CHECK CONSTRAINT [FK_EntityRelationship_ToEntityId]
GO
ALTER TABLE [dbo].[Investment]  WITH CHECK ADD  CONSTRAINT [FK_Investment_InvestorId] FOREIGN KEY([InvestorId])
REFERENCES [dbo].[Investor] ([InvestorId])
GO
ALTER TABLE [dbo].[Investment] CHECK CONSTRAINT [FK_Investment_InvestorId]
GO
ALTER TABLE [dbo].[Investment]  WITH CHECK ADD  CONSTRAINT [FK_Investment_ShareClassSeriesId] FOREIGN KEY([ShareClassSeriesId])
REFERENCES [dbo].[ShareClassSeries] ([ShareClassSeriesId])
GO
ALTER TABLE [dbo].[Investment] CHECK CONSTRAINT [FK_Investment_ShareClassSeriesId]
GO
ALTER TABLE [dbo].[OpeningCapital]  WITH CHECK ADD  CONSTRAINT [FK_OpeningCapital_AccountingPeriodId] FOREIGN KEY([AccountingPeriodId])
REFERENCES [dbo].[AccountingPeriod] ([AccountingPeriodId])
GO
ALTER TABLE [dbo].[OpeningCapital] CHECK CONSTRAINT [FK_OpeningCapital_AccountingPeriodId]
GO
ALTER TABLE [dbo].[OpeningCapital]  WITH CHECK ADD  CONSTRAINT [FK_OpeningCapital_InvestmentId] FOREIGN KEY([InvestmentId])
REFERENCES [dbo].[Investment] ([InvestmentId])
GO
ALTER TABLE [dbo].[OpeningCapital] CHECK CONSTRAINT [FK_OpeningCapital_InvestmentId]
GO
ALTER TABLE [dbo].[OpeningCapital]  WITH CHECK ADD  CONSTRAINT [FK_OpeningCapital_LevelEntityId] FOREIGN KEY([LevelEntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[OpeningCapital] CHECK CONSTRAINT [FK_OpeningCapital_LevelEntityId]
GO
ALTER TABLE [dbo].[Permission]  WITH CHECK ADD  CONSTRAINT [FK_Permission_UsersId] FOREIGN KEY([UsersId])
REFERENCES [dbo].[Users] ([UsersId])
GO
ALTER TABLE [dbo].[Permission] CHECK CONSTRAINT [FK_Permission_UsersId]
GO
ALTER TABLE [dbo].[ShareClass]  WITH CHECK ADD  CONSTRAINT [FK_ShareClass_EntityId] FOREIGN KEY([EntityId])
REFERENCES [dbo].[Entity] ([EntityId])
GO
ALTER TABLE [dbo].[ShareClass] CHECK CONSTRAINT [FK_ShareClass_EntityId]
GO
ALTER TABLE [dbo].[ShareClassSeries]  WITH CHECK ADD  CONSTRAINT [FK_ShareClassSeries_ShareClassId] FOREIGN KEY([ShareClassId])
REFERENCES [dbo].[ShareClass] ([ShareClassId])
GO
ALTER TABLE [dbo].[ShareClassSeries] CHECK CONSTRAINT [FK_ShareClassSeries_ShareClassId]
GO
ALTER TABLE [dbo].[XLCrosstab]  WITH CHECK ADD  CONSTRAINT [FK_XLCrosstab_XLWorksheetId] FOREIGN KEY([XLWorksheetId])
REFERENCES [dbo].[XLWorksheet] ([XLWorksheetId])
GO
ALTER TABLE [dbo].[XLCrosstab] CHECK CONSTRAINT [FK_XLCrosstab_XLWorksheetId]
GO
ALTER TABLE [dbo].[XLCrosstabRowColumn]  WITH CHECK ADD  CONSTRAINT [FK_XLCrosstabRowColumn_XLCrosstabId] FOREIGN KEY([XLCrosstabId])
REFERENCES [dbo].[XLCrosstab] ([XLCrosstabId])
GO
ALTER TABLE [dbo].[XLCrosstabRowColumn] CHECK CONSTRAINT [FK_XLCrosstabRowColumn_XLCrosstabId]
GO
ALTER TABLE [dbo].[XLWorksheet]  WITH CHECK ADD  CONSTRAINT [FK_XLWorksheet_XLWorkbookId] FOREIGN KEY([XLWorkbookId])
REFERENCES [dbo].[XLWorkbook] ([XLWorkbookId])
GO
ALTER TABLE [dbo].[XLWorksheet] CHECK CONSTRAINT [FK_XLWorksheet_XLWorkbookId]
GO
ALTER TABLE [dbo].[XLWorksheetTable]  WITH CHECK ADD  CONSTRAINT [FK_XLWorksheetTable_XLWorksheetId] FOREIGN KEY([XLWorksheetId])
REFERENCES [dbo].[XLWorksheet] ([XLWorksheetId])
GO
ALTER TABLE [dbo].[XLWorksheetTable] CHECK CONSTRAINT [FK_XLWorksheetTable_XLWorksheetId]
GO
ALTER TABLE [dbo].[XLWorksheetTableColumn]  WITH CHECK ADD  CONSTRAINT [FK_XLWorksheetTableColumn_XLWorksheetTableId] FOREIGN KEY([XLWorksheetTableId])
REFERENCES [dbo].[XLWorksheetTable] ([XLWorksheetTableId])
GO
ALTER TABLE [dbo].[XLWorksheetTableColumn] CHECK CONSTRAINT [FK_XLWorksheetTableColumn_XLWorksheetTableId]
GO
/****** Object:  StoredProcedure [dbo].[InsertUpdateCapitalAdjustment]    Script Date: 8/20/2019 11:10:29 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
                        command.Parameters.AddWithValue("subscription", subscription);
                        command.Parameters.AddWithValue("redemption", redemption);
                        command.Parameters.AddWithValue("xfer", xfer);
                        command.Parameters.AddWithValue("xferIncentive", xferIncentive);
                        command.Parameters.AddWithValue("crystalizedIncentive", crystalizedIncentive);
*/

CREATE PROCEDURE [dbo].[InsertUpdateCapitalAdjustment] 
    @valueDate DateTime, 
    @Id int,
	@subscription numeric(18,8),
	@redemption numeric(18,8),
	@xfer numeric(18,8),
	@xferIncentive numeric(18,8),
	@crystalizedIncentive numeric(18,8)
AS 
begin
    SET NOCOUNT ON;

declare @shareClassSeriesId int
select @shareClassSeriesId = shareClassSeriesId from ShareClassSeries where IFSClassId = @id

if exists(select * from CapitalChanges where valueDate = @valueDate and shareClassSeriesId = @shareClassSeriesId )
begin
	update CapitalChanges set subscription = @subscription, redemption = @redemption, xfer = @xfer, xferedIncentive = @xferIncentive, crystalisedIncentive = @crystalizedIncentive 
	where valueDate = @valueDate and shareClassSeriesId = @shareClassSeriesId
end
else
begin
	insert into CapitalChanges ( valueDate, shareClassSeriesId, subscription, redemption, xfer, xferedIncentive, crystalisedIncentive ) 
	values (@valueDate, @shareClassSeriesId, @subscription, @redemption, @xfer, @xferIncentive, @crystalizedIncentive)
end
End
GO
EXEC sys.sp_addextendedproperty @name=N'DWIM.ObjectPurpose', @value=N'DataTable' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ShareClass'
GO
EXEC sys.sp_addextendedproperty @name=N'DWIM.ObjectType', @value=N'DWIM.FundAccounting.FundAccountingDataModel.StaticData.ShareClass, DWIM.FundAccounting.FundAccountingDataModel, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ShareClass'
GO
EXEC sys.sp_addextendedproperty @name=N'DWIM.ObjectPurpose', @value=N'DataTable' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ShareClassSeries'
GO
EXEC sys.sp_addextendedproperty @name=N'DWIM.ObjectType', @value=N'DWIM.FundAccounting.FundAccountingDataModel.StaticData.ShareClassSeries, DWIM.FundAccounting.FundAccountingDataModel, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'TABLE',@level1name=N'ShareClassSeries'
GO
USE [master]
GO
ALTER DATABASE [FundAccounting] SET  READ_WRITE 
GO
