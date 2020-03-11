CREATE PROCEDURE [dbo].[DividendDetails]
	@executionDate datetime,
	@dividendId int null
AS
select t.fund,
d.id,
t.symbol,
t.quantity,
t.fx_rate,
d.currency,
d.execution_date,
abs(t.quantity * d.rate) as base_gross_dividend,
abs(t.quantity * d.rate) * (d.withholding_rate /100) as base_withholding_amount,
abs(t.quantity * d.rate) + (abs(t.quantity * d.rate) * (d.withholding_rate /100)) as base_net_dividend,
abs(t.quantity * d.rate) * d.fx_rate as settlement_gross_dividend,
abs(t.quantity * d.rate) * (d.withholding_rate /100) * d.fx_rate as settlement_withholdings_amount,
abs(t.quantity * d.rate) * d.fx_rate * d.fx_rate as settlement_local_net_dividend
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
RETURN 0
