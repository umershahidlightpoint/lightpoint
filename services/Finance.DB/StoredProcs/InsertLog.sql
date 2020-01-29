CREATE procedure [dbo].[InsertLog]
(@RequestBatch varchar(max) NULL,
@MachineName varchar(max) NULL,
@RequestURL varchar(max) NULL,
@RequestType varchar(max) NULL,
@Payload varchar(max) NULL,
@Query varchar(max) NULL,
@Logged datetime,
@ElapsedTime int,
@Level varchar(max) NULL,
@Message varchar(max) NULL,
@Logger varchar(max) NULL,
@Exception varchar(max) NULL)
as

IF @RequestURL = '' SET @RequestURL = NULL
IF @RequestType = '' SET @RequestType = NULL
IF @Payload = '' SET @Payload = NULL
IF @Query = '' SET @Query = NULL
IF @Exception = '' SET @Exception = NULL

INSERT INTO [dbo].[Log]
             ([activity_id]
           ,[machine_name]
           ,[request_url]
           ,[request_type]
           ,[payload]
           ,[query]
           ,[logged]
           ,[elapsed_time]
           ,[level]
           ,[message]
           ,[logger]
           ,[exception])
     VALUES
           (@RequestBatch
           ,@MachineName
		   ,@RequestURL
		   ,@RequestType
		   ,@Payload
		   ,@Query
           ,@Logged
		   ,@ElapsedTime
           ,@Level
           ,@Message
           ,@Logger
           ,@Exception)
GO

