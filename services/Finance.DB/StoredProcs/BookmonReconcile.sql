CREATE PROCEDURE [dbo].[BookmonReconcile]
	@businessDate Date
AS
declare @busdate as date
set @busdate = @businessDate

select p.BusDate, s.BbergCode as SecurityCode, Fund, st.SecurityTypeCode as SecurityType, p.Currency,  SUM(p.Quantity) as Quantity, SUM(p.Exposure) as Exposure
into #bookmon_pnl
from PositionMaster..intradayPositionSplit p
inner join SecurityMaster..Security s on s.EzeTicker = p.SecurityCode
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId
inner join ( select BusDate, Max(LastModifiedOn) as lmo  from PositionMaster..intradayPositionSplit group by BusDate) as lmo on lmo.BusDate = p.BusDate and lmo.lmo = p.LastModifiedOn
where p.BusDate = @busDate and p.SecurityCode not like '@CASH%' and p.SecurityCode not like 'ZZ_%'
group by p.BusDate, s.BbergCode, Fund, p.Currency, st.SecurityTypeCode
order by p.BusDate, BbergCode, Fund, p.Currency


select p.business_date as BusDate, s.BbergCode as SecurityCode, p.Fund, p.currency as Currency, Sum(p.Quantity) as Quantity, 
Sum(p.investment_at_cost) as Exposure 
into #pa_pnl
from fnPositions(@busdate) p 
inner join SecurityMaster..Security s on s.SecurityId = p.security_id
group by p.business_date, s.BbergCode, p.Fund, p.currency
order by p.business_date, s.BbergCode, p.Fund, p.currency


-- Recon
select 
coalesce(p.BusDate, b.BusDate) as BusDate, 
coalesce(p.SecurityCode, b.SecurityCode) as Symbol, 
b.SecurityType,
coalesce(p.Fund, b.Fund) as Fund, 
coalesce(p.Currency, b.Currency) as Currency,
coalesce(b.Quantity,0) - coalesce(p.Quantity,0) as Diff_Quantity,
coalesce(b.Exposure,0) - coalesce(p.Exposure,0) as Diff_Exposure,
'BookMon -->' as BookMon, 
b.*, 
'PA -->' as PortfolioA, 
p.* 
from #pa_pnl p
full outer join #bookmon_pnl b on b.Busdate = p.BusDate and b.SecurityCode = p.SecurityCode and b.Fund = p.fund 
-- and b.Currency = p.Currency
order by Symbol, p.fund

select * from #pa_pnl

select * from #bookmon_pnl

RETURN 0