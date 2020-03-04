/* Examples
exec CostBasisCalculation '2019-12-31'

select * from vwCostBasis where business_date = '2019-12-31'
and Symbol = 'EXPR'
order by Symbol asc
*/
CREATE PROCEDURE [dbo].[CostBasisCalculation]
	@businessDate Date,
	@symbol varchar(100) = null
AS

-- SET NOCOUNT ON

DECLARE @bDate as Date
SET @bDate = @businessDate

declare @v as Int
select @v = id from account_type where name = 'CHANGE IN UNREALIZED GAIN/(LOSS)'

RAISERROR('CostBasisCalculation', 0, 1) with nowait

select SecurityCode, BbergCode, coalesce(sd.Multiplier, sf.ContractSize) as Multiplier 
into #security_details
from SecurityMaster..Security s with(nolock)
left join SecurityMaster..SecDerivatives sd on sd.SecurityId = s.SecurityId
left join SecurityMaster..SecFutures sf on sf.SecurityId = s.SecurityId
where coalesce(sd.Multiplier, sf.ContractSize) is not null

RAISERROR('Completed #security_details', 0, 1) with nowait

select @bDate as business_date, open_id, tls.symbol, tls.side, t.TradeCurrency, SUM(original_quantity) as quantity, SUM(original_quantity * trade_price) as investment_at_cost
into #tax_lot_status
from tax_lot_status tls with(nolock)
inner join current_trade_state t on t.lpOrderId = open_id
where trade_date <= @bDate
group by open_id, tls.symbol, tls.side, t.TradeCurrency

RAISERROR('Completed #tax_lot_status', 0, 1) with nowait

select @bDate as business_date, open_lot_id, sum(abs(quantity)) as quantity, sum(abs(quantity * trade_price)) as investment_at_cost
into #tax_lot
from tax_lot 
where trade_date <= @bDate
group by open_lot_id

RAISERROR('Completed #tax_lot', 0, 1) with nowait

select tls.business_date, tls.symbol, dbo.fnSide(tls.Side) as side,
Abs(coalesce(tls.quantity,0)) as totalQuantity, 
Abs(coalesce(tl.quantity,0)) as consumedQuantity, 
Abs(coalesce(tls.quantity,0)) - Abs(coalesce(tl.quantity,0)) as quantity,
case
	when TradeCurrency = 'GBX' or TradeCurrency = 'GBp' then (Abs(coalesce(tls.quantity,0)) - Abs(coalesce(tl.quantity,0))) * coalesce(mp.price,0) / 100.0 
	--else (Abs(coalesce(tls.quantity,0)) - Abs(coalesce(tl.quantity,0))) * coalesce(mp.price,1) 
	else (Abs(coalesce(tls.investment_at_cost,0)) - Abs(coalesce(tl.investment_at_cost,0)))
end as investment_at_cost,
case
	when TradeCurrency = 'GBX' or TradeCurrency = 'GBp' then coalesce(mp.price,0) / 100.0 
	else coalesce(mp.price,0) 
end as market_price
into #tax_lots_final
from #tax_lot_status tls
left outer join market_prices mp on mp.business_date = @bDate and mp.symbol = tls.symbol
left outer join #tax_lot tl on tl.open_lot_id = tls.open_id
order by tls.symbol

RAISERROR('Completed #tax_lots_final', 0, 1) with nowait

select 
@bDate as busdate,
tls.symbol, 
CASE
	WHEN tls.side = 'BUY' then ABS(SUM(tls.investment_at_cost))
	ELSE ABS(SUM(tls.investment_at_cost)) * -1
End as Balance,
SUM(tls.quantity) as Quantity, 
tls.side,
MAX(market_price) as eod_price
into #costbasis_all
from #tax_lots_final tls
left outer join #security_details sd on sd.SecurityCode = tls.symbol
where tls.business_date <= @bDate
group by tls.symbol, side

select '#costbasis_all', * from #costbasis_all where symbol = @symbol

RAISERROR('Completed #costbasis_all', 0, 1) with nowait

SELECT @bDate as busdate, J.symbol, j.SecurityType, dbo.fnSide(j.Side) as side,sum(credit-debit) as unrealized_pnl
into #unrealized_pnl
FROM current_journal_full j
where 
AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)', 'Change in Unrealized Derivatives Contracts at Fair Value', 'Change in Unrealized Derivatives Contracts due to FX Translation', 'change in unrealized do to fx translation')
and j.[when] <= @bDate
group by j.symbol, dbo.fnSide(j.Side) ,j.SecurityType
order by j.Symbol

