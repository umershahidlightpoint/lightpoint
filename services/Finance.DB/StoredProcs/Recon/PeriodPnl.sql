/*
exec PeriodPnl '2019-12-31', 1

select sum(nav) from pnl_summary where busDate = '2019-12-31'
select * from pnl_summary where busDate = '2019-12-31'
order by SecurityCode

exec PnlToDate '2019-12-31', '2019-01-01'

*/
CREATE   PROCEDURE [dbo].[PeriodPnl]
	@Now Date,
	@Full bit = 0
AS

-- If the enties in the database already exist then skip the population
if ( exists (select top 1 * from pnl_summary where BusDate = @Now) and @Full = 0)
begin
	return 0
end

declare @WTD Date
declare @MTD Date
declare @QTD Date
declare @YTD Date
declare @ITD Date

Set @WTD = DATEADD(dd, -(DATEPART(WEEKDAY, @Now)-1),  DATEADD(dd, DATEDIFF(dd, 0, @Now), 0))
Set @MTD = DATEFROMPARTS(YEAR(@Now),MONTH(@Now),1)
Set @QTD = DATEADD(qq, DATEDIFF(qq, 0, @Now), 0)
Set @YTD = DATEFROMPARTS(YEAR(@Now),1,1)
select @ITD = MIN([when]) from journal with(nolock)

print '==> Dates'
print @Now
print @WTD
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
	Pnl numeric(22,9),
	Nav numeric(22,9)
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
	Pnl,
	Nav
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
	Pnl,
	Nav
)
Exec PnlToDate @Now, @WTD
select * 
into #wtdpnl
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
	Pnl,
	Nav
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
	Pnl,
	Nav
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
	Pnl,
	Nav
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
	Pnl,
	Nav
)
Exec PnlToDate @Now, @ITD
select * 
into #itdpnl
from @PnlData
delete from @PnlData

select distinct v.BusDate, v.Fund, v.SecurityCode, v.SecurityId, v.SecurityType , v.currency
into #distinctSet
from (
select BusDate, Fund, SecurityCode, SecurityId, SecurityType, currency from #daypnl
union 
select BusDate, Fund, SecurityCode, SecurityId, SecurityType , currency from #wtdpnl
union 
select BusDate, Fund, SecurityCode, SecurityId, SecurityType , currency from #mtdpnl
union 
select BusDate, Fund, SecurityCode, SecurityId, SecurityType, currency from #qtdpnl
union 
select BusDate, Fund, SecurityCode, SecurityId, SecurityType , currency from #itdpnl
) v

delete from pnl_summary where BusDate = @Now

insert into pnl_summary (BusDate, Fund, SecurityCode, SecurityId, SecurityType, currency, Quantity, DayPnl, WtdPnl, MtdPnl, QtdPnl, YtdPnl, ItdPnl, Nav)
select distinctSet.BusDate, distinctSet.Fund, distinctSet.SecurityCode, distinctSet.SecurityId, distinctSet.SecurityType, distinctSet.currency, 
itd.Quantity, day.Pnl as DayPnl, wtd.Pnl as WtdPnl, mtd.Pnl as MTDPnl, qtd.Pnl as QTDPnl, ytd.Pnl as YTDPnl, itd.Pnl as ITDPnl, itd.Nav 
from #distinctSet distinctSet
left outer join #daypnl day on day.SecurityId = distinctSet.SecurityId and day.Fund = distinctSet.Fund and day.SecurityType = distinctSet.SecurityType and day.currency = distinctSet.currency
left outer join #wtdpnl wtd on wtd.SecurityId = distinctSet.SecurityId and wtd.Fund = distinctSet.Fund and Wtd.SecurityType = distinctSet.SecurityType and wtd.currency = distinctSet.currency
left outer join #mtdpnl mtd on mtd.SecurityId = distinctSet.SecurityId and mtd.Fund = distinctSet.Fund and mtd.SecurityType = distinctSet.SecurityType and mtd.currency = distinctSet.currency
left outer join #qtdpnl qtd on qtd.SecurityId = distinctSet.SecurityId and qtd.Fund = distinctSet.Fund and qtd.SecurityType = distinctSet.SecurityType and qtd.currency = distinctSet.currency
left outer join #ytdpnl ytd on ytd.SecurityId = distinctSet.SecurityId and ytd.Fund = distinctSet.Fund and ytd.SecurityType = distinctSet.SecurityType and ytd.currency = distinctSet.currency
left outer join #itdpnl itd on itd.SecurityId = distinctSet.SecurityId and itd.Fund = distinctSet.Fund and itd.SecurityType = distinctSet.SecurityType and itd.currency = distinctSet.currency


RETURN 0
GO


