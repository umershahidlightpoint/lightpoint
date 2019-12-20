CREATE PROCEDURE [dbo].[ClosingTaxLot]
	@busDate Date,
	@LpOrderId varchar(100)
AS

-- gets the unrealized to unwind
select symbol, source, sum(debit-credit) as realized_pnl from vwJournal 
where 
AccountType = 'CHANGE IN UNREALIZED GAIN/(LOSS)' 
and [event] = 'unrealizedpnl' 
and [when] <= @busDate
and [source] = @LpOrderId
group by symbol, source

-- gets the unrealized fx to unwind
select symbol, source, sum(debit-credit) as realized_fx from vwJournal 
where 
AccountType = 'Mark to Market longs fx translation gain or loss' 
and [event] = 'unrealized-cash-fx' 
and [when] <= @busDate
and [source] = @LpOrderId
group by symbol, source
RETURN 0
