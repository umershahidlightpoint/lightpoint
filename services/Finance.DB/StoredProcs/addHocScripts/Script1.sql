/*
Verify that the data in the named table is for the correct dates
*/
select BusDate, max(LastModifiedOn)  from PositionMaster..intradayPositionSplit
group by BusDate