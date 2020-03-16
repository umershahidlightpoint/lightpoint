CREATE TRIGGER [fx_rate_update_trigger]
	ON [dbo].[fx_rates]
	AFTER UPDATE
	AS
	BEGIN
		INSERT INTO [dbo].[fx_rates_history]
      ([fx_rate_id]
      ,[business_date]
	  ,[currency]
      ,[event]
	  ,[price]
      ,[last_updated_by]
	  ,[last_updated_on])
	  select * from deleted
	END
