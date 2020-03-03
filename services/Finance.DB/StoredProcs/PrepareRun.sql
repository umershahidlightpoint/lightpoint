/*
exec PrepareRun '2019-04-01', '2019-04-01', 'Day'

declare @start Date
declare @end Date
select @start = min([when]), @end = max([when]) from journal with(nowait)
print @start
print @end

exec PrepareRun @start, @end, 'ITD'
*/
CREATE PROCEDURE [dbo].[PrepareRun]
	@startDate Date,
	@endDate Date,
	@period Varchar(20)
AS
DECLARE @Deleted_Rows INT;
DECLARE @Message Varchar(100);
DECLARE @Total INT;
DECLARE @Progress INT;
DECLARE @Batch int;
DECLARE @Percentage numeric(22,9)

set @Batch = 100000;

SELECT @Total = count(*) from journal with(nowait)
where 
[when] between @startDate and @endDate
    and event not in ('manual')

SET @Progress = 0;

RAISERROR ('Clearing down journals', 0, 1) WITH NOWAIT

SET @Deleted_Rows = 1;
WHILE (@Deleted_Rows > 0 and @Total > 0)
BEGIN

    delete top (@Batch) from journal 
    where [when] between @startDate and @endDate
    and event not in ('manual')

    SET @Deleted_Rows = @@ROWCOUNT;
    SET @Progress = @Progress + @Batch

	Set @percentage = @Progress / @Total
	
    set @Message = 'Removed ' + Convert(varchar(25), @Percentage) + ' of ' + Convert(varchar(25), @Total);

    RAISERROR (@Message, 0, 1) WITH NOWAIT

END

if @period = 'ITD'
begin
	RAISERROR ('Clearing down journal_log', 0, 1) WITH NOWAIT
	delete from journal_log
	RAISERROR ('Clearing down tax_lot', 0, 1) WITH NOWAIT
	delete from tax_lot
	RAISERROR ('Clearing down tax_lot_status', 0, 1) WITH NOWAIT
	delete from tax_lot_status
	RAISERROR ('Clearing down cost_basis', 0, 1) WITH NOWAIT
	delete from cost_basis
	RAISERROR ('Clearing down pnl_summary', 0, 1) WITH NOWAIT
	delete from pnl_summary
end

RETURN 0
