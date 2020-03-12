/*
Adding new Account Types
*/

DECLARE @AC_ASSET int
DECLARE @AC_EQUITY int
DECLARE @AC_LIABILITY int
DECLARE @AC_EXPENCES int
DECLARE @AC_REVENUE int

SET @AC_ASSET = 1
SET @AC_EQUITY = 3
SET @AC_LIABILITY = 2
SET @AC_EXPENCES = 5
SET @AC_REVENUE = 4

-- select * from account_type where account_category_id = @AC_ASSET

if not exists ( select * from account_type where name = 'Interest Receivable' and account_category_id = @AC_ASSET)
begin
	insert into account_type (name, account_category_id) values ('Interest Receivable', @AC_ASSET)
end

if not exists ( select * from account_type where name = 'Interest Payable' and account_category_id = @AC_LIABILITY)
begin
	insert into account_type (name, account_category_id) values ('Interest Payable', @AC_LIABILITY)
end

if not exists ( select * from account_type where name = 'Other' and account_category_id = @AC_ASSET)
begin
	insert into account_type (name, account_category_id) values ('Other', @AC_ASSET)
end

if not exists ( select * from account_type where name = 'Other' and account_category_id = @AC_EQUITY)
begin
	insert into account_type (name, account_category_id) values ('Other', @AC_EQUITY)
end

if not exists ( select * from account_type where name = 'Other' and account_category_id = @AC_LIABILITY)
begin
	insert into account_type (name, account_category_id) values ('Other', @AC_LIABILITY)
end

if not exists ( select * from account_type where name = 'Other' and account_category_id = @AC_EXPENCES)
begin
	insert into account_type (name, account_category_id) values ('Other', @AC_EXPENCES)
end

if not exists ( select * from account_type where name = 'Other' and account_category_id = @AC_REVENUE)
begin
	insert into account_type (name, account_category_id) values ('Other', @AC_REVENUE)
end

