CREATE PROCEDURE [dbo].[CostBasisCalculation]
	@businessDate Date
AS

DECLARE @bDate as Date
SET @bDate = @businessDate

-- Determine the begining of the fiscal year
Declare @start as Date
set @start = DATEADD(YEAR, DATEDIFF(YEAR, 0, @bdate), 0)

print @bDate
print @start

select SecurityCode, BbergCode, coalesce(sd.Multiplier, sf.ContractSize) as Multiplier 
into #security_details
from SecurityMaster..Security s
left join SecurityMaster..SecDerivatives sd on sd.SecurityId = s.SecurityId
left join SecurityMaster..SecFutures sf on sf.SecurityId = s.SecurityId
where coalesce(sd.Multiplier, sf.ContractSize) is not null


select 
	@bDate as busdate,
	tax_lot_status.symbol, 
	open_id, 
	sum(investment_at_cost) as original_iac, 
	sum(original_quantity) as original_quantity, 
	Max(coalesce(mp.price, 0)) as eod_price,
	CASE
		WHEN tax_lot_status.side = 'BUY' then 'LONG'
		ELSE 'SHORT'
	End as Side
into #original
from tax_lot_status
left outer join market_prices mp on mp.symbol = tax_lot_status.symbol and mp.business_date = @bDate
where trade_date <= @bDate
group by tax_lot_status.symbol, open_id, side
order by tax_lot_status.symbol asc

select 
	@bDate as busdate,
	tax_lot_status.symbol, 
	tax_lot.open_lot_id, 
	sum(tax_lot.investment_at_cost) as activity_iac,
	sum(tax_lot.quantity) as activity_quantity
into #activity
from tax_lot_status
inner join tax_lot on tax_lot.Open_lot_id = tax_lot_status.open_id
where tax_lot.trade_date <= @bdate
group by tax_lot_status.symbol, tax_lot.open_lot_id
order by symbol


/*
select 
@bDate as busdate,
tls.symbol, 
SUM(tls.investment_at_cost) as Balance, -- + Coalesce(tl.investment_at_cost, 0)) * -1 as Balance, 
SUM(tls.quantity) as Quantity, 
-- ABS(SUM(tls.investment_at_cost + Coalesce(tl.investment_at_cost, 0)) / SUM(tls.original_quantity +Coalesce(tl.quantity, 0))) / Max(Coalesce(sd.Multiplier, 1)) as CostBasis, 
CASE
	WHEN tls.side = 'BUY' then 'LONG'
	ELSE 'SHORT'
End as Side,
Max(coalesce(mp.price,0)) as eod_price
into #costbasis_all
from tax_lot_status tls
left outer join market_prices mp on mp.symbol = tls.symbol and mp.business_date = @bDate
where tls.business_date <= @bDate
group by tls.symbol, Side
*/

select 
	@bDate as busdate,
	o.symbol, 
	sum(original_iac) - sum(coalesce(activity_iac,0)) as Balance,
	sum(o.original_quantity) + sum(coalesce(a.activity_quantity, 0)) as Quantity, 
	o.side, 
	MAX(o.eod_price) as eod_price
into #costbasis_all
from #original o
left outer join #activity a on a.symbol = o.symbol and a.open_lot_id = o.open_id
group by o.symbol, o.side


/*
LONG
*/
-- Unrealized
SELECT @bDate as busdate, J.symbol, sum(debit - credit) as unrealized_pnl, 'LONG' as Side
into #unrealized_long
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'Mark to Market Longs'
and [event] in ('unrealizedpnl', 'realizedpnl') -- Need to ensure that we remove the realized from the unrealized
and j.[when] between @start and @bDate
group by a.name, j.symbol

-- realized
SELECT @bDate as busdate, j.symbol, sum(credit - debit) as realized_pnl, 'LONG' as Side
into #realized_long
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'Mark to Market Longs'
and event = 'realizedpnl'
and j.[when] between @start and @bDate
group by a.name, j.symbol

/*
SHORT
*/
-- Unrealized
SELECT @bDate as busdate, J.symbol, sum(debit - credit) as unrealized_pnl, 'SHORT' as Side
into #unrealized_short
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'Mark to Market Shorts'
and [event] in ('unrealizedpnl', 'realizedpnl')
and j.[when] between @start and @bDate
group by a.name, j.symbol

-- realized
SELECT @bDate as busdate, j.symbol, sum(debit - credit) as realized_pnl, 'SHORT' as Side
into #realized_short
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'Mark to Market Shorts'
and event = 'realizedpnl'
and j.[when] between @start and @bDate
group by a.name, j.symbol

begin tran
delete from cost_basis where business_date = @bDate and Side = 'LONG'
delete from cost_basis where business_date = @bDate and Side = 'SHORT'

insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side, realized_pnl, unrealized_pnl, eod_price )
select cb.busdate, cb.symbol, 
cb.Balance + coalesce(rl.realized_pnl,0), 
cb.Quantity, 
case
	When cb.Quantity != 0 then ABS((cb.Balance + coalesce(rl.realized_pnl,0)) / cb.Quantity) / coalesce(sd.Multiplier,1)
	else 0
end,
cb.Side, coalesce(rl.realized_pnl,0), coalesce(ul.unrealized_pnl,0) , cb.eod_price
from #costbasis_all cb 
left outer join #unrealized_long ul on ul.busdate = cb.busdate and ul.symbol = cb.symbol and ul.Side = cb.Side
left outer join #realized_long rl on rl.busdate = cb.busdate and rl.symbol = cb.symbol and rl.Side = cb.Side
left outer join #security_details sd on sd.SecurityCode = cb.symbol
where cb.Side = 'LONG'

insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side, realized_pnl, unrealized_pnl, eod_price )
select cb.busdate, cb.symbol, 
cb.Balance + coalesce(rl.realized_pnl,0), 
cb.Quantity, 
case
	When cb.Quantity != 0 then ABS((cb.Balance + coalesce(rl.realized_pnl,0)) / cb.Quantity) / coalesce(sd.Multiplier,1)
	else 0
end,
cb.Side, coalesce(rl.realized_pnl,0), coalesce(ul.unrealized_pnl,0) , cb.eod_price
from #costbasis_all cb 
left outer join #unrealized_short ul on ul.busdate = cb.busdate and ul.symbol = cb.symbol and ul.Side = cb.Side
left outer join #realized_short rl on rl.busdate = cb.busdate and rl.symbol = cb.symbol and rl.Side = cb.Side
left outer join #security_details sd on sd.SecurityCode = cb.symbol
where cb.Side = 'SHORT'

commit tran

select * from cost_basis where business_date = @bDate and Side in ('LONG', 'SHORT')

RETURN
