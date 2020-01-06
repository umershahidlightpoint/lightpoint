CREATE TABLE [dbo].[trade_exclusion](
	[lporderid] [varchar](50) NOT NULL,
	[reason] [varchar](50) NULL,
	[exclude] [char](1) NOT NULL
) ON [PRIMARY]
GO

ALTER TABLE [dbo].[trade_exclusion] ADD  CONSTRAINT [DF_trade_exclusion_exclude]  DEFAULT ('Y') FOR [exclude]
GO
