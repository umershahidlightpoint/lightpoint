CREATE PROCEDURE [dbo].[PeriodJournals]
	@Now Date,
	@Symbol varchar(100),
	@Period varchar(10)
AS

declare @From Date

IF @Period = 'day'
	BEGIN
		SET @From = @Now;
	END
ELSE IF @Period = 'mtd'
	BEGIN
		SET @From = DATEFROMPARTS(YEAR(@Now),MONTH(@Now),1)
	END
ELSE IF @Period = 'qtd'
	BEGIN
		SET @From = DATEADD(qq, DATEDIFF(qq, 0, @Now), 0)
	END
ELSE IF @Period = 'ytd'
	BEGIN
		SET @From = DATEFROMPARTS(YEAR(@Now),1,1)
	END

select *, abs(debit) - abs(credit) as balance from vwFullJournal
where [when] >= @From and [when] <= @Now
and [symbol] = @Symbol

RETURN 0
