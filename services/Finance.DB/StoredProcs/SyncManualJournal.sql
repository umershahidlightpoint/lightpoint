CREATE PROCEDURE [dbo].[SyncManualJournal]
	@journalId int
AS
	INSERT INTO [dbo].[current_journal]
	SELECT * FROM [dbo].[vwJournal] WHERE [vwJournal].[id] = @journalId;
RETURN 0
