/*
Examples:

select * from tax_lot_status

select * from fnTaxLotReport('2019-12-31')
*/
CREATE FUNCTION [dbo].[fnTaxLotReport]
(
	@bDate Date
)
RETURNS @returntable TABLE
(
-- tax_lot_status
	id int,
	open_id varchar(127),
	symbol varchar(100),
	side varchar(100),
	status varchar(100),
	original_quantity numeric(22,9),
	quantity numeric(22,9),
	business_date DATE,
	generated_on DATE,
	trade_date DATE,
	investment_at_cost numeric(22,9),
	fx_rate numeric(22,9),
	fund varchar(100),
	trade_price numeric(22,9),

-- Additional Attributes
	current_price numeric(22,9),
	realized numeric(22,9),
	unrealized numeric(22,9),
	net numeric(22,9)
)
AS
BEGIN

WITH taxlotstatus (business_date, open_id, symbol, side, security_id, fund, trade_currency, currency, quantity, investment_at_cost, price, comissions, fees, security_type)
AS
(
select @bDate as business_date, open_id, tax_lot_status.symbol, tax_lot_status.side, t.SecurityId, tax_lot_status.Fund, t.TradeCurrency, t.SettleCurrency,
SUM(original_quantity) as quantity, 
Sum(investment_at_cost * -1) as investment_at_cost,
Max(trade_price) as price,
SUM(t.Commission) as commission,
SUM(t.fees) as fees,
t.SecurityType
from tax_lot_status 
inner join TradeMaster..trade t on t.LpOrderId = tax_lot_status.open_id
where tax_lot_status.trade_date <= @bDate
group by open_id, tax_lot_status.symbol, tax_lot_status.side, t.SecurityId, tax_lot_status.Fund, t.TradeCurrency, t.SettleCurrency, t.SecurityType
)
,
taxlot (business_date, open_lot_id, realized_pnl)
AS
(
select @bDate as business_date, open_lot_id, sum(realized_pnl) as realized_pnl
from tax_lot 
where trade_date <= @bDate
group by open_lot_id
),
security_details (security_id, security_code, bloomberg_code, Multiplier)
AS
(
select s.SecurityId, SecurityCode, BbergCode, coalesce(sd.Multiplier, sf.ContractSize) as Multiplier 
from SecurityMaster..Security s
left join SecurityMaster..SecDerivatives sd on sd.SecurityId = s.SecurityId
left join SecurityMaster..SecFutures sf on sf.SecurityId = s.SecurityId
where coalesce(sd.Multiplier, sf.ContractSize) is not null
),
latest_prices (security_code, price)
AS
(
select SecurityCode, Price from PositionMAster..intradayPositionSplit s
inner join ( select @bdate as bdate, max(LastModifiedOn) lmo from PositionMAster..intradayPositionSplit where busDate = @bDate) f on f.lmo = s.LastModifiedOn and f.bDate = s.BusDate
),
unrealized_pnl (source, balance)
AS
(
		select source, round(sum(debit-credit),2) as balance from current_journal_full
		where (AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)', 'Change in unrealized due to fx on original Cost', 'change in unrealized do to fx translation'))
		or (AccountType in ('Change in Unrealized Derivatives Contracts at Fair Value', 'Change in Unrealized Derivatives Contracts due to FX Translation'))
		group by source
)



	INSERT @returntable
		select tls.*, 
		-- PRICE
		case
			when cts.TradeCurrency = 'GBX' or cts.TradeCurrency = 'GBP' then coalesce(lp.price, 0) / 100.0
			else coalesce(lp.price, 0) * coalesce(sd.Multiplier,1)
		end,
		-- PRICE
		coalesce(tl.realized_pnl,0) as realized, coalesce(up.balance, 0) as unrealized, coalesce(tl.realized_pnl,0) + coalesce(up.balance, 0) as net
		from tax_lot_status tls
		-- inner join taxlotstatus taxls on taxls.open_id = tls.open_id		
		inner join current_trade_state cts on cts.LPOrderId = tls.open_id
		left outer join security_details sd on sd.security_id = cts.SecurityId
		left outer join taxlot tl on tl.open_lot_id = tls.open_id
		left outer join latest_prices lp on lp.security_code = tls.symbol
		left outer join unrealized_pnl up on up.source = tls.open_id
	RETURN
END

