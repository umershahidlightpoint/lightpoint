/*
Examples:

select * from tax_lot_status

select * from fnTaxLotReport('2019-12-31') where Symbol = 'BGA AU SWAP'
*/
CREATE FUNCTION [dbo].[fnTaxLotReport]
(
	@bDate Date
)
RETURNS @returntable TABLE
(
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
	eod_px numeric(22,9),
	realized numeric(22,9),
	unrealized numeric(22,9),
	net numeric(22,9),
	original_investment_at_cost numeric(22,9),
	residual_investment_at_cost numeric(22,9)
)
AS
BEGIN

WITH taxlot (business_date, open_lot_id, realized_pnl)
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
		coalesce(tl.realized_pnl,0) as realized, 
		case
			when tls.quantity != 0 then coalesce(up.balance, 0) 
			else 0.0
		end as unrealized,
		case
			when tls.quantity != 0 then coalesce(tl.realized_pnl,0) + coalesce(up.balance, 0)
			else coalesce(tl.realized_pnl,0)
		end as net,
		(tls.original_quantity * tls.trade_price) * -1,
		(tls.quantity * tls.trade_price) * -1
		from tax_lot_status tls
		-- inner join taxlotstatus taxls on taxls.open_id = tls.open_id		
		inner join current_trade_state cts on cts.LPOrderId = tls.open_id
		left outer join security_details sd on sd.security_id = cts.SecurityId
		left outer join taxlot tl on tl.open_lot_id = tls.open_id
		left outer join latest_prices lp on lp.security_code = tls.symbol
		left outer join unrealized_pnl up on up.source = tls.open_id
		where tls.trade_date <= @bDate
	RETURN
END

