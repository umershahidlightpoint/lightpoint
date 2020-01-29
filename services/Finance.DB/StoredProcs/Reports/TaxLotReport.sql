CREATE PROCEDURE [dbo].[TaxLotReport]
	@Now Date = null,
	@From Date = null,
	@symbol varchar(100) = null
AS

RAISERROR ('Started', 0, 1) WITH NOWAIT

select tls.*, '', cts.TradeDate, '', coalesce(realized.balance, 0) as realized, coalesce(un_realized.balance, 0) as unrealized
from tax_lot_status tls
inner join current_trade_state cts on cts.LPOrderId = tls.open_id
left outer join (
select source, round(sum(debit-credit),2) as balance from current_journal_full
where AccountCategory in ( 'Revenues' ) and event like 'realized%'
group by source
) realized on realized.source = tls.open_id
left outer join (
select source, round(sum(debit-credit),2) as balance from current_journal_full
where AccountCategory in ( 'Revenues' ) and event like '%unrealized%'
group by source
) un_realized on un_realized.source = tls.open_id
order by Symbol, TradeDate asc

RAISERROR ('Finish', 0, 1) WITH NOWAIT

Return 0
