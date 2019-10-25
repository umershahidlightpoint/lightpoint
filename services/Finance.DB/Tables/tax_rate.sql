CREATE TABLE [dbo].[tax_rate]
(
	[Id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY, 
    [effective_from] DATETIME NOT NULL, 
    [effective_to] DATETIME NOT NULL, 
    [long_term_tax_rate] DECIMAL(16, 9) NOT NULL, 
    [short_term_tax_rate] DECIMAL(16, 9) NOT NULL, 
    [short_term_period] INT NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_date] DATETIME NOT NULL, 
    [created_by] NVARCHAR(100) NULL, 
    [last_updated_by] NCHAR(100) NULL
)
