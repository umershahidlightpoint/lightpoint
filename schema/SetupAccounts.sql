use Finance
go

insert into account_category (id, name) values (1, 'Asset')
insert into account_category (id, name) values (2, 'Liability')
insert into account_category (id, name) values (3, 'Equity')
insert into account_category (id, name) values (4, 'Revenues')
insert into account_category (id, name) values (5, 'Expenses')

delete from account_type
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
insert into Account_type (account_category_id, name) values (1, 'UNREALIZED GAIN/LOSS FUTURES')
insert into Account_type (account_category_id, name) values (1, 'FUTURES COLLATERAL ACCOUNTS')
insert into Account_type (account_category_id, name) values (1, 'DIVIDENDS RECEIVABLE')
insert into Account_type (account_category_id, name) values (1, 'INTEREST RECEIVABLE ( Coupon Payments )')
insert into Account_type (account_category_id, name) values (1, 'Interest Receivable on  PB Balances ')
insert into Account_type (account_category_id, name) values (1, 'INTERCOMPANY RECEIVABLE/(PAYABLE)')
insert into Account_type (account_category_id, name) values (1, 'CAPITAL RECEIVABLE/ PAYABLE FROM SHAREHOLDERS')
insert into Account_type (account_category_id, name) values (1, 'FIXED ASSETS')
insert into Account_type (account_category_id, name) values (1, 'ACCCUMULATED DEPRECIATION')
insert into Account_type (account_category_id, name) values (1, 'LEASEHOLD IMPROVEMENTS')
insert into Account_type (account_category_id, name) values (1, 'ACCUMULATED AMORTIZATION')
insert into Account_type (account_category_id, name) values (1, 'ORGANIZATION COSTS')
insert into Account_type (account_category_id, name) values (1, 'PREPAID EXPENSES')
-- DONE

/*
Liabilities
*/
insert into Account_type (account_category_id, name) values (2, 'SHORT POSITIONS-COST')
insert into Account_type (account_category_id, name) values (2, 'UNREALIZED P/L-BALANCE SHEET')
insert into Account_type (account_category_id, name) values (2, 'DIVIDENDS PAYABLE')
insert into Account_type (account_category_id, name) values (2, 'INTEREST PAYABLE ( Fixed Income Coupons )')
insert into Account_type (account_category_id, name) values (2, 'Interest Expense ( Bond Premium ammortization )')
insert into Account_type (account_category_id, name) values (2, 'Interest Expense of PB Balances  Payable')
insert into Account_type (account_category_id, name) values (2, 'Financing Expense on Swap Par Value')
insert into Account_type (account_category_id, name) values (2, 'DIVIDENDS FOREIGN WITHHOLDINGS')
insert into Account_type (account_category_id, name) values (2, 'ACCRUED EXPENSES:     All called payables')
-- DONE

/*
Equity
*/
insert into Account_type (account_category_id, name) values (3, '3. OWNERS EQUITY')
-- DONE

/*
Revenues
*/
insert into Account_type (account_category_id, name) values (4, 'REALIZED GAIN/(LOSS)')
insert into Account_type (account_category_id, name) values (4, 'CHANGE IN UNREALIZED GAIN/(LOSS)')
insert into Account_type (account_category_id, name) values (4, 'DIVIDEND INCOME')
insert into Account_type (account_category_id, name) values (4, 'FOREIGN WITHHOLDING TAX')
insert into Account_type (account_category_id, name) values (4, 'INTEREST INCOME ( Fixed Income Coupon )')
insert into Account_type (account_category_id, name) values (4, 'Interest Income on  PB Balances')
-- DONE

/*
Expences
*/
insert into Account_type (account_category_id, name) values (5, 'DIVIDEND EXPENSE')
insert into Account_type (account_category_id, name) values (5, 'INTEREST EXPENSE ( Fixed Income Coupons )')
insert into Account_type (account_category_id, name) values (5, 'Interest Expense of PB Balances')
insert into Account_type (account_category_id, name) values (5, 'STOCK BORROW FEES')
insert into Account_type (account_category_id, name) values (5, 'EMPLOYEE COMPENSATION')
insert into Account_type (account_category_id, name) values (5, 'Expenses Paid')
insert into Account_type (account_category_id, name) values (5, 'AMORTIZATION AND DEPRECIATION')
-- DONE




