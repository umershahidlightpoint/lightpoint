CREATE PROCEDURE [dbo].[DayPnlReconcile]
	@businessDate Date
AS
declare @busdate as date
set @busdate = @businessDate

select p.BusDate, s.BbergCode as SecurityCode, Fund, p.Currency,  Sum(DayPnL) as DayPnl 
into #bookmon_pnl
from PositionMaster..intradayPositionSplit p
inner join SecurityMaster..Security s on s.SecurityCode = p.SecurityCode
inner join ( select BusDate, Max(LastModifiedOn) as lmo  from PositionMaster..intradayPositionSplit group by BusDate) as lmo on lmo.BusDate = p.BusDate and lmo.lmo = p.LastModifiedOn
where p.BusDate = @busDate and p.SecurityCode not like '@CASH%' and p.SecurityCode not like 'ZZ_%'
group by p.BusDate, s.BbergCode, Fund, p.Currency
order by p.BusDate, BbergCode, Fund, p.Currency


select [when] as BusDate, symbol as SecurityCode, Fund, fx_currency as Currency, sum(credit - debit) as DayPnl 
into #pa_pnl
from vwJournal where [when] = @busDate
and AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)', 'fx gain or loss on unsettled balance')
group by [when], Symbol, Fund, fx_currency
order by [when], Symbol, Fund, fx_currency


-- Recon
select 
coalesce(p.BusDate, b.BusDate) as BusDate, 
coalesce(p.SecurityCode, b.SecurityCode) as Symbol, 
coalesce(p.Fund, b.Fund), coalesce(p.Currency, b.Currency) as Currency,
coalesce(b.DayPnl,0) - coalesce(p.DayPnl,0) as Diff_DayPnl, 
'BookMon -->' as BookMon, 
b.*, 
'PA -->' as PortfolioA, 
p.* 
from #pa_pnl p
full outer join #bookmon_pnl b on b.Busdate = p.BusDate and b.SecurityCode = p.SecurityCode and b.Fund = p.fund 
-- and b.Currency = p.Currency
order by coalesce(p.DayPnl,0) - coalesce(b.DayPnl,0)

select * from #pa_pnl

select * from #bookmon_pnl



RETURN 0
