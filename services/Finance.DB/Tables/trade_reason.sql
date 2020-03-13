CREATE TABLE [dbo].[trade_reason]
(
	[LPOrderId] [varchar](127) not null,
	[Reason] varchar(MAX) null,
	[CreatedBy] varchar(100) null,
	[CreatedDate] datetime null
)
