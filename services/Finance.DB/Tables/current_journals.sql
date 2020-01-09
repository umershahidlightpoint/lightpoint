﻿create table current_journal (
[when] [datetime],
event [varchar](100),
credit numeric(22,9),
debit numeric(22,9),
symbol [varchar](100),
security_id [int],
quantity numeric(22,9),
id [int],
account_id [int],
fx_currency [varchar](3),
fund [varchar](50),
AccountCategory [varchar](50),
AccountType [varchar](100),
accountName [varchar](100),
accountDescription [varchar](100),
value numeric(22,9),
source [varchar](50),
start_price numeric(22,9),
end_price numeric(22,9),
fxrate numeric(22,9)
)