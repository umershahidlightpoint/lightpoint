CREATE TRIGGER [fx_rate_insert_trigger]
	ON [dbo].[fx_rates]
	AFTER INSERT
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
	  select * from inserted
	END
