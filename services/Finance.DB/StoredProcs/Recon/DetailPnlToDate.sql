/*
exec DetailPnlToDate '2019-12-31', '2019-01-01', 'NXT LN SWAP'
*/

CREATE PROCEDURE [dbo].[DetailPnlToDate]
	@Now Date,
	@From Date,
	@symbol varchar(100) = null
AS

-- Get the Base data we need
select business_date as BusDate, i.SecurityIssuerDesc as SecurityName, s.ISIN, SecurityCode as SecurityCode, pos.side, SecurityId, Fund, st.SecurityTypeCode as SecurityType, pos.currency,
Sum(pos.quantity) as position,

-- Realized
0 as realizedPnl, 
0 as realizedPnl_FX, 
0 as realizedPnl_Net, 

0 as Cost, 

-- UnRealized
0 as unrealizedPnl, 
0 as unrealizedPnl_FX, 
0 as unrealizedPnl_FX_Translation, 
0 as unrealizedPnl_Net, 

0 as market_Value,

0 as Pnl

into #results
from fnPositions(@Now) pos
inner join SecurityMaster..Security s on s.SecurityId = pos.security_id
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId
inner join SecurityMaster..SecurityIssuer i on i.SecurityIssuerId = s.SecurityIssuerId
group by business_date, i.SecurityIssuerDesc, SecurityCode, SecurityId, Fund, st.SecurityTypeCode, pos.currency, pos.side, ISIN

update #results
set realizedPnl = coalesce(GG,0)
from #results t
inner join (
select security_id, Fund, SUM(credit-debit) as GG from current_journal
where AccountType in ('REALIZED GAIN/(LOSS)') and [event] in ('realizedpnl')
and [when] >= @From and [when] <= @Now
group by security_id, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set realizedPnl_FX = coalesce(GG,0)
from #results t
inner join (
select security_id, Fund, SUM(credit-debit) as GG from current_journal
where AccountType in ('REALIZED GAIN/(LOSS) DUE TO FX') and [event] in ('realized-cash-fx')
and [when] >= @From and [when] <= @Now
group by security_id, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl = coalesce(GG,0)
from #results t
inner join (
select v.security_id, Fund, SUM(credit-debit) as GG from vwFullJournal v
where (AccountType = 'CHANGE IN UNREALIZED GAIN/(LOSS)' and [event] = 'unrealizedpnl')
and v.SecurityType not in ( 'Equity Swap', 'FORWARD', 'CROSS' )
and v.[when] >= @From and v.[when] <= @Now
group by v.security_id, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl_FX = coalesce(GG,0)
from #results t
inner join (
select v.security_id, Fund, SUM(credit-debit) as GG from vwFullJournal v
where (AccountType = 'change in unrealized due to fx on original Cost' and [event] = 'daily-unrealizedpnl-fx')
and v.SecurityType not in ( 'Equity Swap', 'FORWARD', 'CROSS' )
and v.[when] >= @From and v.[when] <= @Now
group by v.security_id, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl_FX_Translation = coalesce(GG,0)
from #results t
inner join (
select v.security_id, Fund, SUM(credit-debit) as GG from vwFullJournal v
where (AccountType = 'change in unrealized do to fx translation' and [event] = 'unrealized-cash-fx')
and v.SecurityType not in ( 'Equity Swap', 'FORWARD', 'CROSS' )
and v.[when] >= @From and v.[when] <= @Now
group by v.security_id, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl = coalesce(GG,0)
from #results t
inner join (
select v.security_id, Fund, SUM(credit-debit) as GG from vwFullJournal v
where (AccountType = 'Change in Unrealized Derivatives Contracts at Fair Value')
and v.SecurityType in ( 'Equity Swap', 'FORWARD', 'CROSS' )
and v.[when] >= @From and v.[when] <= @Now
group by v.security_id, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl_FX = coalesce(GG,0)
from #results t
inner join (
select v.security_id, Fund, SUM(credit-debit) as GG from vwFullJournal v
where (AccountCategory = 'Revenues' and [event] = 'daily-unrealizedpnl-fx')
and v.SecurityType in ( 'Equity Swap', 'FORWARD', 'CROSS' )
and v.[when] >= @From and v.[when] <= @Now
group by v.security_id, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

update #results
set unrealizedPnl_FX_Translation = coalesce(GG,0)
from #results t
inner join (
select v.security_id, Fund, SUM(credit-debit) as GG from vwFullJournal v
where (AccountCategory = 'Revenues' and [event] = 'unrealized-cash-fx')
and v.SecurityType in ( 'Equity Swap', 'FORWARD', 'CROSS' )
and v.[when] >= @From and v.[when] <= @Now
group by v.security_id, Fund
) as v on v.fund = t.fund and v.security_id = t.SecurityId

-- Calculate the derived fields
update #results
set realizedPnl_Net = Round(realizedPnl + realizedPnl_FX,2)
from #results

update #results
set unrealizedPnl_Net = Round(unrealizedPnl + unrealizedPnl_FX + unrealizedPnl_FX_Translation,2)
from #results

update #results
set Pnl = Round(realizedPnl_Net + unrealizedPnl_Net,2)
from #results

select * from #results
where SecurityCode = coalesce(@symbol, SecurityCode)
order by SecurityType, SecurityName asc

RETURN 0
