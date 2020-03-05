/*
select * from vwPositions where business_date = '2020-01-09'
and Dividend != 0
order by business_date

where Dividend
!= 0
*/

CREATE VIEW [dbo].[vwPositions]
AS

SELECT cb.business_date, t.Fund, t.ParentPortfolioCode, t.PortfolioCode, t.Strategy, t.SubStrategy AS sub_strategy, t.CustodianCode AS custodian_code, t.SecurityId, tls.symbol, tls.side,t.SettleCurrency currency,   
SUM(tls.investment_at_cost + COALESCE (tl.investment_at_cost, 0)) * - 1 AS Balance, 
SUM(tls.original_quantity + COALESCE (tl.quantity, 0)) AS Quantity, 
MAX(COALESCE (mp.price, 0))*MAX(COALESCE (tls.fx_rate, 0))*SUM(nullif(s.isEquity | s.isSwap,0) * tls.original_quantity + COALESCE (tl.quantity, 0))  AS market_value,
SUM(cb.realized_pnl) AS realized_pnl,   
SUM(cb.unrealized_pnl) AS unrealized_pnl, 
SUM(cb.realized_pnl_fx) AS realized_pnl_fx, 
SUM(cb.unrealized_pnl_fx) AS unrealized_pnl_fx, 
SUM(cb.realized_pnl) + SUM(cb.unrealized_pnl) + SUM(cb.realized_pnl_fx) + SUM(cb.unrealized_pnl_fx) AS net_pnl, 
SUM(cb.realized_pnl) + SUM(cb.realized_pnl_fx) AS total_realized_pnl, 
SUM(cb.unrealized_pnl) + SUM(cb.unrealized_pnl_fx) AS total_unrealized_pnl, 
MAX(COALESCE (cb.cost_basis, 0)) AS cost_basis, 
0 as UnitCostLocal,
0 as CostLocal,
0 as CostBook,
MAX(COALESCE (mp.price, 0)) AS eod_price, 
MAX(COALESCE (tls.fx_rate, 0)) AS eod_fx_rate,
SUM(COALESCE (cb.dividend_net, 0)) as Dividend,
0 as Interest,
0 as Other,
SUM(cb.realized_pnl) + SUM(cb.unrealized_pnl) + SUM(cb.realized_pnl_fx) + SUM(cb.unrealized_pnl_fx) AS pnl 
FROM dbo.tax_lot_status AS tls 
INNER JOIN dbo.cost_basis AS cb ON cb.symbol = tls.symbol AND tls.business_date <= cb.business_date 
LEFT OUTER JOIN dbo.tax_lot AS tl ON tl.open_lot_id = tls.open_id AND tl.trade_date <= cb.business_date 
INNER JOIN TradeMaster.dbo.Trade AS t ON t.LPOrderId = tls.open_id 
INNER JOIN SecurityMaster.dbo.Security AS s ON s.SecurityId = t.SecurityId 
LEFT OUTER JOIN dbo.market_prices AS mp ON mp.symbol = s.EzeTicker AND mp.business_date = cb.business_date
GROUP BY 
	cb.business_date, 
	tls.symbol, 
	t.Fund, 
	t.ParentPortfolioCode, 
	t.PortfolioCode, 
	t.Strategy, 
	t.SubStrategy, 
	t.CustodianCode, 
	t.SecurityId, 
	tls.side ,
	t.SettleCurrency
GO
