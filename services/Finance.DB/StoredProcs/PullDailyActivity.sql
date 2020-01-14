CREATE PROCEDURE [dbo].[PullDailyActivity]
	@startDate Date,
	@endDate Date
AS

begin tran

select p.*, 
CASE
	when s.IsOption = 1 and p.Exposure >= 0 then 'LONG'
	When s.IsOption = 1 and p.Exposure < 0 then 'SHORT'
	when s.IsOption = 0 and p.Quantity >= 0 then 'LONG'
	else 'SHORT'
END as ProductDirection,
Case
	When p.Exposure < 0 then p.Exposure
	Else 0
end as ShortDelta,
Case
	When p.Exposure >= 0 then p.Exposure
	Else 0
end as LongDelta
into #summary
from PositionMaster..intradayPositionSplit p
inner join ( select BusDate, Max(LastModifiedOn) as lmo  from PositionMaster..intradayPositionSplit group by BusDate) as lmo on lmo.BusDate = p.BusDate and lmo.lmo = p.LastModifiedOn
left outer join SecurityMaster..Security s on s.EzeTicker = p.SecurityCode and s.PricingSymbol = p.PriceSymbol and s.IsActive = 1

select p.BusDate, Fund, PortfolioCode, Sum(p.TradePnL) as TradePnl, Sum(p.DayPnL) as DayPnL, sum(p.Exposure) as LongExposure, Sum(BetaExp) as BetaExp, Sum(Beta2YwExp) as Beta2YwExp, sum(NavMkt) as NavMkt,
sum(MTDPnL) as MTDPnL,
sum(YTDPnL) as YTDPnL,
sum(QTDPnL) as QTDPnL,
sum(LongDelta) as Delta
into #summary_long
from #summary p
where p.ProductDirection = 'LONG'
group by p.BusDate, Fund, PortfolioCode

select p.BusDate, Fund, PortfolioCode, Sum(p.TradePnL) as TradePnl, Sum(p.DayPnL) as DayPnL, sum(p.Exposure) as ShortExposure, Sum(BetaExp) as BetaExp, Sum(Beta2YwExp) as Beta2YwExp, sum(NavMkt) as NavMkt,
sum(MTDPnL) as MTDPnL,
sum(YTDPnL) as YTDPnL,
sum(QTDPnL) as QTDPnL,
sum(ShortDelta) as Delta
into #summary_short
from #summary p
where p.ProductDirection = 'SHORT'
group by p.BusDate, Fund, PortfolioCode

/*
select * from #summary_long
order by BusDate desc

select * from #summary_short
order by BusDate desc
*/

delete from FundAccounting..unofficial_daily_pnl where business_date >= @startDate and business_date <= @enddate

insert into FundAccounting..unofficial_daily_pnl (
last_updated_by,
last_updated_date,
created_by, created_date, 
business_date, fund, portfolio, trade_pnl, [day], daily_percentage_return, long_pnl, long_percentage_change, short_pnl, short_percentage_change,
long_exposure,
short_exposure,
gross_exposure,
net_exposure,
six_md_beta_net_exposure,two_yw_beta_net_exposure,six_md_beta_short_exposure,nav_market,
dividend_usd,comm_usd,fee_taxes_usd,financing_usd,other_usd,
-- PNL Numbers
itd_pnl,
ytd_pnl,
qtd_pnl,
mtd_pnl,
pnl_percentage,
itd_percentage_return,
ytd_percentage_return,
qtd_percentage_return,
mtd_percentage_return
)
select 
'system',
GETDATE(),
'system',
GETDATE(),
l.BusDate, 
l.Fund, 
l.PortfolioCode, 
s.TradePnl + l.TradePnl as TradePnl, 
s.DayPnL + l.DayPnL as DayPnL,
Case
WHEN (l.NavMkt + s.NavMkt) = 0 THEN 0
ELSE
	(l.DayPnL + s.DayPnL) / (l.NavMkt + s.NavMkt)
end as DayReturn,
l.DayPnL as LongPnl,
CASE
	WHEN l.Delta =0 then 0
	ELSE l.DayPnL / l.Delta
END AS LongPercentage,
s.DayPnL as ShortPnl,
CASE
	WHEN s.Delta =0 then 0
	ELSE s.DayPnL / s.Delta
END AS ShortPercentage,
l.LongExposure, 
s.ShortExposure,
Abs(l.LongExposure) + Abs(s.ShortExposure) as GrossPnl,
l.LongExposure + s.ShortExposure as NetPnl,
l.BetaExp + s.BetaExp as BetaExp,
l.Beta2YwExp + s.Beta2YwExp as Beta2YwExp,
s.BetaExp as BetaShortExposure,
l.NavMkt + s.NavMkt as NavMkt,
0 as DividendUsd,
0 as CommUSd,
0 as FeesTaxes,
0 as FinancingUSD,
0 as OtherUsd,
0 as ITD,
l.YTDPnL + s.YTDPnL as YTD,
l.QTDPnL + s.QTDPnL as QTD,
l.MTDPnL + s.MTDPnL as MTD,
CASE
WHEN (l.NavMkt + s.NavMkt) = 0 THEN 0
ELSE
	(l.DayPnL + s.DayPnL) / (l.NavMkt + s.NavMkt)
end as PNLPercentage,
0 as ITDPercentage,
0 as YTDPercentage,
0 as QTDPercentage,
0 as MTDPercentage
from #summary_long l
full outer join  #summary_short s on s.BusDate = l.BusDate and l.Fund = s.Fund and l.PortfolioCode = s.PortfolioCode
where l.BusDate >= @startDate and l.BusDate <= @endDate

commit tran
-- select * from #summary_long
-- select * from #summary_short

-- select * from FundAccounting..unofficial_daily_pnl


-- exec FundAccounting..PullDailyActivity '2019-11-01', '2019-11-11'

select * from FundAccounting..unofficial_daily_pnl where business_date >= @startDate and business_date <= @EndDate

RETURN 0