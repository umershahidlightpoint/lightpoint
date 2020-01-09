/*
Run at the end of the process to create a cached data set that can be used by vwFullJournal etc

exec CacheResults 
*/
CREATE PROCEDURE [dbo].[CacheResults]
AS

	truncate table current_trade_state

	insert into current_trade_state
	select * from vwCurrentStateTrades 

	truncate table current_journal

	insert into current_journal
	select * from vwJournal

	select count(*), 'journal entries' from current_journal
	union
	select count(*), 'trade population' from current_trade_state

RETURN 0


