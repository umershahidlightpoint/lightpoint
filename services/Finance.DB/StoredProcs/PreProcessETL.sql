/*
Run after the Start up process, all changes are made to the current_trade_view, this will vary by client
*/
CREATE PROCEDURE [dbo].[PreProcessETL]
AS

	update current_trade_state set SecurityType = 'Open-End Fund' where Symbol = 'MSUXX'
	update current_trade_state set Symbol = 'TWE AU SWAP', SecurityId = 32669 where Symbol = 'TWE AU EQUITY SWAP'

	DECLARE @Symbol Varchar(20)
	Declare @SecurityId int

	select top 1 @symbol = Symbol, @SecurityId = SecurityID from current_trade_state where Symbol = 'DUE GY'
	update current_trade_state set Symbol = @Symbol, SecurityId = @SecurityId where Symbol = 'DUE GR'

	update current_trade_state set SecurityType = 'Common Stock' where SecurityType = 'REIT'
RETURN 0
