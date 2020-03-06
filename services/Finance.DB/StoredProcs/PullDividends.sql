/*
This depends on the schema in TradeMaster..trade, so for the moment we only enable this once the schema is in place
*/
CREATE PROCEDURE [dbo].[PullDividends]
AS

/*
insert into cash_dividends (created_by, created_date, last_updated_date, last_updated_by, symbol, notice_date, execution_date, record_date, pay_date, rate, currency, withholding_rate, fx_rate, active_flag)
select 'system', GetDate(), GetDate(), 'system', t.ParentSymbol, t.TradeDate, t.TradeDate, t.SettleDate, t.SettleDate, t.LocalDividendPerShare, 'USD', t.WithholdingRate, 1, 1
from TradeMaster..trade t
left outer join cash_dividends cd on cd.execution_date = t.TradeDate and cd.symbol = t.ParentSymbol
inner join (
select Symbol, ParentSymbol, TradeDate, Max(TradeTime) as time from TradeMaster..trade 
where SecurityType = 'journals'
and Symbol = 'ZZ_CASH_DIVIDENDS' and ParentSymbol is not null
group by Symbol, ParentSymbol, TradeDate
) as s on s.time = t.TradeTime and s.ParentSymbol = t.ParentSymbol and s.TradeDate = t.TradeDate
where SecurityType = 'journals'
and t.Symbol = 'ZZ_CASH_DIVIDENDS' and t.ParentSymbol is not null
and cd.currency is null
*/

insert into cash_dividends (created_by, created_date, last_updated_date, last_updated_by, symbol, notice_date, execution_date, record_date, pay_date, rate, currency, withholding_rate, fx_rate, active_flag)
select 'system', GetDate(), GetDate(), 'system', t.ParentSymbol, t.TradeDate, t.TradeDate, t.SettleDate, t.SettleDate, 0, 'USD', 0, 1, 1
from TradeMaster..trade t
left outer join cash_dividends cd on cd.execution_date = t.TradeDate and cd.symbol = t.ParentSymbol
inner join (
select Symbol, ParentSymbol, TradeDate, Max(TradeTime) as time from TradeMaster..trade 
where SecurityType = 'journals'
and Symbol = 'ZZ_CASH_DIVIDENDS' and ParentSymbol is not null
group by Symbol, ParentSymbol, TradeDate
) as s on s.time = t.TradeTime and s.ParentSymbol = t.ParentSymbol and s.TradeDate = t.TradeDate
where SecurityType = 'journals'
and t.Symbol = 'ZZ_CASH_DIVIDENDS' and t.ParentSymbol is not null
and cd.currency is null

RETURN 0
