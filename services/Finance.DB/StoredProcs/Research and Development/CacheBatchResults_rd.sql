/*
exec [CacheBatchResults_rd] 100000
*/

CREATE PROCEDURE [dbo].[CacheBatchResults_rd]
  @BatchSize int
AS

DECLARE @From INT
DECLARE @rowCount INT
DECLARE @To INT
DECLARE @TotalCount INT
DECLARE @TotalNumberOfRecords INT
DECLARE @Step INT
DECLARE @Percentage numeric(22,9)
DECLARE @Message varchar(500)
DECLARE @TotalProcessed INT

SET NOCOUNT ON

set @Step = 0

RAISERROR ('Preparing', 0, 1) WITH NOWAIT

set @Message = 'Batch Size ' + Convert(varchar(10), @BatchSize);

RAISERROR (@message, 0, 1) WITH NOWAIT

	SELECT @TotalNumberOfRecords = count(*) FROM vwJournal
	SELECT @TotalCount = MAX(id), @From = MIN(id)  FROM vwJournal
	SET @To = @From + @BatchSize
	SET @TotalProcessed = 0

	RAISERROR ('Dropping table', 0, 1) WITH NOWAIT
	drop table if exists current_journal_full

	RAISERROR ('Creating table', 0, 1) WITH NOWAIT
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


ALTER TABLE [dbo].[current_journal_full] ADD  DEFAULT ((1)) FOR [is_account_to]

	RAISERROR ('Populating current_journal_full', 0, 1) WITH NOWAIT
	WHILE @TotalProcessed < @TotalNumberOfRecords
	
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
			t.Side,
			t.TradeCurrency,
			t.SettleCurrency
			from vwJournal vw
			left outer join current_trade_state t on t.LpOrderId = vw.source
			where vw.id >= @From and vw.id < @To

			SET @rowCount = @@ROWCOUNT

			SET @TotalProcessed = @TotalProcessed + @rowCount

			SET @Percentage = (Convert(numeric(22,9), @TotalProcessed) / Convert(numeric(22,9), @TotalNumberOfRecords)) * 100

			set @Message = '[' + Convert(varchar(100), @Step) + '] [' + Convert(varchar(100), @rowCount) + '] [' + Convert(varchar(100), ROUND(@Percentage, 2))+ '] inserting ranges: ' + Convert(varchar(100), @From) + ' to ' + Convert(varchar(100), @To)

			RAISERROR (@message, 0,1) with nowait
			SET @From = @To
			SET @To = @To + @BatchSize
			Set @Step = @Step + 1
		END


RAISERROR ('Creating Clustered Indexes', 0, 1) WITH NOWAIT
create clustered index Ix_current_journal_full_when
ON current_journal_full([when] desc)

RAISERROR ('Creating Non Clustered Indexes', 0, 1) WITH NOWAIT
create nonclustered index Ix_current_journal_full_covering_index
ON current_journal_full ([when],accountcategory, accounttype, fund, accountname) INCLUDE (source,[event], credit,debit,symbol,security_id, quantity, id, account_id, fx_currency,accountdescription,[value], start_price, end_price,fxrate,is_account_to,tradedate,settledate,tradeid,[action],[status],custodiancode,securitytype,side);

RAISERROR ('Completed', 0, 1) WITH NOWAIT

	select count(*), 'journal entries' from vwJournal
	union
	select count(*), 'trade population' from current_trade_state

RETURN 0
