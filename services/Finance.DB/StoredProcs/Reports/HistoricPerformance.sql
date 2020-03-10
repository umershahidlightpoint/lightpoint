CREATE PROCEDURE [dbo].[HistoricPerformance]
	@Now Date,
	@From Date
AS

select [when], sum(credit-debit) as balance from current_journal_full
where AccountCategory in ('Asset', 'Liability')
and [when] <= @Now
group by [when]

select sum(credit-debit) as balance from current_journal_full
where AccountCategory in ('Asset', 'Liability')
and [when] <= @Now

select * from current_journal_full
where [when] = @Now

RETURN 0
