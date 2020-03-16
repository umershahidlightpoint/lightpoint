	CREATE TABLE [dbo].[current_journal_full](
	[when] [datetime] NULL,
	[event] [varchar](100) NULL,
	[credit] [numeric](22, 9) NULL,
	[debit] [numeric](22, 9) NULL,
	[local_credit] [numeric](22, 9) NULL,
	[local_debit] [numeric](22, 9) NULL,
	[symbol] [varchar](100) NULL,
	[security_id] [int] NULL,
	[quantity] [numeric](22, 9) NULL,
	[id] [int] NULL,
	[account_id] [int] NULL,
	[fx_currency] [varchar](3) NULL,
	[fund] [varchar](50) NULL,
	[AccountCategory] [varchar](50) NULL,
	[AccountType] [varchar](100) NULL,
	[AccountTypeId] [int] NULL,
	[accountName] [varchar](100) NULL,
	[accountDescription] [varchar](100) NULL,
	[value] [numeric](22, 9) NULL,
	[source] [varchar](50) NULL,
	[start_price] [numeric](22, 9) NULL,
	[end_price] [numeric](22, 9) NULL,
	[fxrate] [numeric](22, 9) NULL,
	[is_account_to] [bit] NOT NULL,
	[local_value] [numeric](22, 9) NULL,
	[TradeDate] [datetime] NULL,
	[SettleDate] [datetime] NULL,
	[TradeId] [varchar](127) NULL,
	[Action] [varchar](31) NULL,
	[Status] [varchar](20) NULL,
	[CustodianCode] [varchar](63) NULL,
	[SecurityType] [varchar](63) NULL,
	[Side] [varchar](63) NULL,
	[TradeCurrency] [varchar](20) NULL,
	SettleCurrency [varchar](20) NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[current_journal_full] ADD  DEFAULT ((1)) FOR [is_account_to]
GO

create clustered index Ix_current_journal_full_when
ON current_journal_full([when] desc)

GO

create nonclustered index Ix_current_journal_full_covering_index
ON current_journal_full ([when],accountcategory, accounttype, fund, accountname) INCLUDE (source,[event], credit,debit,symbol,security_id, quantity, id, account_id, fx_currency,accountdescription,[value], start_price, end_price,fxrate,is_account_to,tradedate,settledate,tradeid,[action],[status],custodiancode,securitytype,side);



