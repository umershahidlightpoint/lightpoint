/*
Compare FundAdmin Numbers to PA Numbers

exec FundAdminReconcile '2019-12-31'
Exec PeriodPnl '2019-12-31'
*/
CREATE PROCEDURE [dbo].[FundAdminReconcile]
	@businessDate Date
AS
	declare @busdate as date
	set @busdate = @businessDate

/*
Grab Data from PA first
*/

Exec PeriodPnl @Busdate

select @busDate as busDate, Symbol as SecurityCode, SecurityId, Sum(Amount) as Quantity, Sum(Pl) as DayPnl, Sum(MTDPnl) as MTDPnl, Sum(YTDPnl) as YTDPnl 
into #fundadmin
from PositionMaster..CITCOPnl
where BusDate = @busdate and Symbol is not null and SecurityId != 0
group by Symbol, SecurityId

-- Reconcile
select 
coalesce(p.BusDate, b.BusDate) as BusDate, 
coalesce(p.SecurityCode, b.SecurityCode) as Symbol, 
-- coalesce(p.Fund, '') as Fund, 
coalesce(p.SecurityType, '') as SecurityType, 
coalesce(p.Currency, '') as Currency,
coalesce(b.Quantity,0) - coalesce(p.Quantity,0) as Diff_Quantity,
case
	when ABS(ROUND(coalesce(b.DayPnl,0) - coalesce(p.DayPnl,0),2)) <= 1.0 then 0.0
	else ROUND(coalesce(b.DayPnl,0) - coalesce(p.DayPnl,0),2) 
end as Diff_DayPnl, 
case
	when ABS(ROUND(coalesce(b.MTDPnl,0) - coalesce(p.MTDPnl,0),2)) <= 1.0 then 0.0
	else ROUND(coalesce(b.MTDPnl,0) - coalesce(p.MTDPnl,0),2) 
end as Diff_MTDPnl, 
case
	when ABS(ROUND(coalesce(b.YTDPnl,0) - coalesce(p.YTDPnl,0),2)) <= 1.0 then 0.0
	else ROUND(coalesce(b.YTDPnl,0) - coalesce(p.YTDPnl,0),2) 
end as Diff_YTDPnl, 
'FundAdmin -->' as FundAdmin, 
b.*, 
'PA -->' as PortfolioA, 
p.* 
from pnl_summary p
full outer join #fundadmin b on b.Busdate = p.BusDate and b.SecurityId = p.SecurityId
where p.BusDate = @businessDate
-- and b.Currency = p.Currency
order by p.SecurityCode

-- Our Data
select * from pnl_summary
order by SecurityCode

-- Fund Admin data
select * from #fundadmin
where SecurityCode not like '@CASH%'
order by SecurityCode
	
RETURN 0
