﻿/*
select * from fnPositions('2019-12-31')
exec PnlToDate '2019-12-31', '2019-01-01'
exec PnlToDate '2019-12-31', '2019-12-01'
*/

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

update #results
set realizedPnl = coalesce(GG,0)
from #results t
inner join (
select Symbol, Fund, SUM(credit-debit) as GG from vwFullJournal
where AccountType in ('REALIZED GAIN/(LOSS)') and [event] in ('realizedpnl')
and [when] >= @From and [when] <= @Now
group by Symbol, Fund
) as v on v.fund = t.fund and v.symbol = t.SecurityCode

update #results
set unrealizedPnl = coalesce(GG,0)
from #results t
inner join (
select Symbol, Fund, SUM(credit-debit) as GG from vwFullJournal v
where (AccountType = 'CHANGE IN UNREALIZED GAIN/(LOSS)' and [event] = 'unrealizedpnl')
and v.SecurityType not in ( 'Equity Swap', 'FORWARD' )
and v.[when] >= @From and v.[when] <= @Now
group by Symbol, Fund
) as v on v.fund = t.fund and v.symbol = t.SecurityCode

update #results
set unrealizedPnl = GG
from #results t
inner join (
select Symbol, Fund, SUM(credit-debit) as GG from vwFullJournal v
where (AccountType = 'Change in Unrealized Derivatives Contracts at Fair Value')
and v.SecurityType in ( 'Equity Swap', 'FORWARD' )
and v.[when] >= @From and v.[when] <= @Now
group by Symbol, Fund
) as v on v.fund = t.fund and v.symbol = t.SecurityCode

update #results
set Pnl = Round(unrealizedPnl + realizedPnl,2)
from #results

select * from #results
order by SecurityCode asc

RETURN 0
