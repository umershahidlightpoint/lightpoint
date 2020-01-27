/*
Requires that the CacheResults sp is run first to populate the two tables, current_XXXXX
*/
CREATE VIEW [dbo].[vwFullJournal]
	AS 

select vw.*
from current_journal_full vw

GO


