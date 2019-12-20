CREATE View [dbo].[vwFullJournal]
as
select vw.*, 
t.TradeId, t.Action, t.Status, t.CustodianCode, t.SecurityType 
from vwJournal vw
left outer join TradeMaster..Trade t on t.LpOrderId = vw.source
GO