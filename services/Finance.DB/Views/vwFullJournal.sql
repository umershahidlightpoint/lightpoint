/*
Requires that the CacheResults sp is run first to populate the two tables, current_XXXXX
*/
CREATE VIEW [dbo].[vwFullJournal]
	AS 

select vw.*, 
	t.TradeId, 
	t.Action, 
	t.Status, 
	t.CustodianCode, 
	t.SecurityType,
	t.Side
from current_journal vw
left outer join current_trade_state t on t.LpOrderId = vw.source
GO