/*
exec [PnlToDate] '2019-12-31', '2019-04-01'
*/
CREATE PROCEDURE [dbo].[PnlToDate]
	@Now Date,
	@From Date
AS

select security_id, AccountType, SecurityType, Symbol, Fund, SUM(credit-debit) as GG 
into #tempdata
from current_journal_full
where [when] >= @From and [when] <= @Now
group by AccountType, security_id, SecurityType, Symbol, Fund

-- Get the Base data we need
select business_date as BusDate, SecurityCode as SecurityCode, SecurityId, Fund, st.SecurityTypeCode as SecurityType, pos.currency, 
Sum(pos.quantity) as quantity,
0 as realizedPnl, 0 as unrealizedPnl, 0 as Pnl, 0 as Nav
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
select security_id, Symbol, Fund, SUM(GG) as GG from #tempdata
where AccountType in ('REALIZED GAIN/(LOSS)', 'REALIZED GAIN/(LOSS) DUE TO FX')
group by security_id, Symbol, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl = coalesce(GG,0)
from #results t
inner join (
select security_id, Symbol, Fund, SUM(GG) as GG from #tempdata
where (AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)', 'Change in unrealized due to fx on original Cost', 'change in unrealized do to fx translation'))
and SecurityType not in ( 'Equity Swap', 'FORWARD', 'CROSS' )
group by security_id, Symbol, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl = GG
from #results t
inner join (
select security_id, Symbol, Fund, SUM(GG) as GG from #tempdata
where (AccountType in ('Change in Unrealized Derivatives Contracts at Fair Value', 'Change in Unrealized Derivatives Contracts due to FX Translation'))
and SecurityType in ( 'Equity Swap', 'FORWARD', 'CROSS' )
group by security_id, Symbol, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set Nav = v.nav
from #results t
inner join (
select security_id, Symbol, Fund, sum(debit-credit) as nav 
from current_journal_full
where AccountCategory in ('Asset', 'Liability')
and [when] >= @From and [when] <= @Now
group by security_id, Symbol, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId


update #results
set Pnl = Round(unrealizedPnl + realizedPnl,2)
from #results

select * from #results
order by SecurityCode asc

RETURN 0