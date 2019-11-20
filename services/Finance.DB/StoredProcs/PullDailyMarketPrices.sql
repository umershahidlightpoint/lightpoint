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

delete from FundAccounting..market_prices_history where business_date >= @startDate and business_date <= @enddate and [event]='eod'
delete from FundAccounting..market_prices where business_date >= @startDate and business_date <= @enddate and [event]='eod'

insert into market_prices (business_date, security_id, symbol, [event], price, last_updated_by, last_updated_on)
SELECT 
	intraDay.BusDate, -1, Securitycode as Symbol, 'eod', intraday.Price, 'script', GetDate()
    FROM [PositionMaster].[dbo].[IntraDayPositionSplit] as intraDay
	inner join #dates as dates on dates.BusDate = intraDay.BusDate and dates.lmo = intraDay.LastModifiedOn
	left outer join #marketdata m on m.business_date = intraDay.BusDate and m.symbol = intraDay.SecurityCode
	where m.business_date is null and intraDay.Price != 0.0
--	and intraDay.SecurityCode like '@CASHUSD' 
	order by intraDay.BusDate desc

commit tran

select * from FundAccounting..market_prices where business_date >= @startDate and business_date <= @EndDate

RETURN 0
