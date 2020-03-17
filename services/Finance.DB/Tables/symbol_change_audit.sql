CREATE TABLE [dbo].[symbol_change_audit]
(
	[id] INT IDENTITY(1,1) NOT NULL PRIMARY KEY,
	[symbol_change_id] INT NOT NULL,
	[created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL, 
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL,
	[old_symbol] VARCHAR(100) NOT NULL,
	[new_symbol] VARCHAR(100) NOT NULL,
	[notice_date] DATETIME NOT NULL,
	[execution_date] DATETIME NOT NULL, 
	[active_flag] BIT NOT NULL,
    CONSTRAINT [FK_symbol_change_audit_Tosymbol_change] FOREIGN KEY ([symbol_change_id]) REFERENCES [symbol_change]([id])
)
