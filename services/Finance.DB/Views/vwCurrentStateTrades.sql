CREATE VIEW [dbo].[vwCurrentStateTrades]
	AS 
WITH          
cteArchivedIntradayTradeIds (TradeId) AS (          
select Distinct Tradeid from TradeMaster..IntradayTradesHistory 
-- where CONVERT(date, TradeDate, 101) BETWEEN CONVERT(date, @StartDate, 101) AND CONVERT(date, @EndDate, 101)          
)          
SELECT 
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
from TradeMaster..Trade with(nolock)
left outer join SecurityMaster..Security s on s.SecurityId = trade.SecurityId
	INNER JOIN cteArchivedIntradayTradeIds CTE ON  CTE.TradeId = trade.TradeId           
   -- WHERE CONVERT(date, T.TradeDate, 101) BETWEEN CONVERT(date, @StartDate, 101) AND CONVERT(date, @EndDate, 101)  
   WHERE (LinkedTradeId is null or ( LinkedTradeId is not null and coalesce(Action, '') not in ( 'delete')))
   and TradeType not in ( 'Kickout' )
-- order by Trade.TradeDate asc

