/*
select * from fnTaxLotReport('2019-09-09') where symbol like 'NX%'
exec [DividendDetails] '2019-09-09', 13

*/
CREATE PROCEDURE [dbo].[DividendDetails]
	@executionDate datetime,
	@dividendId int null
AS
select t.fund,
d.id,
t.symbol,
t.quantity,
coalesce(mp.price,1) as fx_rate,
d.currency,
d.execution_date,
t.trade_date,
abs(t.quantity * d.rate) as base_gross_dividend,
abs(t.quantity * d.rate) * (d.withholding_rate /100) as base_withholding_amount,
abs(t.quantity * d.rate) + (abs(t.quantity * d.rate) * (d.withholding_rate /100)) as base_net_dividend,
abs(t.quantity * d.rate) * coalesce(mp.price,1) as settlement_gross_dividend,
abs(t.quantity * d.rate) * (d.withholding_rate /100) * coalesce(mp.price,1) as settlement_withholdings_amount,
abs(t.quantity * d.rate) * coalesce(mp.price,1) as settlement_local_net_dividend
from fnTaxLotReport(@executionDate) t
inner join cash_dividends d on t.symbol = d.symbol and
case when @dividendId is null
then 1 
when @dividendId = d.id
then 1
else 0
end = 1
and d.active_flag = 1
and d.execution_date <= GETDATE()
and t.trade_date <= d.execution_date
and (t.status = 'open' or t.status = 'partially closed') 
and (t.side = 'buy' or t.side = 'short')
left outer join market_prices mp on mp.symbol = '@CASH' + d.currency and mp.business_date = @executionDate
RETURN 0
