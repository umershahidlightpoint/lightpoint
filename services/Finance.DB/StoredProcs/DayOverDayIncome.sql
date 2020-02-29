/*
declare @busDate Date
declare @startDate Date
declare @prevDate Date

set @startDate = '2020-01-01'
set @busDate = '2020-01-04'
set @prevDate = '2020-01-03'

exec [DayOverDayIncome] @startDate, @busDate, @prevDate
*/
CREATE PROCEDURE [dbo].[DayOverDayIncome]
	@startDate Date,
	@businessDate Date,
	@prevbusinessDate Date
AS

select Fund, sum(debit) as Debit, sum(credit) as Credit, sum(debit-credit) as Balance from vwJournal
where AccountCategory in ( 'Revenues', 'Expenses' )
and [when] > @prevbusinessDate and [when] <= @businessDate
group by Fund

RETURN 0