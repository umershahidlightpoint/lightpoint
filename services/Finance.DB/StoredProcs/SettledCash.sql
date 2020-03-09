/*
exec SettledCash '2020-12-31'
*/
create procedure SettledCash
	@busDate as Datetime
As
select Symbol, fx_currency, source, fund, sum(local_credit - local_debit) as balance, security_id from vwJournal
                    where AccountType = 'Settled Cash' and event in ('settlement', 'dividend')
                    and [when] < @busDate
					and fx_currency not in ('USD')
                    group by Symbol, fx_currency, source, fund, security_id
go