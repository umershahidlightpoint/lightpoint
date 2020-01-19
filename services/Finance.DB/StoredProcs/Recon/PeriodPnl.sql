/*
exec PeriodPnl '2019-12-31'

exec PnlToDate '2019-12-31', '2019-01-01'
*/
CREATE PROCEDURE [dbo].[PeriodPnl]
	@Now Date
AS

declare @MTD Date
declare @QTD Date
declare @YTD Date
declare @ITD Date

Set @MTD = DATEFROMPARTS(YEAR(@Now),MONTH(@Now),1)
Set @QTD = DATEADD(qq, DATEDIFF(qq, 0, @Now), 0)
Set @YTD = DATEFROMPARTS(YEAR(@Now),1,1)
select @ITD = MIN([when]) from journal with(nolock)

print '==> Dates'
print @Now
print @MTD
print @QTD
print @YTD
print @ITD
print '==> Dates'

DECLARE @PnlData TABLE (
	BusDate DATE,
	SecurityCode VARCHAR(50),
	SecurityId int,
	Fund VARCHAR(50),
	SecurityType VARCHAR(50),
	Currency VARCHAR(10),
	Quantity numeric(22,9),
	realizedPnl numeric(22,9), 
	unrealizedPnl numeric(22,9), 
	Pnl numeric(22,9)
)

INSERT INTO @PnlData(
	BusDate,
	SecurityCode,
	SecurityId,
	Fund,
	SecurityType,
	Currency,
	Quantity, 
	realizedPnl, 
	unrealizedPnl, 
	Pnl
)
Exec PnlToDate @Now, @Now
select * 
into #daypnl
from @PnlData
delete from @PnlData

INSERT INTO @PnlData(
	BusDate,
	SecurityCode,
	SecurityId,
	Fund,
	SecurityType,
	Currency,
	Quantity, 
	realizedPnl, 
	unrealizedPnl, 
	Pnl
)
Exec PnlToDate @Now, @MTD
select * 
into #mtdpnl
from @PnlData
delete from @PnlData

INSERT INTO @PnlData(
	BusDate,
	SecurityCode,
	SecurityId,
	Fund,
	SecurityType,
	Currency,
	Quantity, 
	realizedPnl, 
	unrealizedPnl, 
	Pnl
)
Exec PnlToDate @Now, @QTD
select * 
into #qtdpnl
from @PnlData
delete from @PnlData

INSERT INTO @PnlData(
	BusDate,
	SecurityCode,
	SecurityId,
	Fund,
	SecurityType,
	Currency,
	Quantity, 
	realizedPnl, 
	unrealizedPnl, 
	Pnl
)
Exec PnlToDate @Now, @YTD
select * 
into #ytdpnl
from @PnlData
delete from @PnlData

INSERT INTO @PnlData(
	BusDate,
	SecurityCode,
	SecurityId,
	Fund,
	SecurityType,
	Currency,
	Quantity, 
	realizedPnl, 
	unrealizedPnl, 
	Pnl
)
Exec PnlToDate @Now, @ITD
select * 
into #itdpnl
from @PnlData
delete from @PnlData

delete from pnl_summary where BusDate = @Now

insert into pnl_summary (BusDate, SecurityCode, SecurityId, SecurityType, Quantity, currency, DayPnl, MtdPnl, QtdPnl, YtdPnl, ItdPnl)
select day.BusDate, day.SecurityCode, day.SecurityId, day.SecurityType, day.Quantity, day.currency, day.Pnl as DayPnl, mtd.Pnl as MTDPnl, qtd.Pnl as QTDPnl, ytd.Pnl as YTDPnl, itd.Pnl as ITDPnl 
from #daypnl day
inner join #mtdpnl mtd on mtd.SecurityCode = day.SecurityCode and mtd.Fund = day.Fund and mtd.SecurityType = day.SecurityType and mtd.currency = day.currency
inner join #qtdpnl qtd on qtd.SecurityCode = day.SecurityCode and qtd.Fund = day.Fund and qtd.SecurityType = day.SecurityType and qtd.currency = day.currency
inner join #ytdpnl ytd on ytd.SecurityCode = day.SecurityCode and ytd.Fund = day.Fund and ytd.SecurityType = day.SecurityType and ytd.currency = day.currency
inner join #itdpnl itd on itd.SecurityCode = day.SecurityCode and itd.Fund = day.Fund and itd.SecurityType = day.SecurityType and itd.currency = day.currency

RETURN 0
