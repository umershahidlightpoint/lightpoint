/*
This table takes derived data and stores it, data is based on the entries in the current_journal_full table
*/
CREATE TABLE [dbo].[pnl_summary]
(
	BusDate Date,
	Fund varchar(100),
	SecurityCode varchar(100),
	SecurityId int,
	SecurityType varchar(100),
	Quantity numeric(22,9),
	currency varchar(10),
	DayPnl numeric(22,9),
	WtdPnl numeric(22,9) DEFAULT 0,
	MtdPnl numeric(22,9),
	QtdPnl numeric(22,9),
	YtdPnl numeric(22,9),
	ItdPnl numeric(22,9),
	NAV numeric(22,9) DEFAULT 0
)
