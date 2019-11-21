CREATE VIEW [dbo].[vwTaxLots]
	AS 
select cb.business_date, tls.business_date as trade_date, t.Fund, t.ParentPortfolioCode, t.PortfolioCode, tls.Symbol, tls.quantity, cb.cost_basis, cb.realized_pnl, cb.unrealized_pnl, cb.realized_pnl_fx, cb.unrealized_pnl_fx, cb.eod_price from tax_lot_status tls
inner join TradeMaster..trade t on t.LPOrderId = tls.open_id
inner join SecurityMaster..security s on s.SecurityId = t.securityId
inner join cost_basis cb on cb.symbol = tls.Symbol
-- order by cb.business_date, tls.Symbol

