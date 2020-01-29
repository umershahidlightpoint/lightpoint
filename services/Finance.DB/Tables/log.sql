CREATE TABLE [dbo].[log](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[activity_id] [varchar](300) NULL,
	[machine_name] [nvarchar](200) NULL,
	[request_url] [varchar](max) NULL,
	[request_type] [varchar](10) NULL,
	[payload] [varchar](max) NULL,
	[query] [varchar](max) NULL,
	[logged] [datetime] NULL,
	[elapsed_time] [int] NULL,
	[level] [varchar](5) NULL,
	[message] [nvarchar](max) NULL,
	[logger] [nvarchar](300) NULL,
	[exception] [nvarchar](max) NULL,
 CONSTRAINT [PK_dbo.Log] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

