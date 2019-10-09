CREATE TABLE [dbo].[data_grid_layouts](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[grid_id] [int] NULL,
	[grid_name] [nvarchar](150) NOT NULL,
	[grid_layout_name] [nvarchar](150) NULL,
	[userId] [int] NOT NULL,
	[pivot_mode] [text] NULL,
	[column_state] [text] NULL,
	[group_state] [text] NULL,
	[sort_state] [text] NULL,
	[filter_state] [text] NULL,
	[external_filter_state] [text] NULL,
	[is_public] [bit] NULL,
 CONSTRAINT [PK_data_grid_state] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO