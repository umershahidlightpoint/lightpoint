/*
Examples:

select * from fnPositions('2019-12-17')

select * from tax_lot_status
select * from market_prices
select * from tax_lot
*/

CREATE FUNCTION [dbo].[fnPositions]
(
	@bDate Date
)
RETURNS @returntable TABLE
(
	business_date DATE,
	symbol varchar(100),
	side varchar(100),
	security_id int,
	fund varchar(100),
	trade_currency varchar(5),
	currency varchar(5),
	quantity numeric(22,9),
	investment_at_cost numeric(22,9),
	exposure numeric(22,9),
	price numeric(22,9),
	fx numeric(22,9)
)
AS
BEGIN

WITH taxlotstatus (business_date, open_id, symbol, side, security_id, fund, trade_currency, currency, quantity, investment_at_cost, price)
AS
(
select @bDate as business_date, open_id, tax_lot_status.symbol, tax_lot_status.side, t.SecurityId, tax_lot_status.Fund, t.TradeCurrency, t.SettleCurrency,
SUM(original_quantity) as quantity, 
Sum(investment_at_cost * -1) as investment_at_cost,
Max(trade_price) as price
from tax_lot_status 
inner join TradeMaster..trade t on t.LpOrderId = tax_lot_status.open_id
where tax_lot_status.trade_date <= @bDate
group by open_id, tax_lot_status.symbol, tax_lot_status.side, t.SecurityId, tax_lot_status.Fund, t.TradeCurrency, t.SettleCurrency
)
,
taxlot (business_date, open_lot_id, quantity, investment_at_cost)
AS
(
select @bDate as business_date, open_lot_id, sum(quantity) as quantity, sum(Abs(investment_at_cost)) as investment_at_cost
from tax_lot 
where trade_date <= @bDate
group by open_lot_id
)


	INSERT @returntable
		select tls.business_date, tls.symbol, side, tls.security_id, fund, trade_currency, currency, 
		case 
			When Side = 'BUY' then SUM(coalesce(tls.quantity,0) + coalesce(tl.quantity,0))       
			else SUM(coalesce(tls.quantity,0) + coalesce(tl.quantity,0))
		end as quantity,
		case
			When SUM(coalesce(tls.quantity,0) + coalesce(tl.quantity,0)) = 0 then 0
			else SUM(coalesce(tls.investment_at_cost,0) + coalesce(tl.Investment_at_cost,0))
		end as investment_at_cost,
		case
			when trade_currency = 'GBX' or trade_currency = 'GBP' then SUM(coalesce(tls.quantity,0) + coalesce(tl.quantity,0)) * (Max(coalesce(mp.price, 0)) / 100.0) * Max(coalesce(fx.price, 1))
			else SUM(coalesce(tls.quantity,0) + coalesce(tl.quantity,0)) * Max(coalesce(mp.price, 0)) * Max(coalesce(fx.price, 1))
		end,
		case
			when trade_currency = 'GBX' or trade_currency = 'GBP' then Max(coalesce(mp.price, 0)) / 100.0
			else Max(coalesce(mp.price, 0))
		end,
		Max(coalesce(fx.price, 1))
		from taxlotstatus tls
		left outer join taxlot tl on tl.open_lot_id = tls.open_id
		left outer join market_prices mp on mp.security_id = tls.security_id and mp.business_date = @bDate
		left outer join market_prices fx on fx.symbol = '@CASH'+tls.currency and fx.business_date = @bDate
		group by tls.business_date, tls.symbol, side, tls.security_id, fund, trade_currency, currency
		order by tls.symbol
	RETURN
END

