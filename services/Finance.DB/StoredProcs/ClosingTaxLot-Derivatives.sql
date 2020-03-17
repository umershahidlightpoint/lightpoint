/*
Example of usage
exec [ClosingTaxLot-Derivatives] '2019-07-01', '4edd54ee-d873-4ca3-9ada-bfb9c6576f11'
*/
CREATE PROCEDURE [dbo].[ClosingTaxLot-Derivatives]
	@busDate Date,
	@LpOrderId varchar(100)
AS

-- gets the unrealized to unwind
select symbol, source, sum(debit-credit) as balance from vwJournal 
where 
AccountType = 'Mark to Market Derivatives Contracts at Fair Value (Liabilities)' 
and [when] < @busDate
and [source] = @LpOrderId
group by symbol, source

-- gets the unrealized fx to unwind
select symbol, source, sum(debit-credit) as balance from vwJournal 
where 
AccountType = 'Mark to Market Derivatives Contracts at Fair Value (Assets)'
and [when] < @busDate
and [source] = @LpOrderId
group by symbol, source

RETURN 0