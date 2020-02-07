CREATE PROCEDURE [dbo].[CacheBatchResults_rd]
  @BatchSize int
AS

DECLARE @From INT
DECLARE @To INT
DECLARE @TotalCount INT




RAISERROR ('Preparing', 0, 1) WITH NOWAIT

	select * into #current_trade_state from vwCurrentStateTrades 
	select * into #current_journal from vwJournal


	SELECT @TotalCount = MAX(id), @From = MIN(id)  FROM #current_journal
	SET @To = @From + @BatchSize

	RAISERROR ('Dropping table', 0, 1) WITH NOWAIT
	drop table if exists current_journal_full

	RAISERROR ('Creating table', 0, 1) WITH NOWAIT
	CREATE TABLE [dbo].[current_journal_full](
	[when] [datetime] NULL,
	[event] [varchar](100) NULL,
	[credit] [numeric](22, 9) NULL,
	[debit] [numeric](22, 9) NULL,
	[symbol] [varchar](100) NULL,
	[security_id] [int] NULL,
	[quantity] [numeric](22, 9) NULL,
	[id] [int] NULL,
	[account_id] [int] NULL,
	[fx_currency] [varchar](3) NULL,
	[fund] [varchar](50) NULL,
	[AccountCategory] [varchar](50) NULL,
	[AccountType] [varchar](100) NULL,
	[accountName] [varchar](100) NULL,
	[accountDescription] [varchar](100) NULL,
	[value] [numeric](22, 9) NULL,
	[source] [varchar](50) NULL,
	[start_price] [numeric](22, 9) NULL,
	[end_price] [numeric](22, 9) NULL,
	[fxrate] [numeric](22, 9) NULL,
	[is_account_to] [bit] NOT NULL,
	[TradeDate] [datetime] NULL,
	[SettleDate] [datetime] NULL,
	[TradeId] [varchar](127) NULL,
	[Action] [varchar](31) NULL,
	[Status] [varchar](20) NULL,
	[CustodianCode] [varchar](63) NULL,
	[SecurityType] [varchar](63) NULL,
	[Side] [varchar](63) NULL
) ON [PRIMARY]


ALTER TABLE [dbo].[current_journal_full] ADD  DEFAULT ((1)) FOR [is_account_to]

	RAISERROR ('Populating current_journal_full', 0, 1) WITH NOWAIT
	WHILE @From < @TotalCount
	
		BEGIN
			insert into current_journal_full
			select vw.*, 
			t.TradeDate,
			t.SettleDate,
			t.TradeId, 
			t.Action, 
			t.Status, 
			t.CustodianCode, 
			t.SecurityType,
			t.Side
			from #current_journal vw
			left outer join #current_trade_state t on t.LpOrderId = vw.source
			where vw.id >= @From and vw.id < @To

			print 'inserting ranges: ' + Convert(varchar(100), @From) + 'to ' + Convert(varchar(100), @To);
			SET @From = @To
			SET @To = @To + @BatchSize
		END


RAISERROR ('Creating Indexes', 0, 1) WITH NOWAIT
create clustered index Ix_current_journal_full_when
ON current_journal_full([when] desc)


create nonclustered index Ix_current_journal_full_covering_index
ON current_journal_full ([when],accountcategory, accounttype, fund, accountname) INCLUDE (source,[event], credit,debit,symbol,security_id, quantity, id, account_id, fx_currency,accountdescription,[value], start_price, end_price,fxrate,is_account_to,tradedate,settledate,tradeid,[action],[status],custodiancode,securitytype,side);

RAISERROR ('Completed', 0, 1) WITH NOWAIT

	select count(*), 'journal entries' from #current_journal
	union
	select count(*), 'trade population' from #current_trade_state

RETURN 0
GO
