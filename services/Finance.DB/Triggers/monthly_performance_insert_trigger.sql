CREATE TRIGGER [monthly_performance_insert_trigger]
ON [dbo].[monthly_performance]
AFTER INSERT
AS
BEGIN
INSERT INTO [dbo].[monthly_performance_history]
      ([performance_id]
           ,[created_date]
           ,[last_updated_date]
           ,[created_by]
		   ,[last_updated_by]
           ,[performance_date]
           ,[fund]
           ,[portfolio]
		   ,[start_month_estimate_nav]
           ,[monthly_end_nav]
           ,[performance]
           ,[mtd]
           ,[ytd_net_performance]
           ,[qtd_net_perc]
           ,[ytd_net_perc]
           ,[itd_net_perc]
           ,[estimated])
	  select * from inserted
	  END

