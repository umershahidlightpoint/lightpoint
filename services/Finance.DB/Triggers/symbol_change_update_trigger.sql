CREATE TRIGGER [symbol_change_update_trigger]
	ON [dbo].[symbol_change]
	AFTER UPDATE
	AS
	BEGIN
		INSERT INTO [dbo].[symbol_change_audit]
           ([symbol_change_id]
           ,[created_by]
           ,[created_date]
           ,[last_updated_by]
           ,[last_updated_date]
           ,[old_symbol]
           ,[new_symbol]
           ,[notice_date]
           ,[execution_date]
           ,[active_flag])
select * from deleted
	END
