CREATE TABLE [dbo].[file_exception](
	[file_exception_id] [int] IDENTITY(1,1) NOT NULL,
	[business_date] [datetime] NOT NULL,
	[reference] [nvarchar](max) NOT NULL,
	[record] [nvarchar](max) NOT NULL,
	[file_id] [int] NULL,
 CONSTRAINT [PK_File_Exception] PRIMARY KEY CLUSTERED 
(
	[file_exception_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

ALTER TABLE [dbo].[file_exception]  WITH NOCHECK ADD FOREIGN KEY([file_id])
REFERENCES [dbo].[file] ([id])
GO

