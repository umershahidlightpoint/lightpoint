/*
exec [AssetServicesOptions] '2019-12-31'
*/
CREATE PROCEDURE [dbo].[AssetServicesOptions]
@date date
AS
begin tran
IF OBJECT_ID('tempdb..##taxReport' , 'U') IS NULL
begin
	select *
	into ##taxReport
	from fnTaxLotReport(@date)
end
else
begin
	if not exists (select top 1 * from ##taxReport where report_date = @date)
	begin
		insert into ##taxReport select * from fnTaxLotReport(@date)
	end
end
commit

select s.EzeTicker, --not sure
cts.TradeDate,
cts.Side,
cts.TradeCurrency,
'N/A' as option_type,
'N/A' as option_underlier,
null as expiration_date,
0 as strike, --not sure
tl.quantity,
c.cost_basis,
(tl.quantity * c.cost_basis) as premium_paid,
mp.price as option_last_price, --not sure
(mp.price * tl.quantity) as current_option_premium,
(mp.price - c.cost_basis) as gain_loss,
mp.price as underlying_closing_price, --not sure
0 as moniness, --not sure
'In Money' as [status], -- not sure
7 as days_to_expire, -- not sure
1.25 as option_decay, --not sure
250000 as decay, --not sure
35714 as daily_decay, --not sure
0 as underlying_exercise_price, -- not sure
0 as underlying_quantity, -- not sure
0 as underlying_exposure, --not sure
cts.CustodianCode
into #assetservices
from fnTaxLotReport(@date) tl
inner join [SecurityMaster]..security s on tl.symbol = s.ezeticker
inner join current_trade_state cts on cts.LPOrderId = tl.open_id
left join market_prices mp on mp.security_id = s.SecurityId and mp.business_date = @date and mp.event = 'eod'
left join cost_basis c on c.symbol = tl.symbol and c.business_date = tl.business_date
where cts.Side in ('BUY', 'SELL') and cts.SecurityType in ('Equity Option')
-- and cts.SecurityType = 'Equity Option'

select * from #assetservices where side = 'BUY'
select * from #assetservices where side = 'SELL'

RETURN 0