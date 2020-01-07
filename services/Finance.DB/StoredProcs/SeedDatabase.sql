/*
Used to populate the database on initial startup of the system.
*/
CREATE PROCEDURE [dbo].[SeedDatabase]
AS

/*
Categories
*/
insert into account_category (id, name) values (0, 'Dummy')
insert into account_category (id, name) values (1, 'Asset')
insert into account_category (id, name) values (2, 'Liability')
insert into account_category (id, name) values (3, 'Equity')
insert into account_category (id, name) values (4, 'Revenues')
insert into account_category (id, name) values (5, 'Expenses')


/* 
Types
*/

insert into account_type (account_category_id, name) values (0, 'Dummy Type')
insert into account_type (account_category_id, name) values (1, 'ACCCUMULATED DEPRECIATION')
insert into account_type (account_category_id, name) values (1, 'ACCUMULATED AMORTIZATION')
insert into account_type (account_category_id, name) values (1, 'CAPITAL RECEIVABLE/ PAYABLE FROM SHAREHOLDERS')
insert into account_type (account_category_id, name) values (1, 'CASH')
insert into account_type (account_category_id, name) values (1, 'DIVIDENDS RECEIVABLE')
insert into account_type (account_category_id, name) values (1, 'DUE FROM/(TO) PRIME BROKERS ( Unsettled Activity )')
insert into account_type (account_category_id, name) values (1, 'FIXED ASSETS')
insert into account_type (account_category_id, name) values (1, 'FUTURES COLLATERAL ACCOUNTS')
insert into account_type (account_category_id, name) values (1, 'FX MARKET TO MARKET ON STOCK COST')
insert into account_type (account_category_id, name) values (1, 'FX Mark to Market on Derivative Contracts')

insert into account_type (account_category_id, name) values (1, 'INTERCOMPANY RECEIVABLE/(PAYABLE)')
insert into account_type (account_category_id, name) values (1, 'INTEREST RECEIVABLE ( Coupon Payments )')
insert into account_type (account_category_id, name) values (1, 'Interest Receivable on  PB Balances ')
insert into account_type (account_category_id, name) values (1, 'LEASEHOLD IMPROVEMENTS')
insert into account_type (account_category_id, name) values (1, 'LONG POSITIONS AT COST')
insert into account_type (account_category_id, name) values (1, 'Mark to Market Longs')
insert into account_type (account_category_id, name) values (1, 'Mark to Market longs fx translation gain or loss')
insert into account_type (account_category_id, name) values (1, 'ORGANIZATION COSTS')
insert into account_type (account_category_id, name) values (1, 'PREPAID EXPENSES')
insert into account_type (account_category_id, name) values (1, 'PURCHASED/SOLD) Fixed Income COUPON INTEREST')
insert into account_type (account_category_id, name) values (1, 'Settled Cash')
insert into account_type (account_category_id, name) values (1, 'SWAP COLLATERAL ACCOUNTS')
insert into account_type (account_category_id, name) values (1, 'UNREALIZED GAIN/LOSS FUTURES')
insert into account_type (account_category_id, name) values (1, 'UNREALIZED GAIN/LOSS SWAPS')
insert into account_type (account_category_id, name) values (1, 'Derivative contracts, at fair value')

insert into account_type (account_category_id, name) values (2, 'ACCRUED EXPENSES')
insert into account_type (account_category_id, name) values (2, 'DIVIDENDS FOREIGN WITHHOLDINGS')
insert into account_type (account_category_id, name) values (2, 'DIVIDENDS PAYABLE')
insert into account_type (account_category_id, name) values (2, 'Financing Expense on Swap Par Value')
insert into account_type (account_category_id, name) values (2, 'Interest Expense ( Bond Premium ammortization )')
insert into account_type (account_category_id, name) values (2, 'Interest Expense of PB Balances  Payable')
insert into account_type (account_category_id, name) values (2, 'INTEREST PAYABLE ( Fixed Income Coupons )')
insert into account_type (account_category_id, name) values (2, 'Mark to Market Shorts')
insert into account_type (account_category_id, name) values (2, 'SHORT POSITIONS AT COST')
insert into account_type (account_category_id, name) values (2, 'Derivative contracts, at fair value')

insert into account_type (account_category_id, name) values (3, 'CONTRIBUTED CAPITAL')
insert into account_type (account_category_id, name) values (3, 'CURRENT YEAR NET INCOME/(LOSS)')
insert into account_type (account_category_id, name) values (3, 'RETAINED EARNINGS-PRIOR YEARS P&L')

insert into account_type (account_category_id, name) values (4, 'change in unrealized do to fx translation')
insert into account_type (account_category_id, name) values (4, 'Change in unrealized due to fx on original Cost')
insert into account_type (account_category_id, name) values (4, 'Change in unrealized due to fx on derivates contracts')
insert into account_type (account_category_id, name) values (4, 'CHANGE IN UNREALIZED GAIN/(LOSS)')
insert into account_type (account_category_id, name) values (4, 'DIVIDEND INCOME')
insert into account_type (account_category_id, name) values (4, 'FOREIGN WITHHOLDING TAX')
insert into account_type (account_category_id, name) values (4, 'fx gain or loss in revenue')
insert into account_type (account_category_id, name) values (4, 'fx gain or loss on settled balance')
insert into account_type (account_category_id, name) values (4, 'fx gain or loss on unsettled balance')
insert into account_type (account_category_id, name) values (4, 'INTEREST INCOME ( Fixed Income Coupon )')
insert into account_type (account_category_id, name) values (4, 'Interest Income on  PB Balances')
insert into account_type (account_category_id, name) values (4, 'REALIZED GAIN/(LOSS)')
insert into account_type (account_category_id, name) values (4, 'REALIZED GAIN/(LOSS) DUE TO FX')

insert into account_type (account_category_id, name) values (5, 'AMORTIZATION AND DEPRECIATION')
insert into account_type (account_category_id, name) values (5, 'DIVIDEND EXPENSE')
insert into account_type (account_category_id, name) values (5, 'EMPLOYEE COMPENSATION')
insert into account_type (account_category_id, name) values (5, 'Expenses Paid')
insert into account_type (account_category_id, name) values (5, 'INTEREST EXPENSE ( Fixed Income Coupons )')
insert into account_type (account_category_id, name) values (5, 'Interest Expense of PB Balances')
insert into account_type (account_category_id, name) values (5, 'STOCK BORROW FEES')

INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'fund','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'symbol','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'AccountCategory','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'AccountType','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'AccountName','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'fx_currency','vwFullJournal','vwFullJournal','Journals Ledgers')



-- DONE

RETURN 0
