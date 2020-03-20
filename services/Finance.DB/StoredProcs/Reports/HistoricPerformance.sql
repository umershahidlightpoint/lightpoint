﻿/*
select * from pnl_summary
exec [HistoricPerformance] '2019-12-31', '2019-04-01'
*/
CREATE PROCEDURE [dbo].[HistoricPerformance]
	@Now Date,
	@From Date
AS

-- Make sure its updated
Exec PeriodPnl @Now

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

/*
WTD Calcs, need to ensure that the pnl_summary table is populated
0 as WtdPnlPer, 
0 as WtdPnlr, 
*/

select BusDate as AsOf, 
	sum(DayPnl) as DayPnl, 
	Sum(Nav) as EodNav, 
	sum(coalesce(w.balance,0)) as Withdrawls, 
	sum(coalesce(c.balance,0)) as Contributions, 
	sum(DayPnl) / Sum(Nav) as DayPnlPer, 
	Sum(WtdPnl) / Sum(Nav) as WtdPnlPer, 
	Sum(MtdPnl) / Sum(Nav) as MtdPnlPer, 
	Sum(QtdPnl) / Sum(Nav) as QtdPnlPer, 
	Sum(YtdPnl) / Sum(Nav) as YtdPnlPer, 
	Sum(ItdPnl) / Sum(Nav) as ItdPnlPer,
	Sum(WtdPnl) WtdPnl, 
	Sum(MtdPnl) MtdPnl, 
	Sum(QtdPnl) QtdPnl, 
	Sum(YtdPnl) YtdPnl, 
	Sum(ItdPnl) ItdPnl
from pnl_summary with(nolock) 
left outer join #contributed c on c.[when] = BusDate
left outer join #withdraw w on w.[when] = BusDate
where BusDate <= @Now
group by BusDate
order by BusDate desc

RETURN 0