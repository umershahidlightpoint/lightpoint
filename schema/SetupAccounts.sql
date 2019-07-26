use Finance
go

insert into account_category (id, name) values (1, 'Asset')
insert into account_category (id, name) values (2, 'Liability')
insert into account_category (id, name) values (3, 'Equity')
insert into account_category (id, name) values (4, 'Revenues')
insert into account_category (id, name) values (5, 'Expences')

/* 
Assets
*/
insert into Account_type (account_category_id, name) values (1, 'CASH')
insert into Account_type (account_category_id, name) values (1, 'LONG POSITIONS AT COST')
insert into Account_type (account_category_id, name) values (1, 'UNREALIZED P/L-BALANCE SHEET LONGS')
insert into Account_type (account_category_id, name) values (1, 'PURCHASED/SOLD) Fixed Income COUPON INTEREST')
insert into Account_type (account_category_id, name) values (1, 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )')
insert into Account_type (account_category_id, name) values (1, 'DUE FROM/(TO) PRIME BROKERS ( Settled Activity )')
insert into Account_type (account_category_id, name) values (1, 'UNREALIZED GAIN/LOSS SWAPS')
insert into Account_type (account_category_id, name) values (1, 'SWAP COLLATERAL ACCOUNTS')


/*
Liabilities
*/
insert into Account_type (account_category_id, name) values (2, 'CASH')

insert into Account_type (account_category_id, name) values (2, 'SHORT POSITIONS-COST')
insert into Account_type (account_category_id, name) values (2, 'UNREALIZED P/L-BALANCE SHEET')
insert into Account_type (account_category_id, name) values (2, 'DIVIDENDS PAYABLE')
insert into Account_type (account_category_id, name) values (2, 'INTEREST PAYABLE ( Fixed Income Coupons )')
insert into Account_type (account_category_id, name) values (2, 'Interest Expense ( Bond Premium ammortization )')
insert into Account_type (account_category_id, name) values (2, 'Interest Expense of PB Balances  Payable')
insert into Account_type (account_category_id, name) values (2, 'Financing Expense on Swap Par Value')


/*
Expences
*/
insert into Account_type (account_category_id, name) values (5, 'CASH')

insert into Account_type (account_category_id, name) values (5, 'DIVIDEND EXPENSE')
insert into Account_type (account_category_id, name) values (5, 'INTEREST EXPENSE ( Fixed Income Coupons )')
insert into Account_type (account_category_id, name) values (5, 'Interest Expense of PB Balances')
insert into Account_type (account_category_id, name) values (5, 'STOCK BORROW FEES')
insert into Account_type (account_category_id, name) values (5, 'CASH')
insert into Account_type (account_category_id, name) values (5, 'CASH')
insert into Account_type (account_category_id, name) values (5, 'CASH')
insert into Account_type (account_category_id, name) values (5, 'CASH')
insert into Account_type (account_category_id, name) values (5, 'CASH')
insert into Account_type (account_category_id, name) values (5, 'CASH')
insert into Account_type (account_category_id, name) values (5, 'CASH')
