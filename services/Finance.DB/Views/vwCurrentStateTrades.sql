/*
Examples of usage

select * from vwCurrentStateTrades where Symbol = 'AAPL'
*/

CREATE VIEW [dbo].[vwCurrentStateTrades]
	AS 
select
	t1.LPOrderId, t1.AccrualId,  t1.Action, coalesce(s.SecurityCode, t1.Symbol) as Symbol, t1.Side, t1.Quantity, t1.TimeInForce, 
	t1.OrderType, t1.SecurityType,  t1.BloombergCode,
	t1.CustodianCode, t1.ExecutionBroker, t1.TradeId,  
    t1.SecurityId,
	t1.Fund, t1.PMCode, t1.PortfolioCode, t1.Trader, 
	t1.TradeCurrency, t1.TradePrice, t1.TradeDate, 
	t1.SettleCurrency, t1.SettlePrice, t1.SettleDate, 
	t1.TradeType,
    t1.TransactionCategory,
    t1.TransactionType,
    t1.ParentOrderId,
    Coalesce(t1.ParentSymbol, '') as ParentSymbol,
	t1.Status, 
	t1.NetMoney,t1.Commission, t1.Fees, 
	t1.SettleNetMoney, t1.NetPrice, t1.SettleNetPrice,
	-- OrderedQuantity, FilledQuantity,RemainingQuantity,
	t1.OrderSource,
	t1.UpdatedOn, 
	COALESCE(t1.LocalNetNotional,0) as LocalNetNotional     
from TradeMaster..trade t1 inner join TradeMaster..trade t2 on t1.OriginalTradeId = t2.LPOrderId 
left outer join SecurityMaster..Security s on s.SecurityId = t1.SecurityId
where  t1.LinkedTradeId is null 
-- and CONVERT(date, t1.TradeDate, 101) BETWEEN CONVERT(date, @StartDate, 101) AND CONVERT(date, @EndDate, 101) 
and t1. IsBrokerLegTrade = 0
and t1.IsBrokerTrade = 0
union all
select
LPOrderId, AccrualId,  Action, coalesce(s.SecurityCode, Symbol) as Symbol, Side, Quantity, TimeInForce, OrderType, SecurityType,  BloombergCode,
	CustodianCode, ExecutionBroker, trade.TradeId,  
    trade.SecurityId,
	Fund, PMCode, PortfolioCode, Trader, 
	TradeCurrency, TradePrice, TradeDate, 
	SettleCurrency, SettlePrice, SettleDate, 
	TradeType,
    TransactionCategory,
    TransactionType,
    ParentOrderId,
    Coalesce(ParentSymbol, '') as ParentSymbol,
	Status, 
	NetMoney,Commission, Fees, 
	SettleNetMoney, NetPrice, SettleNetPrice,
	-- OrderedQuantity, FilledQuantity,RemainingQuantity,
	OrderSource,
	UpdatedOn, 
	COALESCE(LocalNetNotional,0) as LocalNetNotional     
from TradeMaster..trade 
left outer join SecurityMaster..Security s on s.SecurityId = trade.SecurityId
where OriginalTradeId  is null and LinkedTradeId is null 
-- and CONVERT(date, TradeDate, 101) BETWEEN CONVERT(date, @StartDate, 101) AND CONVERT(date, @EndDate, 101) 
and IsBrokerLegTrade = 0
and IsBrokerTrade = 0

