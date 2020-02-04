CREATE PROCEDURE [dbo].[UpdateManualJournal]
	@journalId int
AS
	UPDATE
    c_journal
SET
	c_journal.[when] = v_journal.[when]
   ,c_journal.[event] = v_journal.[event]
   ,c_journal.[credit] = v_journal.[credit]
   ,c_journal.[debit] = v_journal.[debit]
   ,c_journal.[symbol] = v_journal.[symbol]
   ,c_journal.[security_id] = v_journal.[security_id]
   ,c_journal.[quantity] = v_journal.[quantity]
   ,c_journal.[id] = v_journal.[id]
   ,c_journal.[account_id] = v_journal.[account_id]
   ,c_journal.[fx_currency] = v_journal.[fx_currency]
   ,c_journal.[fund] = v_journal.[fund]
   ,c_journal.[AccountCategory] = v_journal.[AccountCategory]
   ,c_journal.[AccountType] = v_journal.[AccountType]
   ,c_journal.[accountName] = v_journal.[accountName]
   ,c_journal.[accountDescription] = v_journal.[accountDescription]
   ,c_journal.[value] = v_journal.[value]
   ,c_journal.[source] = v_journal.[source]
   ,c_journal.[start_price] = v_journal.[start_price]
   ,c_journal.[end_price] = v_journal.[end_price]
   ,c_journal.[fxrate] = v_journal.[fxrate]
FROM
    [dbo].[current_journal_full] AS c_journal
    INNER JOIN [dbo].[vwJournal] AS v_journal
        ON c_journal.id = v_journal.id
	WHERE c_journal.id = @journalId
RETURN 0