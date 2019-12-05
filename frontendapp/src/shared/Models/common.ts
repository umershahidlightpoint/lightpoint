import { GridParams } from 'ag-grid-community';

export interface ContextMenu {
  name: string;
  action: () => void;
}

// Using this for Custom Column Definitions.
export interface ColDefObject {
  headerName: string;
  field: string;
  type?: string;
  hide?: boolean;
  sortable?: boolean;
  editable?: boolean;
  filter?: boolean;
  suppressCellFlash?: boolean;
  cellEditor?: string;
  cellRendererFramework?: any;
  cellEditorParams?: { values: Array<string> };
  valueFormatter?: (params: any) => string;
}

export interface CustomColDef extends ColDefObject {
  customMethod?: (params: GridParams) => void;
}
