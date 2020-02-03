/*
truncate table market_prices_history
delete from market_prices
truncate table market_prices

exec [PullDailyMarketPrices] '2019-04-01', '2019-12-31'
*/

CREATE PROCEDURE [dbo].[PullDailyMarketPrices]
	@startDate Date,
	@endDate Date
AS

begin tran

select BusDate, Max(LastModifiedOn) as lmo
into #dates
from PositionMaster..intradayPositionSplit where BusDate >= @startDate and BusDate <= @enddate
group by BusDate

select business_date, symbol, price 
into #marketdata
from FundAccounting..market_prices
where last_updated_by = 'webservice'

select p.SecurityCode, PriceSymbol, s.SecurityId, st.SecurityTypeCode as SecurityType, count(*) as [count] 
into #securityId
from PositionMaster..IntraDayPositionSplit p
inner join SecurityMaster..Security s on s.EzeTicker = p.SecurityCode and (s.PricingSymbol = p.PriceSymbol or s.PricingSymbol is null)
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId 
where BusDate >= @startDate and BusDate <= @enddate
group by p.SecurityCode, PriceSymbol, s.SecurityId, st.SecurityTypeCode

RAISERROR ('Start Removing previous eod data', 0, 0)
delete from FundAccounting..market_prices_history where business_date >= @startDate and business_date <= @enddate and [event]='eod'
delete from FundAccounting..market_prices where business_date >= @startDate and business_date <= @enddate and [event]='eod'
print 'End Removing previous eod data'

/*
Grabbing the Price from intradyPositionSplit as this is the Local Price, SettlePrice is the USD Price, i.e. Price * EndFx
*/
print 'Exists'
select count(*) from market_prices

insert into market_prices (business_date, security_id, symbol, price, [event], last_updated_by, last_updated_on)
SELECT 
	intraDay.BusDate, sid.SecurityId, intraDay.SecurityCode as Symbol, 
	case
		when sid.SecurityType in ('FORWARD') and MAX(intraday.Price) = 1 then MAX(intraday.SettlePrice)
		else MAX(intraday.Price)
	end,
	'eod', 'script', GetDate()
    FROM [PositionMaster].[dbo].[IntraDayPositionSplit] as intraDay
	inner join #dates as dates on dates.BusDate = intraDay.BusDate and dates.lmo = intraDay.LastModifiedOn
	inner join #securityid as sid on sid.SecurityCode = intraDay.SecurityCode and sid.PriceSymbol = intraDay.PriceSymbol
	left outer join #marketdata m on m.business_date = intraDay.BusDate and m.symbol = intraDay.SecurityCode
	where 
	intraDay.BusDate >= @startDate and intraDay.BusDate <= @enddate and
	m.business_date is null and 
	intraDay.Price != 0.0
--	and intraDay.SecurityCode like '@CASHUSD' 
	group by intraDay.BusDate, sid.SecurityId, intraDay.SecurityCode, sid.SecurityType
	order by intraDay.BusDate desc

commit tran

select business_date, symbol, count(*) from FundAccounting..market_prices 
group by business_date, symbol
having count(*) > 1


RETURN 0