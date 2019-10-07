CREATE TABLE [dbo].[file_exception](
	[file_exception_id] [int] IDENTITY(1,1) NOT NULL,
	[file_name] [varchar](100) NULL,
	[business_date] [datetime] NOT NULL,
	[reference] [nvarchar](max) NOT NULL,
	[record] [nvarchar](max) NOT NULL,
 CONSTRAINT [PK_File_Exception] PRIMARY KEY CLUSTERED 
(
	[file_exception_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO

alter table file_exception drop column [file_name]

alter table file_exception
add [file_id] int null

alter table file_exception
add FOREIGN KEY([file_id]) references [file](id)