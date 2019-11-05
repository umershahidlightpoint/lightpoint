CREATE PROCEDURE [dbo].[DailyPnl]
@dateTo date null,
@dateFrom date null,
@portfolio nvarchar(100) null
as
SELECT m.business_date, m.portfolio, m.fund, m.day, m.daily_percentage_return, m.mtd_percentage_return, m.qtd_percentage_return, m.ytd_percentage_return, m.itd_percentage_return, m.mtd_pnl, m.qtd_pnl, m.ytd_pnl, m.itd_pnl  FROM unofficial_daily_pnl m
WHERE (1=(CASE WHEN @dateTo IS NULL THEN 1 ELSE 0 END) or m.business_date <= @dateTo)
AND (1=(CASE WHEN @dateFrom IS NULL THEN 1 ELSE 0 END) or m.business_date >= @dateFrom)
AND (1= (CASE WHEN @portfolio IS NULL THEN 1 ELSE 0 END) or m.portfolio = @portfolio)
order by m.business_date asc
GO

