/*
select top 100 * from PositionMaster..[IntraDayPositionSplit]

exec [PullDailyMarketPrices] '2019-04-01', '2019-12-18'

select count(*), SecurityCode,  from SecurityMaster..Security
group by SecurityCode
having count(*) > 1
*/

CREATE PROCEDURE [dbo].[PullDailyMarketPrices]
	@startDate Date,
	@endDate Date
AS

begin tran

select BusDate, Max(LastModifiedOn) as lmo
into #dates
from PositionMaster..intradayPositionSplit 
group by BusDate

select business_date, symbol, price 
into #marketdata
from FundAccounting..market_prices
where last_updated_by = 'webservice'

select p.SecurityCode, PriceSymbol, s.SecurityId, count(*) as [count] 
into #securityId
from PositionMaster..IntraDayPositionSplit p
inner join SecurityMaster..Security s on s.EzeTicker = p.SecurityCode and s.PricingSymbol = p.PriceSymbol
group by p.SecurityCode, PriceSymbol, s.SecurityId


delete from FundAccounting..market_prices_history where business_date >= @startDate and business_date <= @enddate and [event]='eod'
delete from FundAccounting..market_prices where business_date >= @startDate and business_date <= @enddate and [event]='eod'

insert into market_prices (business_date, security_id, symbol, [event], price, last_updated_by, last_updated_on)
SELECT 
	intraDay.BusDate, sid.SecurityId, intraDay.SecurityCode as Symbol, 'eod', intraday.Price, 'script', GetDate()
    FROM [PositionMaster].[dbo].[IntraDayPositionSplit] as intraDay
	inner join #dates as dates on dates.BusDate = intraDay.BusDate and dates.lmo = intraDay.LastModifiedOn
	inner join #securityid as sid on sid.SecurityCode = intraDay.SecurityCode and sid.PriceSymbol = intraDay.PriceSymbol
	left outer join #marketdata m on m.business_date = intraDay.BusDate and m.symbol = intraDay.SecurityCode
	where m.business_date is null and intraDay.Price != 0.0
--	and intraDay.SecurityCode like '@CASHUSD' 
	order by intraDay.BusDate desc

commit tran

select * from FundAccounting..market_prices where business_date >= @startDate and business_date <= @EndDate

RETURN 0