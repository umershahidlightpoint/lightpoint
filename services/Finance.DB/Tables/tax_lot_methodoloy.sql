CREATE TABLE [dbo].[tax_lot_methodology](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[code] [varchar](20) NOT NULL,
	[description] [varchar](MAX) NOT NULL,
	[generated_on] [datetime] NOT NULL,
 CONSTRAINT [PK_tax_lot_methodology] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[tax_lot_methodology] ADD  CONSTRAINT [DF_tax_lot_methodology_code]  DEFAULT ('UNKNOWN') FOR [code]
GO

ALTER TABLE [dbo].[tax_lot_methodology] ADD  CONSTRAINT [DF_tax_lot_methodology_generated_on]  DEFAULT (getdate()) FOR [generated_on]
GO