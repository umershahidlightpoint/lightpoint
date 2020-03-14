/*
exec [HistoricPerformance] '2019-12-31', '2019-01-01'
*/
CREATE PROCEDURE [dbo].[HistoricPerformance]
	@Now Date,
	@From Date
AS

declare @CurrentNAV numeric(32,16)
declare @Contributions numeric(32,16)
declare @Withdrawls numeric(32,16)
declare @SODNAV numeric(32,16)

-- Make sure its updated
Exec PeriodPnl @Now

select @CurrentNAV = sum(debit-credit) from current_journal_full
where AccountCategory in ('Asset', 'Liability')
and [when] >= @From and [when] <= @Now

select @Contributions = sum(coalesce(credit,0) - coalesce(debit,0)) from current_journal_full 
where AccountType in ('CONTRIBUTED CAPITAL')
and [when] = @now

select @Withdrawls = sum(coalesce(credit,0) - coalesce(debit,0)) from current_journal_full 
where AccountType in ('WITHDRAWN CAPITAL')
and [when] = @now

set @SODNAV = @CurrentNAV + coalesce(@Contributions,0) + coalesce(@Withdrawls,0)

/*
WTD Calcs, need to ensure that the pnl_summary table is populated
0 as WtdPnlPer, 
0 as WtdPnlr, 
*/

select @Now as AsOf, sum(DayPnl) as DayPnl, @CurrentNAV as EodNav, coalesce(@Withdrawls,0) as Withdrawls, coalesce(@Contributions,0) as Contributions, 
sum(DayPnl) / @SODNAV as DayPnlPer, Sum(MtdPnl) / @SODNAV as MtdPnlPer, Sum(QtdPnl) / @SODNAV as QtdPnlPer, Sum(YtdPnl) / @SODNAV as YtdPnlPer, Sum(ItdPnl) / @SODNAV as ItdPnlPer,
Sum(MtdPnl) MtdPnl, Sum(QtdPnl) as QtdPnl, Sum(YtdPnl) YtdPnl, Sum(ItdPnl) as ItdPnl
from pnl_summary where BusDate = @Now

RETURN 0