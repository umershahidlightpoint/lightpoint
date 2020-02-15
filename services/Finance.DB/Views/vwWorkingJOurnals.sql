/*
select distinct PositionDirection  from [vwWorkingJournals]
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
	t.Side,
	case 
		when t.Side = 'BUY' then 'LONG' 
		else 'SHORT'
	end as PositionDirection
from vwJournal vw
left outer join vwCurrentStateTrades t on t.LpOrderId = vw.source
GO


