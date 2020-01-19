CREATE TABLE [dbo].[pnl_summary]
(
	BusDate Date,
	SecurityCode varchar(100),
	SecurityId int,
	SecurityType varchar(100),
	Quantity numeric(22,9),
	currency varchar(10),
	DayPnl numeric(22,9),
	MtdPnl numeric(22,9),
	QtdPnl numeric(22,9),
	YtdPnl numeric(22,9),
	ItdPnl numeric(22,9)
)
