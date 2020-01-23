CREATE PROCEDURE [dbo].[RunStats]
AS
select count(*) from vwJournal

select AccountCategory, count(*) from vwJournal
group by AccountCategory

select [when], count(*) from vwJournal
group by [when]
order by [when] desc

select [event], count(*) from vwJournal
group by [event]
order by [event] desc

select Symbol, count(*) from vwWorkingJournals
group by Symbol
order by Symbol desc

select SecurityType, count(*) from vwWorkingJournals
group by SecurityType
order by SecurityType desc

select fx_currency, count(*) from vwJournal
group by fx_currency
order by fx_currency desc

RETURN 0
