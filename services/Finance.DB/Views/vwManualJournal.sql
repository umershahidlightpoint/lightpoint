CREATE   VIEW [dbo].[vwManualJournal]
	AS 
select *
from journal with(nolock) 
where event = 'manual'
GO
