﻿/*
select CONVERT(VARCHAR(50), CONCAT('@CASH', cts.SettleCurrency)), * from current_trade_state cts
select * from fnTaxLotReport('2019-12-31')

select * from market_prices where symbol =  CONVERT(VARCHAR(50), CONCAT('@CASH', 'EUR')) and business_date = '2019-12-31' and event = 'eod'

exec [MarketValueAppraisalReport] '2019-12-31'
*/
CREATE PROCEDURE [dbo].[MarketValueAppraisalReport]
	@date datetime
AS
select 
    s.EzeTicker, 
    coalesce(s.Sedol, '') as Sedol, 
    coalesce(s.Cusip, '') as Cusip, 
    coalesce(s.ISIN, '') as ISIN, 
    st.SecurityTypeCode as SecurityType, 
    tl.id, 
    tl.quantity,
    case 
        when tl.side = 'BUY' then 'LONG'
        when tl.side = 'SHORT' then 'SHORT'
        end as position,
    c.cost_basis,
    tl.business_date,
	s.SecurityDesc,
	mp.price as end_price,
	cts.SettleCurrency as local_currency,
	'' as cost_local,
	CONVERT(VARCHAR(50), CONCAT('@CASH', cts.SettleCurrency)) as cashSymbol,
	coalesce(fxrate.price,1) as fx_rate_to_reporting_currency,
	tl.unrealized as unrealized_pnl_local,
	tl.unrealized as unrealized_pnl,
	tl.quantity * mp.price as end_market_value_local
from fnTaxLotReport(@date) tl
inner join [SecurityMaster]..security s on tl.symbol = s.ezeticker
inner join current_trade_state cts on cts.LPOrderId = tl.open_id
left outer join market_prices mp on mp.security_id = s.SecurityId and mp.business_date = @date and mp.event = 'eod'
left outer join market_prices fxrate on fxrate.symbol = CONVERT(VARCHAR(8), CONCAT('@CASH', cts.SettleCurrency)) and fxrate.business_date = @date and fxrate.event = 'eod'
inner join [SecurityMaster]..SecurityType st on st.SecurityTypeId = s.SecurityTypeId
left join cost_basis c on c.symbol = tl.symbol and c.business_date = tl.business_date
where 
    tl.side in ('BUY', 'SHORT') 
    and tl.status in ('open', 'partially closed')
RETURN 0