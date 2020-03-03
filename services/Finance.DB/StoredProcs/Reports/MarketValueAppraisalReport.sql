CREATE PROCEDURE [dbo].[MarketValueAppraisalReport]
	@date datetime
AS
	select s.EzeTicker, s.Sedol, s.Cusip, s.ISIN, s.EzeSecurityType, tl.id, tl.quantity,
    case when tl.side = 'BUY' then 'LONG'
    when tl.side = 'SHORT' then 'SHORT'
    end as position,
    c.cost_basis,
    tl.business_date
    from fnTaxLotReport(@date) tl
    inner join [SecurityMaster]..security s on tl.symbol = s.ezeticker
    left join cost_basis c on c.symbol = tl.symbol and c.business_date = tl.business_date
    where tl.side in ('BUY', 'SHORT') and tl.status in ('open', 'partially closed')
RETURN 0
