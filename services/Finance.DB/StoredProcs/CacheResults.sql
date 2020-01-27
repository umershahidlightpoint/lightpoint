/*
Run at the end of the process to create a cached data set that can be used by vwFullJournal etc

exec CacheResults 
*/
CREATE PROCEDURE [dbo].[CacheResults]
AS

	select * into #current_trade_state from vwCurrentStateTrades 
	select * into #current_journal from vwJournal

	drop index Ix_current_journal_full_when on current_journal_full
	drop index Ix_current_journal_full_covering_index on current_journal_full

	truncate table current_journal_full

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

create clustered index Ix_current_journal_full_when
ON current_journal_full([when] desc)


create nonclustered index Ix_current_journal_full_covering_index
ON current_journal_full ([when],accountcategory, accounttype, fund, accountname) INCLUDE (source,[event], credit,debit,symbol,security_id, quantity, id, account_id, fx_currency,accountdescription,[value], start_price, end_price,fxrate,is_account_to,tradedate,settledate,tradeid,[action],[status],custodiancode,securitytype,side);


	select count(*), 'journal entries' from #current_journal
	union
	select count(*), 'trade population' from #current_trade_state

RETURN 0


