/*
Run after the Start up process, all changes are made to the current_trade_view, this will vary by client

exec PreProcessETL

*/
CREATE PROCEDURE [dbo].[PreProcessETL]
AS
-- Update's to the SecurityTyoe
	update current_trade_state set SecurityType = 'Open-End Fund' where Symbol = 'MSUXX'
	update current_trade_state set SecurityType = 'Common Stock' where SecurityType = 'REIT'

	DECLARE @Symbol Varchar(20)
	Declare @SecurityId int

	-- Corporate Action, rename symbol
	-- Quick and dirty for the moment un work out a better strategy

	select top 1 @symbol = Symbol, @SecurityId = SecurityID from current_trade_state where Symbol = 'TWE AU SWAP'
	update current_trade_state set Symbol = @Symbol, SecurityId = @SecurityId where Symbol = 'TWE AU EQUITY SWAP'
	update market_prices set Symbol = @Symbol where Symbol = 'TWE AU EQUITY SWAP'

	select top 1 @symbol = Symbol, @SecurityId = SecurityID from current_trade_state where Symbol = 'DUE GY'
	update current_trade_state set Symbol = @Symbol, SecurityId = @SecurityId where Symbol = 'DUE GR'
	update market_prices set Symbol = @Symbol where Symbol = 'DUE GR'

	select top 1 @symbol = Symbol, @SecurityId = SecurityID from current_trade_state where Symbol = 'BYD CN'
	update current_trade_state set Symbol = @Symbol, SecurityId = @SecurityId where Symbol = 'BYD-U CN'
	update market_prices set Symbol = @Symbol where Symbol = 'BYD-U CN'

RETURN 0