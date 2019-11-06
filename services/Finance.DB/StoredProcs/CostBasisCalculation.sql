CREATE PROCEDURE [dbo].[CostBasisCalculation]
	@businessDate Date
AS

DECLARE @bDate as Date
SET @bDate = @businessDate

SELECT @bDate as busdate, j.symbol, sum(debit - credit) as Balance, sum(j.quantity) as Quantity, Abs(sum(value)) / sum(j.quantity) as CostBasis, 'LONG' as Side, Avg(j.end_price) as eod_price
into #costbasis_long
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'LONG POSITIONS AT COST'
and j.[event] = 'tradedate'
and j.[when] <= @bDate
group by a.name, j.symbol
having sum(j.quantity) != 0

-- Unrealized
SELECT @bDate as busdate, J.symbol, sum(debit - credit) as unrealized_pnl, 'LONG' as Side
into #unrealized_long
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'Mark to Market Longs'
and [event] = 'unrealizedpnl'
and j.[when] <= @bDate
group by a.name, j.symbol

-- realized
SELECT @bDate as busdate, j.symbol, sum(debit - credit) as realized_pnl, 'LONG' as Side
into #realized_long
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'LONG POSITIONS AT COST'
and event = 'realizedpnl'
and j.[when] <= @bDate
group by a.name, j.symbol

SELECT @bDate as busdate, j.symbol, sum(debit - credit) as Balance, sum(j.quantity) as Quantity, Abs(sum(value) / sum(j.quantity)) as CostBasis, 'SHORT' as Side, Avg(j.end_price) as eod_price
into #costbasis_short
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'SHORT POSITIONS AT COST'
and j.[event] = 'tradedate'
and j.[when] <= @bDate
group by a.name, j.symbol
having sum(j.quantity) != 0

-- Unrealized
SELECT @bDate as busdate, J.symbol, sum(debit - credit) as unrealized_pnl, 'SHORT' as Side
into #unrealized_short
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'Mark to Market Shorts'
and [event] = 'unrealizedpnl'
and j.[when] <= @bDate
group by a.name, j.symbol

-- realized
SELECT @bDate as busdate, j.symbol, sum(debit - credit) as realized_pnl, 'LONG' as Side
into #realized_short
FROM vwJournal j
inner join account a on a.id = j.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'SHORT POSITIONS AT COST'
and event = 'realizedpnl'
and j.[when] <= @bDate
group by a.name, j.symbol

begin tran
delete from cost_basis where business_date = @bDate and Side = 'LONG'
delete from cost_basis where business_date = @bDate and Side = 'SHORT'

insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side, realized_pnl, unrealized_pnl, eod_price )
select cb.busdate, cb.symbol, cb.Balance, cb.Quantity, cb.CostBasis, cb.Side, coalesce(rl.realized_pnl,0), coalesce(ul.unrealized_pnl,0) , cb.eod_price
from #costbasis_long cb 
left outer join #unrealized_long ul on ul.busdate = cb.busdate and ul.symbol = cb.symbol and ul.Side = cb.Side
left outer join #realized_long rl on rl.busdate = cb.busdate and rl.symbol = cb.symbol and rl.Side = cb.Side

insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side, realized_pnl, unrealized_pnl, eod_price )
select cb.busdate, cb.symbol, cb.Balance, cb.Quantity, cb.CostBasis, cb.Side, coalesce(rl.realized_pnl,0), coalesce(ul.unrealized_pnl,0) , cb.eod_price
from #costbasis_short cb 
left outer join #unrealized_short ul on ul.busdate = cb.busdate and ul.symbol = cb.symbol and ul.Side = cb.Side
left outer join #realized_short rl on rl.busdate = cb.busdate and rl.symbol = cb.symbol and rl.Side = cb.Side

commit tran

select * from cost_basis where business_date = @bDate and Side in ('LONG', 'SHORT')

RETURN
