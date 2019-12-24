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
into #current_revenues
from vwJournal where AccountCategory in ( 'Revenues' )
and [when] >= @startDate and [when] <= @businessDate
group by Fund

select Fund, sum(credit) as credit, sum(debit) as debit, sum(debit-credit) as balance 
into #current_expences
from vwJournal where AccountCategory in ( 'Expenses' )
and [when] >= @startDate and [when] <= @businessDate
group by Fund

-- select * from #current

select Fund, sum(credit) as credit, sum(debit) as debit, sum(debit-credit) as balance 
into #prev_revenues
from vwJournal where AccountCategory in ( 'Revenues' )
and [when] >= @startDate and [when] <= @prevbusinessDate
group by Fund

select Fund, sum(credit) as credit, sum(debit) as debit, sum(debit-credit) as balance 
into #prev_expences
from vwJournal where AccountCategory in ( 'Expenses' )
and [when] >= @startDate and [when] <= @prevbusinessDate
group by Fund

-- select * from #prev

select ce.Fund, 
0 as Debit,
0 as Credit,
(coalesce(ce.Balance,0) + coalesce(cr.balance,0)) - (coalesce(pe.balance,0) + coalesce(pr.balance,0)) as Balance
from #current_expences as ce
left outer join #current_revenues as cr on cr.Fund = ce.Fund
left outer join #prev_expences as pe on pe.Fund = ce.Fund
left outer join #prev_revenues as pr on pr.Fund = ce.Fund

RETURN 0
