﻿CREATE VIEW [dbo].[vwJournal]
	AS 
                            SELECT 
                                    [when],
                                    [event],
                                    (CASE 
										WHEN [account_category].[name] in ('Asset', 'Expenses') and value < 0  THEN ABS(value) 
                                        WHEN [account_category].[name] not in ('Asset', 'Expenses') and value > 0  THEN ABS(value) 
										Else 0
										END  ) credit,
                                    (CASE 
										WHEN [account_category].[name] in ('Asset','Expenses') and value > 0  THEN ABS(value) 
                                        WHEN [account_category].[name] not in ('Asset','Expenses') and value < 0  THEN ABS(value) 
										Else 0
										END  ) debit,
									[journal].[symbol],
									[journal].[security_id],
									[journal].[quantity],
                                    [journal].[id],
                                    [account_id],
                                    [fx_currency],
                                    [fund],
                                    [account_category].[name] as AccountCategory,  
                                    [account_type].[name] as AccountType,
									[account].[name] as accountName, -- Changed to CamelCase
									[account].[description] as accountDescription, -- Changed to CamelCase
                                    [value],
                                    [source],
                                    [start_price],
                                    [end_price],
									[fxrate],
									[is_account_to]
                                    FROM [journal] with(nolock) 
                        join account with(nolock)  on [journal]. [account_id] = account.id 
                        join [account_type] with(nolock) on  [account].account_type_id = [account_type].id
                        join [account_category] with(nolock) on  [account_type].account_category_id = [account_category].id