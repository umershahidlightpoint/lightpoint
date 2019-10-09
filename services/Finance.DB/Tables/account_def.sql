﻿CREATE TABLE [dbo].[account_def](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[account_category_id] [int] NOT NULL,
	[description] [varchar](255) NULL,
 CONSTRAINT [PK_account_def] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
