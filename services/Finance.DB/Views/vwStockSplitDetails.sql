CREATE VIEW [dbo].[vwStockSplitDetails]
	AS
select t.fund,
s.id,
t.symbol,
t.quantity as pre_split_quantity,
(t.quantity * s.bottom_ratio) / s.top_ratio as post_split_quantity,
0 as cost_basis_pre_split,
0 as cost_basis_post_split,
0 as pre_split_investment_at_cost,
0 as post_split_investment_at_cost
from tax_lot_status t
inner join stock_splits s on t.symbol = s.symbol
and s.active_flag = 1
and s.execution_date <= GETDATE()
and t.trade_date <= s.execution_date
and (t.status = 'open' or t.status = 'partially closed') 
and (t.side = 'buy' or t.side = 'short')

