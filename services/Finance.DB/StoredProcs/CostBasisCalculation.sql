/* Examples

exec CostBasisCalculation '2019-12-17'
*/
CREATE PROCEDURE [dbo].[CostBasisCalculation]
	@businessDate Date
AS

DECLARE @bDate as Date
SET @bDate = @businessDate

DECLARE @symbol Varchar(10)
SET @symbol = 'CONN'

select SecurityCode, BbergCode, coalesce(sd.Multiplier, sf.ContractSize) as Multiplier 
into #security_details
from SecurityMaster..Security s
left join SecurityMaster..SecDerivatives sd on sd.SecurityId = s.SecurityId
left join SecurityMaster..SecFutures sf on sf.SecurityId = s.SecurityId
where coalesce(sd.Multiplier, sf.ContractSize) is not null

select @bDate as business_date, open_id, tls.symbol, tls.side, t.TradeCurrency, SUM(original_quantity) as quantity, SUM(original_quantity * trade_price) as investment_at_cost
into #tax_lot_status
from tax_lot_status tls
inner join current_trade_state t on t.lpOrderId = open_id
where trade_date <= @bDate
group by open_id, tls.symbol, tls.side, t.TradeCurrency

select * from #tax_lot_status where symbol = @symbol

select @bDate as business_date, open_lot_id, sum(abs(quantity)) as quantity, sum(abs(quantity * trade_price)) as investment_at_cost
into #tax_lot
from tax_lot 
where trade_date <= @bDate
group by open_lot_id

select tls.business_date, tls.symbol, side, 
Abs(coalesce(tls.quantity,0)) as totalQuantity, 
Abs(coalesce(tl.quantity,0)) as consumedQuantity, 
Abs(coalesce(tls.quantity,0)) - Abs(coalesce(tl.quantity,0)) as quantity,
case
	when TradeCurrency = 'GBX' or TradeCurrency = 'GBp' then (Abs(coalesce(tls.quantity,0)) - Abs(coalesce(tl.quantity,0))) * coalesce(mp.price,1) / 100.0 
	--else (Abs(coalesce(tls.quantity,0)) - Abs(coalesce(tl.quantity,0))) * coalesce(mp.price,1) 
	else (Abs(coalesce(tls.investment_at_cost,0)) - Abs(coalesce(tl.investment_at_cost,0)))
end as investment_at_cost,
case
	when TradeCurrency = 'GBX' or TradeCurrency = 'GBp' then coalesce(mp.price,1) / 100.0 
	else coalesce(mp.price,1) 
end as market_price
into #tax_lots_final
from #tax_lot_status tls
inner join market_prices mp on mp.business_date = @bDate and mp.symbol = tls.symbol
left outer join #tax_lot tl on tl.open_lot_id = tls.open_id
order by tls.symbol

select * from #tax_lots_final where symbol = @symbol

select 
@bDate as busdate,
tls.symbol, 
CASE
	WHEN tls.side = 'BUY' then ABS(SUM(tls.investment_at_cost))
	ELSE ABS(SUM(tls.investment_at_cost)) * -1
End as Balance,
SUM(tls.quantity) as Quantity, 
CASE
	WHEN tls.side = 'BUY' then 'LONG'
	ELSE 'SHORT'
End as Side,
MAX(market_price) as eod_price
into #costbasis_all
from #tax_lots_final tls
left outer join #security_details sd on sd.SecurityCode = tls.symbol
where tls.business_date <= @bDate
group by tls.symbol, side

select * from #costbasis_all where symbol = @symbol

/*
LONG
*/
-- Unrealized
SELECT @bDate as busdate, J.symbol, sum(debit - credit) as unrealized_pnl, 'LONG' as Side
into #unrealized_long
FROM vwJournal j
where 
AccountType = 'Mark to Market Longs' and
[event] in ('unrealizedpnl', 'realizedpnl') -- Need to ensure that we remove the realized from the unrealized
and j.[when] <= @bDate
group by j.symbol

-- realized
SELECT @bDate as busdate, j.symbol, sum(debit - credit) as realized_pnl, 'LONG' as Side
into #realized_long
FROM vwJournal j
where AccountType = 'LONG POSITIONS AT COST'
and event = 'realizedpnl'
and j.[when] <= @bDate
group by j.symbol

/*
SHORT
*/
-- Unrealized
SELECT @bDate as busdate, J.symbol, sum(credit-debit) as unrealized_pnl, 'SHORT' as Side
into #unrealized_short
FROM vwJournal j
where AccountType = 'Mark to Market Shorts'
and [event] in ('unrealizedpnl', 'realizedpnl')
and j.[when] <= @bDate
group by j.symbol

-- realized
SELECT @bDate as busdate, j.symbol, sum(credit - debit) as realized_pnl, 'SHORT' as Side
into #realized_short
FROM vwJournal j
where AccountType = 'SHORT POSITIONS AT COST'
and event = 'realizedpnl'
and j.[when] <= @bDate
group by j.symbol

begin tran
delete from cost_basis where business_date = @bDate and Side = 'LONG'
delete from cost_basis where business_date = @bDate and Side = 'SHORT'

print 'Updating cost_basis::LONGS'

insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side, realized_pnl, unrealized_pnl, eod_price )
select cb.busdate, cb.symbol, 
cb.Balance, 
cb.Quantity, 
case
	When ROUND(cb.Quantity,2) != 0 then ABS((cb.Balance + coalesce(rl.realized_pnl,0)) / cb.Quantity) / coalesce(sd.Multiplier,1)
	else 0
end,
cb.Side, 
coalesce(rl.realized_pnl,0), 
case
	When ROUND(cb.Quantity,2) != 0 then coalesce(ul.unrealized_pnl,0)
	else 0
end, cb.eod_price
from #costbasis_all cb 
left outer join #unrealized_long ul on ul.busdate = cb.busdate and ul.symbol = cb.symbol and ul.Side = cb.Side
left outer join #realized_long rl on rl.busdate = cb.busdate and rl.symbol = cb.symbol and rl.Side = cb.Side
left outer join #security_details sd on sd.SecurityCode = cb.symbol
where cb.Side = 'LONG'

print 'Updating cost_basis::SHORTS'

insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side, realized_pnl, unrealized_pnl, eod_price )
select cb.busdate, cb.symbol, 
cb.Balance, 
cb.Quantity, 
case
	When ROUND(cb.Quantity,2) != 0 then ABS((cb.Balance + coalesce(rl.realized_pnl,0)) / cb.Quantity) / coalesce(sd.Multiplier,1)
	else 0
end,
cb.Side, 
coalesce(rl.realized_pnl,0), 
case
	When ROUND(cb.Quantity,2) != 0 then coalesce(ul.unrealized_pnl,0)
	else 0
end, 
cb.eod_price
from #costbasis_all cb 
left outer join #unrealized_short ul on ul.busdate = cb.busdate and ul.symbol = cb.symbol and ul.Side = cb.Side
left outer join #realized_short rl on rl.busdate = cb.busdate and rl.symbol = cb.symbol and rl.Side = cb.Side
left outer join #security_details sd on sd.SecurityCode = cb.symbol
where cb.Side = 'SHORT'

commit tran

select * from cost_basis where business_date = @bDate and Side in ('LONG', 'SHORT')
and Symbol = @symbol

RETURN