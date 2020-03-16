CREATE TRIGGER [stock_split_insert_trigger]
	ON [stock_splits]
	AFTER INSERT
	AS
	BEGIN
	INSERT INTO [stock_splits_audit_trail]
           ([stock_split_id]
           ,[created_by]
           ,[created_date]
           ,[last_updated_by]
           ,[last_updated_date]
           ,[symbol]
           ,[notice_date]
           ,[execution_date]
           ,[top_ratio]
           ,[bottom_ratio]
           ,[adjustment_factor]
           ,[active_flag])
	select * from inserted
	END
