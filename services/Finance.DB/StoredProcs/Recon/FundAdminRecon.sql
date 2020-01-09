/*
Compare FundAdmin Numbers to PA Numbers
*/
CREATE PROCEDURE [dbo].[FundAdminRecon]
	@businessDate Date
AS
	declare @busdate as date
	set @busdate = @businessDate

/*
Grab Data from PA first
*/

	DECLARE @PnlData TABLE (
		BusDate DATE,
		SecurityCode VARCHAR(50),
		SecurityType VARCHAR(50),
		Currency VARCHAR(10),
		DayPnl numeric(22,9), 
		MTDPnl numeric(22,9), 
		QTDPnl numeric(22,9), 
		YTDPnl numeric(22,9), 
		ITDPnl numeric(22,9)
	)

	INSERT INTO @PnlData(
		BusDate,
		SecurityCode,
		SecurityType,
		Currency,
		DayPnl, 
		MTDPnl, 
		QTDPnl, 
		YTDPnl, 
		ITDPnl
	)
	Exec PeriodPnl @Busdate

	select * from @PnlData

RETURN 0
