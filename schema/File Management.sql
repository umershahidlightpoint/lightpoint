--Script date: 9/3/2019
CREATE TABLE [dbo].[file](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[name] [varchar](100) NOT NULL,
	[path] [nvarchar](max) NULL,
	[source] [varchar](100) NOT NULL,
	[statistics] [int] NULL,
 CONSTRAINT [PK_File] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]


CREATE TABLE [dbo].[file_action](
	[file_action_id] [int] IDENTITY(1,1) NOT NULL,
	[file_id] [int] NOT NULL,
	[action] [varchar](100) NOT NULL,
	[action_start_date] datetime NOT NULL,
	[action_end_date] datetime NULL,
 CONSTRAINT [PK_File_Action] PRIMARY KEY CLUSTERED 
(
	[file_action_id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]



ALTER TABLE [dbo].[file_action]  WITH CHECK ADD  CONSTRAINT [FK_File_Action_File] FOREIGN KEY([file_id])
REFERENCES [dbo].[file] ([id])

INSERT INTO [file]([name],[path],[source],[statistics]) VALUES('Logs','Temporary Path','Light Point',200)
INSERT INTO [file]([name],[path],[source],[statistics]) VALUES('File1','Temporary Path','Light Point',300)
INSERT INTO [file]([name],[path],[source],[statistics]) VALUES('File2','Temporary Path','Light Point',5)
INSERT INTO [file]([name],[path],[source],[statistics]) VALUES('File3','Temporary Path','Silver',null)

INSERT INTO [file_action]([file_Id],[action],[action_start_date],[action_end_date])VALUES(1,'Uploading',getdate(),getdate())
INSERT INTO [file_action]([file_Id],[action],[action_start_date],[action_end_date])VALUES(1,'Processing',getdate(),getdate())
INSERT INTO [file_action]([file_Id],[action],[action_start_date],[action_end_date])VALUES(1,'Complete',getdate(),getdate())

INSERT INTO [file_action]([file_Id],[action],[action_start_date],[action_end_date])VALUES(2,'Uploading',getdate(),getdate())
INSERT INTO [file_action]([file_Id],[action],[action_start_date],[action_end_date])VALUES(2,'Processing',getdate(),null)

INSERT INTO [file_action]([file_Id],[action],[action_start_date],[action_end_date])VALUES(3,'Uploading',getdate(),null)
INSERT INTO [file_action]([file_Id],[action],[action_start_date],[action_end_date])VALUES(4,'Downloaded',getdate(),getdate())

