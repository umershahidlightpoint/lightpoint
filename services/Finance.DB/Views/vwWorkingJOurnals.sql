/*
*/
CREATE VIEW [dbo].[vwWorkingJournals]
	AS 

select vw.*, 
	t.TradeDate,
	t.SettleDate,
	t.TradeId, 
	t.Action, 
	t.Status, 
	t.CustodianCode, 
	t.SecurityType,
	t.Side
from vwJournal vw
left outer join vwCurrentStateTrades t on t.LpOrderId = vw.source
GO


