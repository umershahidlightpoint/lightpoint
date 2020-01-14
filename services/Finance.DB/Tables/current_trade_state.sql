﻿CREATE TABLE current_trade_state (
LPOrderId [varchar](127),
AccrualId [varchar](127),
Action [varchar](31),
Symbol [varchar](100),
Side [varchar](63),
Quantity numeric(22,9),
TimeInForce [varchar](20),
OrderType [varchar](20),
SecurityType [varchar](63),
BloombergCode [varchar](50),
EzeTicker [varchar](50),
SecurityCode [varchar](100),
CustodianCode [varchar](63),
ExecutionBroker [varchar](63),
TradeId [varchar](127),
SecurityId [int],
Fund [varchar](20),
PMCode [varchar](20),
PortfolioCode [varchar](30),
Trader [varchar](20),
TradeCurrency [varchar](63),
TradePrice numeric(22,9),
TradeDate [datetime],
SettleCurrency [varchar](63),
SettlePrice numeric(22,9),
SettleDate [datetime],
TradeType [varchar](30),
TransactionCategory [varchar](127),
TransactionType [varchar](20),
ParentOrderId [varchar](127),
ParentSymbol [varchar](127),
Status [varchar](20),
NetMoney numeric(22,9),
Commission numeric(22,9),
Fees numeric(22,9),
SettleNetMoney numeric(22,9),
NetPrice numeric(22,9),
SettleNetPrice numeric(22,9),
OrderSource [varchar](20),
UpdatedOn [datetime],
LocalNetNotional numeric(22,9),
TradeTime [datetime]
)