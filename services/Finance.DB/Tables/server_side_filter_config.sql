CREATE TABLE [dbo].[server_side_filter_config]
(
	[id] INT identity(1,1) NOT NULL PRIMARY KEY,
	[created_by] VARCHAR(100) NOT NULL, 
    [created_date] DATETIME NOT NULL,
    [last_updated_by] VARCHAR(100) NULL, 
    [last_updated_date] DATETIME NULL,
	[col_name] VARCHAR(100) NOT NULL,
	[source] VARCHAR(100) NOT NULL,
	[meta_info] VARCHAR(100) NOT NULL DEFAULT '',
	[grid_name] VARCHAR(100) NOT NULL DEFAULT ''
)
