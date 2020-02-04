CREATE TABLE [dbo].[report_recepient]
(
	[id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[task] varchar(100) NULL,
	[report] varchar(100) NULL,
	[email_id] varchar(100) NOT NULL
)
