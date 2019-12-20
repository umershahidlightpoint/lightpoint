CREATE VIEW [dbo].[vwJournalFull]
	AS 

select vw.*, 
	t.TradeId, 
	t.Action, 
	t.Status, 
	t.CustodianCode, 
	t.SecurityType 
from vwJournal vw
left outer join vwCurrentStateTrades t on t.LpOrderId = vw.source
GO
