CREATE PROCEDURE [dbo].[CostBasisCalculation]
	@businessDate Date
AS

DECLARE @bDate as Date
SET @bDate = @businessDate

SELECT @bDate as busdate, journal.symbol, sum(value) as Balance, sum(quantity) as Quantity, Abs(sum(value)) / sum(quantity) as CostBasis, 'LONG' as Side, Avg(journal.end_price) as eod_price
into #costbasis_long
FROM journal with(nolock)
inner join account a on a.id = journal.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'LONG POSITIONS AT COST'
and journal.[when] <= @bDate
group by a.name, journal.symbol
having sum(quantity) != 0

-- Unrealized
SELECT @bDate as busdate, journal.symbol, sum(value) as unrealized_pnl, 'LONG' as Side
into #unrealized_long
FROM journal with(nolock)
inner join account a on a.id = journal.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'Mark to Market Longs'
and journal.[when] <= @bDate
group by a.name, journal.symbol

-- realized
SELECT @bDate as busdate, journal.symbol, sum(value) as realized_pnl, 'LONG' as Side
into #realized_long
FROM journal with(nolock)
inner join account a on a.id = journal.account_id
inner join account_type a_t on a_t.id = a.account_type_id
where a_t.name = 'REALIZED GAIN/(LOSS)'
and journal.[when] <= @bDate
group by a.name, journal.symbol

begin tran
delete from cost_basis where business_date = @bDate and Side = 'LONG'

insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side, realized_pnl, unrealized_pnl, eod_price )
select cb.busdate, cb.symbol, cb.Balance, cb.Quantity, cb.CostBasis, cb.Side, coalesce(rl.realized_pnl,0), coalesce(ul.unrealized_pnl,0) , cb.eod_price
from #costbasis_long cb 
left outer join #unrealized_long ul on ul.busdate = cb.busdate and ul.symbol = cb.symbol and ul.Side = cb.Side
left outer join #realized_long rl on rl.busdate = cb.busdate and rl.symbol = cb.symbol and rl.Side = cb.Side
commit tran

select * from cost_basis where business_date = @bDate and Side = 'LONG'

RETURN
