--Script date: 9/3/2019
CREATE TABLE [dbo].[File](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Name] [varchar](100) NOT NULL,
	[Path] [nvarchar](max) NULL,
 CONSTRAINT [PK_File] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]


CREATE TABLE [dbo].[File_Action](
	[File_Action_Id] [int] IDENTITY(1,1) NOT NULL,
	[File_Id] [int] NOT NULL,
	[Action] [varchar](100) NOT NULL,
	[Action_Start_Date] datetime NOT NULL,
	[Action_End_Date] datetime NULL,
 CONSTRAINT [PK_File_Action] PRIMARY KEY CLUSTERED 
(
	[File_Action_Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]



ALTER TABLE [dbo].[File_Action]  WITH CHECK ADD  CONSTRAINT [FK_File_Action_File] FOREIGN KEY([File_Id])
REFERENCES [dbo].[File] ([Id])

INSERT INTO [File]([Name],[Path]) VALUES('Logs','Temporary Path')
INSERT INTO [File]([Name],[Path]) VALUES('File1','Temporary Path')
INSERT INTO [File]([Name],[Path]) VALUES('File2','Temporary Path')

INSERT INTO [File_Action]([File_Id],[Action],[Action_Start_Date],[Action_End_Date])VALUES(1,'Uploading',getdate(),getdate())
INSERT INTO [File_Action]([File_Id],[Action],[Action_Start_Date],[Action_End_Date])VALUES(1,'Processing',getdate(),getdate())
INSERT INTO [File_Action]([File_Id],[Action],[Action_Start_Date],[Action_End_Date])VALUES(1,'Complete',getdate(),getdate())

INSERT INTO [File_Action]([File_Id],[Action],[Action_Start_Date],[Action_End_Date])VALUES(2,'Uploading',getdate(),getdate())
INSERT INTO [File_Action]([File_Id],[Action],[Action_Start_Date],[Action_End_Date])VALUES(2,'Processing',getdate(),null)

INSERT INTO [File_Action]([File_Id],[Action],[Action_Start_Date],[Action_End_Date])VALUES(3,'Uploading',getdate(),null)
