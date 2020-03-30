/*
truncate table pnl_summary
select busdate, count(*) from pnl_summary with(nolock)
group by busDate
order by busDate desc

select * from pnl_summary where BusDate = '2019-12-31'
exec [HistoricPerformance] '2019-12-31', '2019-12-31'

select count(*) from current_journal_full
*/
CREATE PROCEDURE [dbo].[HistoricPerformance]
	@Now Date,
	@From Date
AS

-- Make sure its updated
Exec PeriodPnl @Now

RAISERROR('Completed', 0,1) with nowait

select [when], sum(coalesce(credit,0) - coalesce(debit,0)) as balance 
into #contributed
from current_journal_full 
where AccountType in ('CONTRIBUTED CAPITAL')
group by [when]

select [when], sum(coalesce(credit,0) - coalesce(debit,0)) as balance
into #withdraw
from current_journal_full 
where AccountType in ('WITHDRAWN CAPITAL')
group by [when]

select BusDate, 
	sum(DayPnl) as DayPnl, 
	Sum(Nav) as SodNav, 
--	sum(DayPnl) / Sum(Nav) as DayPnlPer, 
--	Sum(WtdPnl) / Sum(Nav) as WtdPnlPer, 
--	Sum(MtdPnl) / Sum(Nav) as MtdPnlPer, 
--	Sum(QtdPnl) / Sum(Nav) as QtdPnlPer, 
--	Sum(YtdPnl) / Sum(Nav) as YtdPnlPer, 
--	Sum(ItdPnl) / Sum(Nav) as ItdPnlPer,
	Sum(WtdPnl) WtdPnl, 
	Sum(MtdPnl) MtdPnl, 
	Sum(QtdPnl) QtdPnl, 
	Sum(YtdPnl) YtdPnl, 
	Sum(ItdPnl) ItdPnl
into #pnl_summary
from pnl_summary
where BusDate between @From and @Now
group by BusDate
order by BusDate desc

/*
WTD Calcs, need to ensure that the pnl_summary table is populated
0 as WtdPnlPer, 
0 as WtdPnlr, 
*/

select BusDate as AsOf, 
	DayPnl, 
	SodNav, 
	SodNav + coalesce(w.balance,0) + coalesce(c.balance,0) as EodNav, 
	coalesce(w.balance,0) as Withdrawls, 
	coalesce(c.balance,0) as Contributions, 
	DayPnl / (SodNav + coalesce(w.balance,0) + coalesce(c.balance,0))  as DayPnlPer, 
	0 as WtdPnlPer, 
	0 as MtdPnlPer, 
	0 as QtdPnlPer, 
	0 as YtdPnlPer, 
	0 as ItdPnlPer,
	WtdPnl, 
	MtdPnl, 
	QtdPnl, 
	YtdPnl, 
	ItdPnl
from #pnl_summary with(nolock) 
left outer join #contributed c on c.[when] = BusDate
left outer join #withdraw w on w.[when] = BusDate
where BusDate between @From and @Now
order by BusDate desc

RETURN 0