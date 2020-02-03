CREATE PROCEDURE [dbo].[PullDailyFxPrices]
	@startDate Date,
	@endDate Date
AS

begin tran

select business_date, currency, price 
into #marketdata
from FundAccounting..fx_rates
where last_updated_by = 'webservice'

delete from FundAccounting..fx_rates_history where business_date >= @startDate and business_date <= @enddate and [event]='eod'
delete from FundAccounting..fx_rates where business_date >= @startDate and business_date <= @enddate and [event]='eod'

insert into fx_rates (business_date, currency, [event], price, last_updated_by, last_updated_on)
select BusDate, CurrencyCode, 'eod', CalculatedFxRate as FxRate, 'script', GetDate() 
from FundAccounting..[vwNormalizedEodFxRates] as rates
left outer join #marketdata m on m.business_date = rates.BusDate and m.currency = rates.CurrencyCode
where rates.BusDate >= @startdate and rates.BusDate<=@endDate and m.business_date is null
order by BusDate, CurrencyCode desc

commit tran

-- select * from FundAccounting..fx_rates where business_date >= @startDate and business_date <= @EndDate

RETURN 0