CREATE PROCEDURE [dbo].[PullDailyMarketPrices]
	@startDate Date,
	@endDate Date
AS

begin tran

select BusDate, Max(LastModifiedOn) as lmo
into #dates
from PositionMaster..intradayPositionSplit 
where BusDate >= @startDate and BusDate <= @enddate
group by BusDate

delete from FundAccounting..market_prices where business_date >= @startDate and business_date <= @enddate

insert into market_prices (business_date, security_id, symbol, [event], price, last_updated_by, last_updated_on)
SELECT 
	intraDay.BusDate, -1, Securitycode as Symbol, 'eod', Price, 'script', GetDate()
    FROM [PositionMaster].[dbo].[IntraDayPositionSplit] as intraDay
	inner join #dates as dates on dates.BusDate = intraDay.BusDate and dates.lmo = intraDay.LastModifiedOn
	and Price != 0.0

commit tran

select * from FundAccounting..market_prices where business_date >= @startDate and business_date <= @EndDate

RETURN 0
