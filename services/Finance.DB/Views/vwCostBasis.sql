CREATE VIEW [dbo].[vwCostBasis]
	AS 
select *, 
unrealized_pnl + unrealized_pnl_fx + realized_pnl + realized_pnl_fx as net
from cost_basis
