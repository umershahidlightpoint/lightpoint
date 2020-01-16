/*
Used to populate the database on initial startup of the system.
*/
CREATE PROCEDURE [dbo].[SeedDatabase]
AS

/*
Categories
*/
insert into account_category (id, name) values (1, 'Asset')
insert into account_category (id, name) values (2, 'Liability')
insert into account_category (id, name) values (3, 'Equity')
insert into account_category (id, name) values (4, 'Revenues')
insert into account_category (id, name) values (5, 'Expenses')

/*
Derivative Contracts

We use these for OTC Instruments
*/
-- ASSET 
insert into account_type (account_category_id, name) values (1, 'Mark to Market Derivatives Contracts at Fair Value (Assets)')
insert into account_type (account_category_id, name) values (1, 'Mark to Market Derivatives Contracts due to FX (Assets)')
insert into account_type (account_category_id, name) values (1, 'Mark to Market Derivatives Contracts due to FX Translation (Assets)')

-- LIABILITY
insert into account_type (account_category_id, name) values (2, 'Mark to Market Derivatives Contracts at Fair Value (Liabilities)')
insert into account_type (account_category_id, name) values (2, 'Mark to Market Derivatives Contracts due to FX (Liabilities)')
insert into account_type (account_category_id, name) values (2, 'Mark to Market Derivatives Contracts due to FX  Translation (Liabilities)')

-- REVENUE
insert into account_type (account_category_id, name) values (4, 'Change in Unrealized Derivatives Contracts at Fair Value')
insert into account_type (account_category_id, name) values (4, 'Change in Unrealized Derivatives Contracts due to FX')
insert into account_type (account_category_id, name) values (4, 'Change in Unrealized Derivatives Contracts due to FX Translation')


/* 
Types
*/
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

-- Added 
insert into account_type (account_category_id, name) values (2, 'Mark to Market shorts fx translation gain or loss')
insert into account_type (account_category_id, name) values (2, 'FX MARK TO MARKET ON STOCK COST (SHORTS)')

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

-- server side filters
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'fund','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'symbol','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'AccountCategory','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'AccountType','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'AccountName','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'fx_currency','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'CustodianCode','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'SecurityType','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'Side','vwFullJournal','vwFullJournal','Journals Ledgers')
INSERT INTO [server_side_filter_config]([created_by],[created_date],[last_updated_by],[last_updated_date],[col_name],[source],[meta_info],[grid_name]) VALUES('sa',GETDATE(),NULL,NULL,'Action','vwFullJournal','vwFullJournal','Journals Ledgers')

