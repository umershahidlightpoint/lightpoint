CREATE VIEW [dbo].[vwNormalizedEodFxRates]
	AS SELECT 
Convert(DATE, fx.RunTime, 23) as Busdate,
c.CurrencyCode, 
c.BbergCode,
c.IsInverseQuoted,
CASE
	WHEN c.IsInverseQuoted = 0 and fx.fxRate != 0 then 1 / fx.FXRate
	WHEN c.IsInverseQuoted = 1 then fx.FXRate
	ELSE 1
End as CalculatedFxRate,
fx.FxRate, 
p.SourceName,
fx.RunTime
from [PriceMaster].[dbo].[FXRate] as fx
inner join [SecurityMaster].[dbo].[Currency] as c on c.CurrencyId = fx.CurrencyId
inner join [PriceMaster].[dbo].[PriceSource] as p on p.PriceSourceID = fx.PriceSourceID
inner join (select Convert(DATE, fx.RunTime, 23) as Busdate, Max(RunTime) RunTime from PriceMaster..FxRate as fx group by Convert(DATE, fx.RunTime, 23)) as d on d.Busdate = Convert(DATE, fx.RunTime, 23) and d.RunTime = fx.RunTime
