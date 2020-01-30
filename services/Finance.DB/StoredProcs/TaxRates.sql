/*
For a buisness date determing the tax rates that are applicable for that date, there should be 1 and only 1 row returned,
if zero or 2+ rows are returned we have an issue.
*/
CREATE PROCEDURE [dbo].[TaxRates]
	@businessDate Date
AS

select short_term_tax_rate, long_term_tax_rate, short_term_period 
from tax_rate 
where effective_from <= @businessDate and @businessDate <= effective_to

RETURN 0