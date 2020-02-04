/*
exec [rd_JournalDetails] '3bbf9793-d01a-4a08-b25c-448fd1777ef1'
exec [rd_JournalDetails] 'be3ea75e-47f1-446d-8932-aee15aeacd07'
exec [rd_JournalDetails] '5686b2f0-b811-4614-b44d-5d0480370441'
exec [rd_JournalDetails] '3716b37d-ce02-492c-bd98-da330681c003'

exec [rd_JournalDetails] 'afac9da8-f043-4925-90a7-daa64c9f7d0c'

exec [rd_JournalDetails] 'ae948e88-1fe2-445f-913a-8e2ef686ff67'
*/

/*
Drill down for the details so that we can compare with the work that Bobby does, find the LPOrderId

Show all of the flows for the Revenues so that we can do a direct comparison with the UI and also
any sheet that shows these numbers as well
*/
CREATE PROCEDURE [dbo].[rd_JournalDetails]
	@source varchar(100)
AS

select LPOrderId, TradeDate,SettleDate, Symbol, Quantity from current_trade_state with(nowait) where LPOrderId = @source

select [when], event, AccountType, fx_currency, fxrate, quantity, start_price, end_price, (end_price - start_price), debit, credit, (debit-credit) 
from current_journal_full with(nowait) 
where source = @source
and AccountCategory = 'Revenues' and event = 'daily-unrealizedpnl'
order by [when] asc, event

select [when], event, AccountType, fx_currency, fxrate, quantity, start_price, end_price, (end_price - start_price), debit, credit, (debit-credit) 
from current_journal_full with(nowait) 
where source = @source
and AccountCategory = 'Revenues' and event = 'realizedpnl'
order by [when] asc, event

select [when], event, AccountType, fx_currency, quantity, fxrate, start_price, end_price, 
(end_price - start_price), 
debit, credit, (debit-credit)
from current_journal_full with(nowait) 
where source = @source
and AccountCategory = 'Revenues' and event = 'daily-unrealizedpnl-fx'
order by [when] asc, event

select [when], event, AccountType, fx_currency, quantity, fxrate, start_price, end_price, 
(end_price - start_price), 
debit, credit, (debit-credit)
from current_journal_full with(nowait) 
where source = @source
and AccountCategory = 'Revenues' and event = 'unrealized-fx-translation'
order by [when] asc, event

Return 0
