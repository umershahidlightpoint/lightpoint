CREATE PROCEDURE [dbo].[DayPnlReconcile]
	@businessDate Date
AS
declare @busdate as date
set @busdate = @businessDate

select @busDate as BusDate, SecurityCode, DayPnL as [Bookmon DayPnL]
into #bookmon_pnl
from PositionMaster..intradayPositionSplit 
where BusDate = @busdate and LastModifiedOn = ( select max(LastModifiedOn) from PositionMaster..intradayPositionSplit where BusDate = @busdate) and DayPnL != 0
order by SecurityCode

select @busDate as BusDate, Symbol, sum(credit) - sum(debit) as [PA DayPnl]
into #pa_pnl
from vwJournal
where [when] = @busdate and event = 'unrealizedpnl' and AccountType = 'CHANGE IN UNREALIZED GAIN/(LOSS)'
group by Symbol
order by symbol

select Coalesce(bp.BusDate, pp.BusDate) BusDate, Coalesce(bp.SecurityCode, pp.Symbol) as Symbol, bp.[Bookmon DayPnL], pp.[PA DayPnl], bp.[Bookmon DayPnL] - pp.[PA DayPnl] as DiffPnL from #bookmon_pnl bp full outer join #pa_pnl pp on bp.BusDate = pp.BusDate and bp.SecurityCode = pp.Symbol
order by Symbol asc

drop table #pa_pnl
drop table #bookmon_pnl

RETURN 0
