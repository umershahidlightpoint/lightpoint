/*
select distinct LongShort from vwFullJournal

Requires that the CacheResults sp is run first to populate the two tables, current_XXXXX
*/
CREATE VIEW [dbo].[vwFullJournal]
	AS 

select *, 
case
	when AccountType in ('Settled Cash') then 'LONG'
	when Side in ('BUY', 'SELL') then 'LONG'
	when Side in ('SHORT', 'COVER') then 'SHORT'
	else 'NonTrading'
end as LongShort
from current_journal_full
GO