select '#unrealized_pnl', * from #unrealized_pnl where symbol = @symbol

RAISERROR('Completed #unrealized_pnl', 0, 1) with nowait

SELECT @bDate as busdate, J.symbol, j.SecurityType, dbo.fnSide(j.Side) as side, sum(credit - debit) as unrealized_pnl_fx
into #unrealized_pnl_fx
FROM current_journal_full j
where 
AccountType in ('Change in unrealized due to fx on original Cost', 'change in unrealized do to fx translation')
and j.[when] <= @bDate
group by j.symbol, dbo.fnSide(j.Side),j.SecurityType
order by j.Symbol

select '#unrealized_pnl_fx', * from #unrealized_pnl_fx where symbol = @symbol

RAISERROR('Completed #unrealized_pnl_fx', 0, 1) with nowait

SELECT @bDate as busdate, J.symbol, j.SecurityType, dbo.fnSide(j.Side) as side, sum(credit - debit) as realized_pnl
into #realized_pnl
FROM current_journal_full j
where 
AccountType in ('REALIZED GAIN/(LOSS)')
and j.[when] <= @bDate
group by j.symbol, dbo.fnSide(j.Side),j.SecurityType
order by j.Symbol

select '#realized_pnl', * from #realized_pnl where symbol = @symbol

RAISERROR('Completed #realized_pnl', 0, 1) with nowait

SELECT @bDate as busdate, J.symbol, j.SecurityType, dbo.fnSide(j.Side) as side, sum(credit - debit) as realized_pnl_fx
into #realized_pnl_fx
FROM current_journal_full j
where 
AccountType in ('REALIZED GAIN/(LOSS) DUE TO FX')
and j.[when] <= @bDate
group by j.symbol, dbo.fnSide(j.Side),j.SecurityType
order by j.Symbol

select '#realized_pnl_fx', * from #realized_pnl_fx where symbol = @symbol

RAISERROR('Completed #realized_pnl_fx', 0, 1) with nowait

select upnl.busdate, upnl.symbol, upnl.SecurityType, upnl.side, 
coalesce(upnl.unrealized_pnl,0) as unrealized, 
coalesce(upnlfx.unrealized_pnl_fx, 0) as unrealized_fx, 
coalesce(rpnl.realized_pnl, 0) as realized, 
coalesce(rpnlfx.realized_pnl_fx,0) as realized_fx, coalesce(rpnl.realized_pnl,0) + coalesce(rpnlfx.realized_pnl_fx,0) + coalesce(upnl.unrealized_pnl,0) + coalesce(upnlfx.unrealized_pnl_fx,0) as net 
into #details
from #unrealized_pnl upnl
left outer join #unrealized_pnl_fx upnlfx on upnlfx.symbol = upnl.symbol and upnlfx.side = upnl.side
left outer join #realized_pnl rpnl on rpnl.symbol = upnl.symbol and rpnl.side = upnl.side
left outer join #realized_pnl_fx rpnlfx on rpnlfx.symbol = upnl.symbol and rpnlfx.side = upnl.side
order by upnl.Symbol asc

select '#details', * from #details where symbol = @Symbol

RAISERROR('Updating cost_basis', 0, 1) with nowait
-- begin tran
delete from cost_basis where business_date = @bDate
-- delete from cost_basis where business_date = @bDate and Side = 'SHORT'

insert into cost_basis ( business_date, symbol, balance, quantity, cost_basis, side, realized_pnl, unrealized_pnl, eod_price, realized_pnl_fx, unrealized_pnl_fx )
select cb.busdate, cb.symbol, 
cb.Balance, 
cb.Quantity, 
case
	When ROUND(cb.Quantity,2) != 0 then ABS((cb.Balance + coalesce(ul.realized,0)) / cb.Quantity) / coalesce(sd.Multiplier,1)
	else 0
end,
cb.Side, 
coalesce(ul.realized,0), 
case
	When ROUND(cb.Quantity,2) != 0 then coalesce(ul.unrealized,0)
	else 0
end, 
cb.eod_price,
ul.realized_fx,
ul.unrealized_fx
from #costbasis_all cb 
inner join #details ul on ul.busdate = cb.busdate and ul.symbol = cb.symbol and ul.Side = cb.Side
left outer join #security_details sd on sd.SecurityCode = cb.symbol
-- where cb.Side = 'LONG'

-- commit tran

RAISERROR('Completed', 0, 1) with nowait

RETURN