CREATE TABLE [dbo].[tax_lot_manual_link]
(
	[id] [int] IDENTITY(1,1) NOT NULL,
	[closing_lot_id] [varchar](127) NOT NULL,
	[open_lot_id] [varchar](127) NOT NULL,
	comment varchar(500) not null,
	generated_by varchar(50) not null,
	generated_on DateTime not null,
    CONSTRAINT [PK_tax_lot_manual_link] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]

GO 

ALTER TABLE [dbo].[tax_lot_manual_link] ADD  CONSTRAINT [DF_tax_lot_Link_manual_generated_on]  DEFAULT (getdate()) FOR [generated_on]
GO

ALTER TABLE [dbo].[tax_lot_manual_link] ADD  CONSTRAINT [DF_tax_lot_Link_generated_by]  DEFAULT 'system' FOR [generated_by]
GO

ALTER TABLE [dbo].[tax_lot_manual_link] ADD  CONSTRAINT [DF_tax_lot_Link_comment]  DEFAULT '' FOR [comment]
GO

