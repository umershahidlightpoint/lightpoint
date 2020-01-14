/*
Sarissa Examples

exec PopulateMarketPrices '2013-05-01', '2013-05-31', 32731, 'VVUS', 14.7
exec PopulateMarketPrices '2013-05-01', '2013-05-31', 32746, 'AMRN', 6.99
exec PopulateMarketPrices '2013-05-01', '2013-05-31', 32732, 'DYAX', 3.14
exec PopulateMarketPrices '2013-05-01', '2013-05-31', 32734, 'AVEO', 2.56
exec PopulateMarketPrices '2013-05-01', '2013-05-31', 32736, 'MNTA', 13.16
exec PopulateMarketPrices '2013-05-01', '2013-05-31', 32737, 'FRX', 39.75
exec PopulateMarketPrices '2013-05-01', '2013-05-31', 32738, 'DGX', 61.84
exec PopulateMarketPrices '2013-05-01', '2013-05-31', 32739, '9127956W6 GOVT', 99.998833

*/

create Procedure PopulateMarketPrices
	@from Date,
	@to Date,
	@securityId int,
	@symbol varchar(100),
	@price numeric(22,9)
as
	Declare @busDate Date

	set @BusDate = @from
	while ( @BusDate <= @to )
	begin
		-- print 'Processing Date' + @BusDate
		insert into market_prices(business_date, security_id, symbol, event, price, last_updated_by, last_updated_on)
		values (@BusDate, @securityId, @symbol, 'manual', @price, 'manual', GetDate())
		Set @BusDate = CAST(DATEADD(day,1, @busDAte) as Date)
	end
Return
