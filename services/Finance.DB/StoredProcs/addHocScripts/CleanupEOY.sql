/*
Need to remove the journal entries for entries for EOY Processing
*/
delete from journal where source = 'year-closeout'
delete from current_journal where source = 'year-closeout'
delete from current_journal_full where source = 'year-closeout'
