/*
declare @busDate Date
declare @startDate Date
declare @prevDate Date

set @busDate = '2019-12-18'
set @prevDate = '2019-12-17'
set @startDate = '2019-01-01'

exec [DayOverDayIncome] @startDate, @busDate, @prevDate
*/
CREATE PROCEDURE [dbo].[DayOverDayIncome]
	@startDate Date,
	@businessDate Date,
	@prevbusinessDate Date
AS
select Fund, sum(credit) as credit, sum(debit) as debit, sum(debit-credit) as balance 
into #current
from vwJournal where AccountCategory in ( 'Revenues', 'Expenses' )
and [when] >= @startDate and [when] < @businessDate
group by Fund

-- select * from #current

select Fund, sum(credit) as credit, sum(debit) as debit, sum(debit-credit) as balance 
into #prev
from vwJournal where AccountCategory in ( 'Revenues', 'Expenses' )
and [when] >= @startDate and [when] < @prevbusinessDate
group by Fund

-- select * from #prev

select c.Fund, 
c.Debit - p.debit as Debit,
c.Credit - p.Credit as Credit,
c.Balance - p.balance as Balance
from #current as c
inner join #prev as p on p.Fund = c.Fund
RETURN 0
GO