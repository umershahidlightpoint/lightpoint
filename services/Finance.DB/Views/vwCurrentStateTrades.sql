/*    
Examples of usage    
    
select TradeTime, SecurityType from vwCurrentStateTrades where SecurityType = 'Journals'    
*/    
    
CREATE VIEW [dbo].[vwCurrentStateTrades]    
 AS   
select    
 t1.LPOrderId, t1.AccrualId,  t1.Action, coalesce(s.EzeTicker, t1.Symbol) as Symbol, t1.Side, t1.Quantity, t1.TimeInForce,     
 t1.OrderType, t1.SecurityType,  t1.BloombergCode, s.EzeTicker, s.SecurityCode,    
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
 COALESCE(t1.LocalNetNotional,0) as LocalNetNotional,
 t1.TradeTime
from TradeMaster..trade t1 inner join TradeMaster..trade t2 on t1.OriginalTradeId = t2.LPOrderId     
left outer join SecurityMaster..Security s on s.SecurityId = t1.SecurityId    
where  t1.LinkedTradeId is null     
and t1. IsBrokerLegTrade = 0    
and t1.IsBrokerTrade = 0 
and t1.Quantity != 0  
and t1.Action not in ('Delete')   
union all    
   select    
t.LPOrderId, t.AccrualId,  t.Action, coalesce(s.EzeTicker, t.Symbol) as Symbol, t.Side, t.Quantity, t.TimeInForce, t.OrderType, t.SecurityType,  t.BloombergCode, s.EzeTicker, s.SecurityCode,    
 t.CustodianCode, t.ExecutionBroker, t.TradeId,      
    t.SecurityId,    
 t.Fund, t.PMCode, t.PortfolioCode, t.Trader,     
 t.TradeCurrency, t.TradePrice, t.TradeDate,     
 t.SettleCurrency, t.SettlePrice, t.SettleDate,     
 t.TradeType,    
    t.TransactionCategory,    
    t.TransactionType,    
    t.ParentOrderId,    
    Coalesce(t.ParentSymbol, '') as ParentSymbol,    
 t.Status,     
 t.NetMoney,t.Commission, t.Fees,     
 t.SettleNetMoney, t.NetPrice, t.SettleNetPrice,    
 -- OrderedQuantity, FilledQuantity,RemainingQuantity,    
 t.OrderSource,    
 t.UpdatedOn,     
 COALESCE(t.LocalNetNotional,0) as LocalNetNotional,
 t.TradeTime
from TradeMaster..trade t left join TradeMaster..trade A on A.AdminOrderId = t.LPOrderId    
left outer join SecurityMaster..Security s on s.SecurityId = t.SecurityId    
where t.OriginalTradeId  is null and t.LinkedTradeId is null     
-- and CONVERT(date, TradeDate, 101) BETWEEN CONVERT(date, @StartDate, 101) AND CONVERT(date, @EndDate, 101)     
and t.IsBrokerLegTrade = 0    
and t.IsBrokerTrade = 0   
and t.IsHistorical = 0
and A.AdminOrderId is null
and t.Quantity != 0 
and t.Action not in ('Delete') 
-- Journals
union all    
   select    
t.LPOrderId, t.AccrualId,  t.Action, coalesce(s.EzeTicker, t.Symbol) as Symbol, t.Side, t.Quantity, t.TimeInForce, t.OrderType, t.SecurityType,  t.BloombergCode, s.EzeTicker, s.SecurityCode,    
 t.CustodianCode, t.ExecutionBroker, t.TradeId,      
    t.SecurityId,    
 t.Fund, t.PMCode, t.PortfolioCode, t.Trader,     
 t.TradeCurrency, t.TradePrice, t.TradeDate,     
 t.SettleCurrency, t.SettlePrice, t.SettleDate,     
 t.TradeType,    
    t.TransactionCategory,    
    t.TransactionType,    
    t.ParentOrderId,    
    Coalesce(t.ParentSymbol, '') as ParentSymbol,    
 t.Status,     
 t.NetMoney,t.Commission, t.Fees,     
 t.SettleNetMoney, t.NetPrice, t.SettleNetPrice,    
 -- OrderedQuantity, FilledQuantity,RemainingQuantity,    
 t.OrderSource,    
 t.UpdatedOn,     
 COALESCE(t.LocalNetNotional,0) as LocalNetNotional,
 t.TradeTime
from TradeMaster..trade t left join TradeMaster..trade A on A.AdminOrderId = t.LPOrderId    
left outer join SecurityMaster..Security s on s.SecurityId = t.SecurityId    
where t.OriginalTradeId  is null and t.LinkedTradeId is null     
-- and CONVERT(date, TradeDate, 101) BETWEEN CONVERT(date, @StartDate, 101) AND CONVERT(date, @EndDate, 101)     
and t.IsBrokerLegTrade = 0    
and t.IsBrokerTrade = 0   
and t.IsHistorical = 0
and A.AdminOrderId is null
and (t.Quantity = 0 and t.SecurityType in ('Journals'))
and t.Action not in ('Delete') 

  
GO


