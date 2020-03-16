CREATE TRIGGER [market_data_price_update_trigger]
	ON [dbo].[market_prices]
	AFTER UPDATE
AS
BEGIN
INSERT INTO [dbo].[market_prices_history]
     ([market_price_id]
      ,[business_date]
	  ,[security_id]
	  ,[symbol]
      ,[event]
	  ,[price]
      ,[last_updated_by]
	  ,[last_updated_on])
	  select * from deleted
	  END