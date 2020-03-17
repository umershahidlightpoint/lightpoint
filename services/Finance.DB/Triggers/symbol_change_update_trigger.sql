CREATE TRIGGER [symbol_change_update_trigger]
	ON [dbo].[symbol_change]
	FOR DELETE, INSERT, UPDATE
	AS
	BEGIN
		SET NOCOUNT ON
	END
