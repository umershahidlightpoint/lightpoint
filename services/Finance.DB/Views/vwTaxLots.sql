CREATE VIEW [dbo].[vwTaxLots]
	AS 

SELECT 
	cb.business_date, 
	tls.business_date AS trade_date, 
	t.Fund, 
	t.ParentPortfolioCode, 
	t.PortfolioCode, 
	t.Strategy AS strategy, 
	t.SubStrategy AS sub_strategy, 
	tls.symbol, 
	t.SecurityId AS security_id, 
	tls.quantity, 
    cb.cost_basis, 
	cb.realized_pnl, 
	cb.unrealized_pnl, 
	cb.realized_pnl_fx, 
	cb.unrealized_pnl_fx, 
	cb.eod_price, 
	t.CustodianCode AS custodian_code, 
	t.TradeId AS lot_id, 
	tls.side, 
	tls.status
FROM dbo.tax_lot_status AS tls 
INNER JOIN TradeMaster.dbo.Trade AS t ON t.LPOrderId = tls.open_id 
INNER JOIN SecurityMaster.dbo.Security AS s ON s.SecurityId = t.SecurityId 
INNER JOIN dbo.cost_basis AS cb ON cb.symbol = tls.symbol
-- order by cb.business_date, tls.Symbol

