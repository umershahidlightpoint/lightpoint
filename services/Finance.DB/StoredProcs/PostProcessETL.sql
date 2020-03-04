/*
Run after the Start up process, all changes are made to the current_trade_view, this will vary by client
*/
CREATE PROCEDURE [dbo].[PostProcessETL]
AS

update current_journal_full set TradeCurrency = fx_currency, SettleCurrency = fx_currency where event = 'settled-cash-fx'

update current_journal_full set security_id = s.SecurityId from current_journal_full
inner join SecurityMaster..Security s on s.SecurityCode = symbol
where security_id = -1

RETURN 0
