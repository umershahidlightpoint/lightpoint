/*
Examples 

exec [DayPnlReconcile] '2019-12-18'
*/
CREATE PROCEDURE [dbo].[DayPnlReconcile]
	@businessDate Date
AS
declare @busdate as date
set @busdate = @businessDate

select p.BusDate, s.SecurityCode as SecurityCode, Fund, st.SecurityTypeCode as SecurityType, p.Currency,  Sum(DayPnL) as DayPnl 
into #bookmon_pnl
from PositionMaster..intradayPositionSplit p
inner join SecurityMaster..Security s on s.EzeTicker = p.SecurityCode
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId
inner join ( select BusDate, Max(LastModifiedOn) as lmo  from PositionMaster..intradayPositionSplit group by BusDate) as lmo on lmo.BusDate = p.BusDate and lmo.lmo = p.LastModifiedOn
where p.BusDate = @busDate and p.SecurityCode not like '@CASH%' and p.SecurityCode not like 'ZZ_%'
group by p.BusDate, s.SecurityCode, Fund, p.Currency, st.SecurityTypeCode
order by p.BusDate, SecurityCode, Fund, p.Currency


select business_date as BusDate, s.SecurityCode as SecurityCode, Fund, st.SecurityTypeCode as SecurityType, pos.currency, 0 as realizedPnl, 0 as unrealizedPnl, 0 as DayPnl
into #temp
from fnPositions(@busDate) pos
inner join SecurityMaster..Security s on s.SecurityId = pos.security_id
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId

update #temp
set realizedPnl = GG
from #temp t
inner join (
select [When], s.SecurityCode as Symbol, Fund, SUM(credit-debit) as GG 
from vwJournal v
inner join SecurityMaster..Security s on s.SecurityId = v.security_id
where AccountType in ('REALIZED GAIN/(LOSS)') and [event] in ('realizedpnl')
group by [When], s.SecurityCode, Fund
) as v on v.[when] = t.BusDate and v.fund = t.fund and v.symbol = t.SecurityCode

update #temp
set unrealizedPnl = GG
from #temp t
inner join (
select [When], s.SecurityCode as Symbol, Fund, SUM(credit-debit) as GG from vwJournal v
inner join SecurityMaster..Security s on s.SecurityId = v.security_id
where (AccountType = 'CHANGE IN UNREALIZED GAIN/(LOSS)' and [event] = 'unrealizedpnl')
or (AccountType = 'change in unrealized due to fx on original Cost' and [event] = 'daily-unrealizedpnl-fx')
or (AccountType = 'change in unrealized do to fx translation' and [event] = 'unrealized-cash-fx')
-- and Symbol = 'MAREL NA'
group by [When], s.SecurityCode, Fund
) as v on v.[when] = t.BusDate and v.fund = t.fund and v.symbol = t.SecurityCode

update #temp
set DayPnl = Round(unrealizedPnl + realizedPnl,2)
from #temp

-- Recon
select 
coalesce(p.BusDate, b.BusDate) as BusDate, 
coalesce(p.SecurityCode, b.SecurityCode) as Symbol, 
coalesce(p.Fund, b.Fund) as Fund, 
coalesce(p.SecurityType, b.SecurityType) as SecurityType, 
coalesce(p.Currency, b.Currency) as Currency,
ROUND(coalesce(b.DayPnl,0) - coalesce(p.DayPnl,0),2) as Diff_DayPnl, 
'BookMon -->' as BookMon, 
b.*, 
'PA -->' as PortfolioA, 
p.* 
from #temp p
full outer join #bookmon_pnl b on b.Busdate = p.BusDate and b.SecurityCode = p.SecurityCode and b.Fund = p.fund 
-- and b.Currency = p.Currency
order by Symbol, p.fund

select * from #temp
order by SecurityCode, fund

select * from #bookmon_pnl
order by SecurityCode, fund

RETURN 0