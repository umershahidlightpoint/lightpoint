/*
Compare FundAdmin Numbers to PA Numbers

truncate table pnl_summary
exec FundAdminReconcile '2019-12-31'
Exec PeriodPnl '2019-12-31'
*/
CREATE PROCEDURE [dbo].[FundAdminReconcile]
	@businessDate Date
AS

/*
Grab Data from PA first, if not populated generate the data first
*/

Exec PeriodPnl @businessDate

RAISError('Security', 0, 1) with nowait

select @businessDate as busDate, s.SecurityCode, pnl.SecurityId, Sum(Amount) as Quantity, Sum(PLBaseRealizedPnl + PLBaseUnRealizedPnl) as DayPnl, Sum(MTDBaseRealizedPnl + MTDBaseUnRealizedPnl) as MTDPnl, Sum(YTDBaseRealizedPnl + YTDBaseUnRealizedPnl) as YTDPnl 
into #fundadmin
from PositionMaster..CITCOPnl pnl
inner join SecurityMaster..Security s on s.SecurityId = pnl.SecurityId
where BusDate = @businessDate and Symbol is not null and pnl.SecurityId != 0
group by s.SecurityCode, pnl.SecurityId

RAISError('Get from pnl_summary', 0, 1) with nowait
-- select * from pnl_summary
select @businessDate as BusDate, Currency, SecurityCode, SecurityType, Sum(Quantity) as Quantity, SUm(DayPnl) as DayPnl, SUm(MtdPnl) as MtdPnl, SUm(QtdPnl) as QtdPnl, SUm(YtdPnl) as YtdPnl, SUm(ItdPnl) as ItdPnl
into #pnl_summary
from pnl_summary
where BusDate =  @businessDate
group by Currency, SecurityCode, SecurityType

RAISError('Reconcile', 0, 1) with nowait
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
from #pnl_summary p
full outer join #fundadmin b on b.Busdate = p.BusDate and b.SecurityCode = p.SecurityCode
where p.BusDate = @businessDate
-- and b.Currency = p.Currency
order by p.SecurityCode

-- Our Data
select * from #pnl_summary
order by SecurityCode

-- Fund Admin data
select * from #fundadmin
where SecurityCode not like '@CASH%'
order by SecurityCode
	
RETURN 0