-- default layouts
INSERT [dbo].[data_grid_layouts] ([grid_id], [grid_name], [grid_layout_name], [userId], [pivot_mode], [column_state], [group_state], [sort_state], [filter_state], [external_filter_state], [is_public], [is_default]) VALUES (1, N'Journals Ledgers', N'Nav', 1, N'false', N'[{"colId":"ag-Grid-AutoColumn","hide":false,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":"left","rowGroupIndex":null},{"colId":"id","hide":false,"aggFunc":null,"width":90,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"source","hide":false,"aggFunc":null,"width":300,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fund","hide":false,"aggFunc":null,"width":151,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"AccountCategory","hide":false,"aggFunc":null,"width":109,"pivotIndex":null,"pinned":null,"rowGroupIndex":0},{"colId":"AccountType","hide":false,"aggFunc":null,"width":249,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"accountName","hide":false,"aggFunc":null,"width":386,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"accountDescription","hide":false,"aggFunc":null,"width":168,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"when","hide":false,"aggFunc":null,"width":106,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"debit","hide":false,"aggFunc":"sum","width":123,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"credit","hide":false,"aggFunc":"sum","width":123,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"balance","hide":false,"aggFunc":"sum","width":117,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"quantity","hide":false,"aggFunc":"sum","width":106,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"symbol","hide":false,"aggFunc":null,"width":100,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fxrate","hide":false,"aggFunc":null,"width":99,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"event","hide":false,"aggFunc":null,"width":116,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"security_id","hide":false,"width":116,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fx_currency","hide":false,"aggFunc":null,"width":120,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"value","hide":false,"width":93,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"start_price","hide":false,"width":114,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"end_price","hide":false,"width":111,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"is_account_to","hide":false,"aggFunc":null,"width":131,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"TradeId","hide":false,"aggFunc":null,"width":271,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Action","hide":false,"aggFunc":null,"width":94,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Status","hide":false,"aggFunc":null,"width":92,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"CustodianCode","hide":false,"aggFunc":null,"width":141,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"SecurityType","hide":false,"aggFunc":null,"width":127,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Side","hide":false,"aggFunc":null,"width":83,"pivotIndex":null,"pinned":null,"rowGroupIndex":null}]', N'[]', N'[]', N'{"AccountCategory":{"values":["Asset","Liability"],"filterType":"set"}}', N'{"fundFilter":"All Funds","symbolFilter":"","zeroBalanceFilter":0,"absoluteSortingModel":{"sortingApplied":false,"sortingOn":[]},"dateFilter":{"startDate":"","endDate":""}}', 0, 1)
INSERT [dbo].[data_grid_layouts] ([grid_id], [grid_name], [grid_layout_name], [userId], [pivot_mode], [column_state], [group_state], [sort_state], [filter_state], [external_filter_state], [is_public], [is_default]) VALUES (1, N'Journals Ledgers', N'Balance Sheet', 1, N'false', N'[{"colId":"ag-Grid-AutoColumn","hide":false,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":"left","rowGroupIndex":null},{"colId":"id","hide":false,"aggFunc":null,"width":90,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"source","hide":false,"aggFunc":null,"width":300,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fund","hide":false,"aggFunc":null,"width":151,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"AccountCategory","hide":false,"aggFunc":null,"width":109,"pivotIndex":null,"pinned":null,"rowGroupIndex":0},{"colId":"AccountType","hide":false,"aggFunc":null,"width":249,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"accountName","hide":false,"aggFunc":null,"width":386,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"accountDescription","hide":false,"aggFunc":null,"width":168,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"when","hide":false,"aggFunc":null,"width":106,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"debit","hide":false,"aggFunc":"sum","width":123,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"credit","hide":false,"aggFunc":"sum","width":123,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"balance","hide":false,"aggFunc":"sum","width":117,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"quantity","hide":false,"aggFunc":"sum","width":106,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"symbol","hide":false,"aggFunc":null,"width":100,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fxrate","hide":false,"aggFunc":null,"width":99,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"event","hide":false,"aggFunc":null,"width":116,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"security_id","hide":false,"width":116,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fx_currency","hide":false,"aggFunc":null,"width":120,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"value","hide":false,"width":93,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"start_price","hide":false,"width":114,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"end_price","hide":false,"width":111,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"is_account_to","hide":false,"aggFunc":null,"width":131,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"TradeId","hide":false,"aggFunc":null,"width":271,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Action","hide":false,"aggFunc":null,"width":94,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Status","hide":false,"aggFunc":null,"width":92,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"CustodianCode","hide":false,"aggFunc":null,"width":141,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"SecurityType","hide":false,"aggFunc":null,"width":127,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Side","hide":false,"aggFunc":null,"width":83,"pivotIndex":null,"pinned":null,"rowGroupIndex":null}]', N'[]', N'[]', N'{"AccountCategory":{"values":["Asset","Equity","Liability"],"filterType":"set"}}', N'{"fundFilter":"All Funds","symbolFilter":"","zeroBalanceFilter":0,"absoluteSortingModel":{"sortingApplied":false,"sortingOn":[]},"dateFilter":{"startDate":"","endDate":""}}', 0, 1)
INSERT [dbo].[data_grid_layouts] ([grid_id], [grid_name], [grid_layout_name], [userId], [pivot_mode], [column_state], [group_state], [sort_state], [filter_state], [external_filter_state], [is_public], [is_default]) VALUES (1, N'Journals Ledgers', N'Income Statement', 1, N'false', N'[{"colId":"ag-Grid-AutoColumn","hide":false,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":"left","rowGroupIndex":null},{"colId":"id","hide":false,"aggFunc":null,"width":90,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"source","hide":false,"aggFunc":null,"width":300,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fund","hide":false,"aggFunc":null,"width":151,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"AccountCategory","hide":false,"aggFunc":null,"width":109,"pivotIndex":null,"pinned":null,"rowGroupIndex":0},{"colId":"AccountType","hide":false,"aggFunc":null,"width":249,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"accountName","hide":false,"aggFunc":null,"width":386,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"accountDescription","hide":false,"aggFunc":null,"width":168,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"when","hide":false,"aggFunc":null,"width":106,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"debit","hide":false,"aggFunc":"sum","width":123,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"credit","hide":false,"aggFunc":"sum","width":123,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"balance","hide":false,"aggFunc":"sum","width":117,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"quantity","hide":false,"aggFunc":"sum","width":106,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"symbol","hide":false,"aggFunc":null,"width":100,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fxrate","hide":false,"aggFunc":null,"width":99,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"event","hide":false,"aggFunc":null,"width":116,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"security_id","hide":false,"width":116,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fx_currency","hide":false,"aggFunc":null,"width":120,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"value","hide":false,"width":93,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"start_price","hide":false,"width":114,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"end_price","hide":false,"width":111,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"is_account_to","hide":false,"aggFunc":null,"width":131,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"TradeId","hide":false,"aggFunc":null,"width":271,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Action","hide":false,"aggFunc":null,"width":94,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Status","hide":false,"aggFunc":null,"width":92,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"CustodianCode","hide":false,"aggFunc":null,"width":141,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"SecurityType","hide":false,"aggFunc":null,"width":127,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Side","hide":false,"aggFunc":null,"width":83,"pivotIndex":null,"pinned":null,"rowGroupIndex":null}]', N'[]', N'[]', N'{"AccountCategory":{"values":["Expenses","Revenues"],"filterType":"set"}}', N'{"fundFilter":"All Funds","symbolFilter":"","zeroBalanceFilter":0,"absoluteSortingModel":{"sortingApplied":false,"sortingOn":[]},"dateFilter":{"startDate":"","endDate":""}}', 0, 1)
INSERT [dbo].[data_grid_layouts] ([grid_id], [grid_name], [grid_layout_name], [userId], [pivot_mode], [column_state], [group_state], [sort_state], [filter_state], [external_filter_state], [is_public], [is_default]) VALUES (1, N'Journals Ledgers', N'Trial Balance', 1, N'false', N'[{"colId":"ag-Grid-AutoColumn","hide":false,"aggFunc":null,"width":200,"pivotIndex":null,"pinned":"left","rowGroupIndex":null},{"colId":"id","hide":false,"aggFunc":null,"width":71,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"source","hide":false,"aggFunc":null,"width":300,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fund","hide":false,"aggFunc":null,"width":87,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"AccountCategory","hide":false,"aggFunc":null,"width":109,"pivotIndex":null,"pinned":null,"rowGroupIndex":0},{"colId":"AccountType","hide":false,"aggFunc":null,"width":86,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"accountName","hide":false,"aggFunc":null,"width":139,"pivotIndex":null,"pinned":null,"rowGroupIndex":1},{"colId":"accountDescription","hide":false,"aggFunc":null,"width":168,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"when","hide":false,"aggFunc":null,"width":106,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"debit","hide":false,"aggFunc":"sum","width":126,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"credit","hide":false,"aggFunc":"sum","width":129,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"balance","hide":false,"aggFunc":"sum","width":137,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"quantity","hide":false,"aggFunc":"sum","width":136,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"symbol","hide":false,"aggFunc":null,"width":100,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fxrate","hide":false,"aggFunc":null,"width":99,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"event","hide":false,"aggFunc":null,"width":90,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"security_id","hide":false,"width":147,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"fx_currency","hide":false,"aggFunc":null,"width":120,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"value","hide":false,"width":119,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"start_price","hide":false,"width":146,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"end_price","hide":false,"width":142,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"is_account_to","hide":false,"aggFunc":null,"width":131,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"TradeId","hide":false,"aggFunc":null,"width":100,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Action","hide":false,"aggFunc":null,"width":94,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Status","hide":false,"aggFunc":null,"width":92,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"CustodianCode","hide":false,"aggFunc":null,"width":141,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"SecurityType","hide":false,"aggFunc":null,"width":127,"pivotIndex":null,"pinned":null,"rowGroupIndex":null},{"colId":"Side","hide":false,"aggFunc":null,"width":83,"pivotIndex":null,"pinned":null,"rowGroupIndex":null}]', N'[]', N'[]', N'{}', N'{"fundFilter":"All Funds","symbolFilter":"","zeroBalanceFilter":0,"absoluteSortingModel":{"sortingApplied":false,"sortingOn":[]},"dateFilter":{"startDate":"","endDate":""}}', 0, 1)


-- DONE

RETURN 0