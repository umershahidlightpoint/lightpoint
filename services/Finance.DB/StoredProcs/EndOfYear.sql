/*
exec EndOfYear 2019
*/
CREATE PROCEDURE [dbo].[EndOfYear]
	@year int
AS

declare @begin date
declare @end date

set @begin = DATEFROMPARTS(@year, 1, 1)
set @end = DATEFROMPARTS(@year, 12, 31)

print '[' + convert(varchar, @begin) + ']--[' + convert(varchar, @end) + ']'

select AccountCategory, AccountType, Fund, sum(debit) as debit, sum(credit) as credit
from vwWorkingJournals
where 
	AccountCategory in ('Revenues', 'Expenses') and 
	([when] >=@begin and [when] <= @end)
group by AccountCategory, AccountType, Fund
order by AccountCategory, AccountType, Fund

RETURN 0