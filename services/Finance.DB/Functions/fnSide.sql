/*
select dbo.fnSide('BUY') as side
*/
CREATE FUNCTION fnSide(
    @side varchar(20)
)
RETURNS varchar(20)
AS 
BEGIN
	
declare @result varchar(20)
select @result = 
	case 
		when @side = 'BUY' then 'LONG' 
		else 'SHORT'
	end
    RETURN @result
END;
