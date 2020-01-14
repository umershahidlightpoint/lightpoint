CREATE PROCEDURE [dbo].[FundTheoretical]
@dateTo date null,
@dateFrom date null,
@portfolio nvarchar(100) null
as
SELECT m.performance_date, m.portfolio, m.fund, m.start_month_estimate_nav, m.monthly_end_nav, m.performance, m.mtd, m.ytd_net_performance, m.qtd_net_perc, m.ytd_net_perc, m.itd_net_perc  FROM monthly_performance m
WHERE (1=(CASE WHEN @dateTo IS NULL THEN 1 ELSE 0 END) or m.performance_date <= @dateTo)
AND (1=(CASE WHEN @dateFrom IS NULL THEN 1 ELSE 0 END) or m.performance_date >= @dateFrom)
AND (1= (CASE WHEN @portfolio IS NULL THEN 1 ELSE 0 END) or m.portfolio = @portfolio)
order by m.performance_date asc