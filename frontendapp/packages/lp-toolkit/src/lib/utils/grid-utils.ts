import { GridOptions, Column } from 'ag-grid-community';

export function autoSizeAllColumns(params: GridOptions) {
  const { columnApi } = params;
  const columnIds = [];
  const columnDefs = columnApi.getAllColumns();

  if (columnDefs != null) {
    columnDefs.forEach((column: Column | any) => {
      columnIds.push(column.colId);
    });

    columnApi.autoSizeColumns(columnIds);
  }
}
