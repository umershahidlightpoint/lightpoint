CREATE TRIGGER [cash_dividend_update_trigger]
	ON [dbo].[cash_dividends]
	AFTER UPDATE
	AS
	BEGIN
	INSERT INTO [cash_dividends_audit_trail]
           ([cash_dividend_id]
           ,[created_by]
           ,[created_date]
           ,[last_updated_by]
           ,[last_updated_date]
           ,[symbol]
           ,[notice_date]
           ,[execution_date]
           ,[record_date]
           ,[pay_date]
           ,[rate]
           ,[currency]
           ,[withholding_rate]
           ,[fx_rate]
           ,[active_flag])
		select * from deleted
	END
