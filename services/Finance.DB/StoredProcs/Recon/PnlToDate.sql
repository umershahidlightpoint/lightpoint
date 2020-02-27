CREATE PROCEDURE [dbo].[PnlToDate]
	@Now Date,
	@From Date
AS

-- Get the Base data we need
select business_date as BusDate, SecurityCode as SecurityCode, SecurityId, Fund, st.SecurityTypeCode as SecurityType, pos.currency, 
Sum(pos.quantity) as quantity,
0 as realizedPnl, 0 as unrealizedPnl, 0 as Pnl
into #results
from fnPositions(@Now) pos
inner join SecurityMaster..Security s on s.SecurityId = pos.security_id
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId
group by business_date, SecurityCode, SecurityId, Fund, st.SecurityTypeCode, pos.currency

-- 'fx gain or loss on unsettled balance'
update #results
set realizedPnl = coalesce(GG,0)
from #results t
inner join (
select security_id, Symbol, Fund, SUM(credit-debit) as GG from current_journal_full
where AccountType in ('REALIZED GAIN/(LOSS)', 'REALIZED GAIN/(LOSS) DUE TO FX')
and [when] >= @From and [when] <= @Now
group by security_id, Symbol, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl = coalesce(GG,0)
from #results t
inner join (
select security_id, Symbol, Fund, SUM(credit-debit) as GG from current_journal_full v
where (AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)', 'Change in unrealized due to fx on original Cost', 'change in unrealized do to fx translation'))
and v.SecurityType not in ( 'Equity Swap', 'FORWARD', 'CROSS' )
and v.[when] >= @From and v.[when] <= @Now
group by security_id, Symbol, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl = GG
from #results t
inner join (
select security_id, Symbol, Fund, SUM(credit-debit) as GG from current_journal_full v
where (AccountType in ('Change in Unrealized Derivatives Contracts at Fair Value', 'Change in Unrealized Derivatives Contracts due to FX Translation'))
and v.SecurityType in ( 'Equity Swap', 'FORWARD', 'CROSS' )
and v.[when] >= @From and v.[when] <= @Now
group by security_id, Symbol, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set Pnl = Round(unrealizedPnl + realizedPnl,2)
from #results

select * from #results
order by SecurityCode asc

RETURN 0