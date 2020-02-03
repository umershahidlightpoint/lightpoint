CREATE PROCEDURE [dbo].[DeleteJournals]
	@start Date,
	@end Date
AS

DECLARE @Deleted_Rows INT;
SET @Deleted_Rows = 1;
WHILE (@Deleted_Rows > 0)
  BEGIN

delete top (10000) from journal 
where [when] between @start and @end
SET @Deleted_Rows = @@ROWCOUNT;
    
END

RETURN 0
