/*
Verify that the data in the named table is for the correct dates
*/

select ips.BusDate, REPLACE(SecurityCode, '@', '') as SecurityCode, Price, SettlePrice, (settlePrice - Price) as diff from PositionMaster..intradayPositionSplit ips
inner join (
select BusDate, max(LastModifiedOn) as LastModifiedOn  from PositionMaster..intradayPositionSplit
group by BusDate
) as s on s.BusDate = ips.BusDate and s.LastModifiedOn = ips.LastModifiedOn
where ips.BusDate >= '2019-04-01'
order by ips.BusDate asc