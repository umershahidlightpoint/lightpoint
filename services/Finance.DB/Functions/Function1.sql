/*
select * from fnPositions('2019-12-20')
*/

CREATE FUNCTION [dbo].[fnPositions]
(
	@bDate Date
)
RETURNS @returntable TABLE
(
	business_date DATE,
	symbol varchar(100),
	side varchar(100),
	quantity numeric(22,9),
	investment_at_cost numeric(22,9)
)
AS
BEGIN

WITH taxlotstatus (business_date, open_id, symbol, side, quantity, investment_at_cost)
AS
(
select @bDate as business_date, open_id, symbol, side, SUM(original_quantity) as quantity, Sum(investment_at_cost) as investment_at_cost
from tax_lot_status where trade_date <= @bDate
group by open_id, symbol, side
)
,
taxlot (business_date, open_lot_id, quantity, investment_at_cost)
AS
(
select @bDate as business_date, open_lot_id, sum(quantity) as quantity, sum(investment_at_cost) as investment_at_cost
from tax_lot 
where trade_date <= @bDate
group by open_lot_id
)


	INSERT @returntable
		select tls.business_date, symbol, side, SUM(coalesce(tls.quantity,0) + coalesce(tl.quantity,0)) as quantity, SUM(coalesce(tls.investment_at_cost,0) + coalesce(tl.Investment_at_cost,0)) as investment_at_cost 
		from taxlotstatus tls
		left outer join taxlot tl on tl.open_lot_id = tls.open_id
		group by tls.business_date, symbol, side
		order by symbol
	RETURN
END
