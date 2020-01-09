/*
exec PeriodPnl '2019-12-18'

-- TABLE VARIABLE so that the system can use the data as a table for recon

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
Exec PeriodPnl '2019-12-17'

select * from @PnlData

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
-- Set @ITD = DATEFROMPARTS(1970,1,1)

select @ITD = MIN([when]) from vwJournal

select business_date as BusDate, SecurityCode as SecurityCode, Fund, st.SecurityTypeCode as SecurityType, pos.currency, 0 as realizedPnl, 0 as unrealizedPnl, 0 as Pnl
into #daypnl
from fnPositions(@Now) pos
inner join SecurityMaster..Security s on s.SecurityId = pos.security_id
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId

update #daypnl
set realizedPnl = GG
from #daypnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('REALIZED GAIN/(LOSS)') and [event] in ('realizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] = t.BusDate and v.fund = t.fund and v.symbol = t.SecurityCode

update #daypnl
set unrealizedPnl = GG
from #daypnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)') and [event] in ('unrealizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] = t.BusDate and v.fund = t.fund and v.symbol = t.SecurityCode

update #daypnl
set Pnl = Round(unrealizedPnl + realizedPnl,2)
from #daypnl

-- select * from #daypnl

select business_date as BusDate, SecurityCode as SecurityCode, Fund, st.SecurityTypeCode as SecurityType, pos.currency, 0 as realizedPnl, 0 as unrealizedPnl, 0 as Pnl
into #mtdpnl
from fnPositions(@Now) pos
inner join SecurityMaster..Security s on s.SecurityId = pos.security_id
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId

update #mtdpnl
set realizedPnl = GG
from #mtdpnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('REALIZED GAIN/(LOSS)') and [event] in ('realizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] <= @Now and v.[when] > @MTD and v.fund = t.fund and v.symbol = t.SecurityCode

update #mtdpnl
set unrealizedPnl = GG
from #mtdpnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)') and [event] in ('unrealizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] <= @Now and v.[when] > @MTD and v.fund = t.fund and v.symbol = t.SecurityCode

update #mtdpnl
set Pnl = Round(unrealizedPnl + realizedPnl,2)
from #mtdpnl

-- select * from #mtdpnl

select business_date as BusDate, SecurityCode as SecurityCode, Fund, st.SecurityTypeCode as SecurityType, pos.currency, 0 as realizedPnl, 0 as unrealizedPnl, 0 as Pnl
into #qtdpnl
from fnPositions(@Now) pos
inner join SecurityMaster..Security s on s.SecurityId = pos.security_id
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId

update #qtdpnl
set realizedPnl = GG
from #qtdpnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('REALIZED GAIN/(LOSS)') and [event] in ('realizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] <= @Now and v.[when] > @QTD and v.fund = t.fund and v.symbol = t.SecurityCode

update #qtdpnl
set unrealizedPnl = GG
from #qtdpnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)') and [event] in ('unrealizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] <= @Now and v.[when] > @QTD and v.fund = t.fund and v.symbol = t.SecurityCode

update #qtdpnl
set Pnl = Round(unrealizedPnl + realizedPnl,2)
from #qtdpnl

-- select * from #qtdpnl

select business_date as BusDate, SecurityCode as SecurityCode, Fund, st.SecurityTypeCode as SecurityType, pos.currency, 0 as realizedPnl, 0 as unrealizedPnl, 0 as Pnl
into #ytdpnl
from fnPositions(@Now) pos
inner join SecurityMaster..Security s on s.SecurityId = pos.security_id
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId

update #ytdpnl
set realizedPnl = GG
from #ytdpnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('REALIZED GAIN/(LOSS)') and [event] in ('realizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] <= @Now and v.[when] > @YTD and v.fund = t.fund and v.symbol = t.SecurityCode

update #ytdpnl
set unrealizedPnl = GG
from #ytdpnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)') and [event] in ('unrealizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] <= @Now and v.[when] > @YTD and v.fund = t.fund and v.symbol = t.SecurityCode

update #ytdpnl
set Pnl = Round(unrealizedPnl + realizedPnl,2)
from #ytdpnl

-- select * from #ytdpnl

select business_date as BusDate, SecurityCode as SecurityCode, Fund, st.SecurityTypeCode as SecurityType, pos.currency, 0 as realizedPnl, 0 as unrealizedPnl, 0 as Pnl
into #itdpnl
from fnPositions(@Now) pos
inner join SecurityMaster..Security s on s.SecurityId = pos.security_id
inner join SecurityMaster..SecurityType st on st.SecurityTypeId = s.SecurityTypeId

update #itdpnl
set realizedPnl = GG
from #itdpnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('REALIZED GAIN/(LOSS)') and [event] in ('realizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] <= @Now and v.[when] > @ITD and v.fund = t.fund and v.symbol = t.SecurityCode

update #itdpnl
set unrealizedPnl = GG
from #itdpnl t
inner join (
select [When], Symbol, Fund, SUM(credit-debit) as GG from vwJournal
where AccountType in ('CHANGE IN UNREALIZED GAIN/(LOSS)') and [event] in ('unrealizedpnl')
group by [When], Symbol, Fund
) as v on v.[when] <= @Now and v.[when] > @ITD and v.fund = t.fund and v.symbol = t.SecurityCode

update #itdpnl
set Pnl = Round(unrealizedPnl + realizedPnl,2)
from #itdpnl

-- select * from #itdpnl

select day.BusDate, day.SecurityCode, day.SecurityType, day.currency, day.Pnl as DayPnl, mtd.Pnl as MTDPnl, qtd.Pnl as QTDPnl, ytd.Pnl as YTDPnl, itd.Pnl as ITDPnl 
from #daypnl day
inner join #mtdpnl mtd on mtd.SecurityCode = day.SecurityCode and mtd.Fund = day.Fund and mtd.SecurityType = day.SecurityType and mtd.currency = day.currency
inner join #qtdpnl qtd on qtd.SecurityCode = day.SecurityCode and qtd.Fund = day.Fund and qtd.SecurityType = day.SecurityType and qtd.currency = day.currency
inner join #ytdpnl ytd on ytd.SecurityCode = day.SecurityCode and ytd.Fund = day.Fund and ytd.SecurityType = day.SecurityType and ytd.currency = day.currency
inner join #itdpnl itd on itd.SecurityCode = day.SecurityCode and itd.Fund = day.Fund and itd.SecurityType = day.SecurityType and itd.currency = day.currency

RETURN 0
