/*
select * from account_type where name like '%fx translation%'

exec ClosingTaxLot '2019-07-01', '4c4b21ba-ae60-47e1-9c87-4ce206bbeca8'

select credit, debit, credit-debit, * from vwJournal where source = '4c4b21ba-ae60-47e1-9c87-4ce206bbeca8'
and AccountType in ('Mark to Market longs fx translation gain or loss', 'Mark to Market shorts fx translation gain or loss')
and id != 120870553
order by id desc

select sum(credit-debit) from vwJournal where source = '4c4b21ba-ae60-47e1-9c87-4ce206bbeca8'
and AccountType in ('Mark to Market longs fx translation gain or loss', 'Mark to Market shorts fx translation gain or loss')
and id != 120870553

*/
CREATE PROCEDURE [dbo].[ClosingTaxLot]
	@busDate Date,
	@LpOrderId varchar(100)
AS

-- gets the unrealized to unwind
select symbol, source, sum(debit-credit) as unrealized_pnl from vwJournal 
where 
AccountType = 'CHANGE IN UNREALIZED GAIN/(LOSS)' 
and [event] in ('daily-unrealizedpnl', 'reverse-unrealizedpnl')
and [when] < @busDate
and [source] = @LpOrderId
group by symbol, source

-- gets the unrealized fx to unwind
select symbol, source, sum(debit-credit) as unrealized_fx_translation from vwJournal 
where 
AccountType in ('Mark to Market longs fx translation gain or loss', 'Mark to Market shorts fx translation gain or loss')
and [event] = 'unrealized-fx-translation' 
and [when] < @busDate
and [source] = @LpOrderId
group by symbol, source

select symbol, source, sum(debit-credit) as asset_daily_unrealizedpnl_fx from vwJournal 
where 
AccountType in ('FX MARKET TO MARKET ON STOCK COST', 'FX MARK TO MARKET ON STOCK COST (SHORTS)')
and [event] in ('daily-unrealizedpnl-fx', 'reversal-unrealized-cash-fx')
and [when] < @busDate
and [source] = @LpOrderId
group by symbol, source

select symbol, source, sum(debit-credit) as revenue_daily_unrealizedpnl_fx from vwJournal 
where 
AccountType = 'Change in unrealized due to fx on original Cost' 
and [event] in ('daily-unrealizedpnl-fx', 'reversal-unrealized-cash-fx')
and [when] < @busDate
and [source] = @LpOrderId
group by symbol, source

RETURN 0
