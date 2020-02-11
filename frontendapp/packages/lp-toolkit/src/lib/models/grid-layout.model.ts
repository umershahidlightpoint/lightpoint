import {
  ColDef,
  ColGroupDef,
  IServerSideDatasource,
  IToolPanelParams,
  GridOptions
} from 'ag-grid-community';

export interface GridLayout {
  UserId: number | string;
  Id: number | string;
  GridId: number | string;
  GridName: string;
  GridLayoutName: string;
  ColumnState: ColDef[] | ColGroupDef[] | string;
  GroupState: any[] | string;
  PivotMode: boolean | string;
  SortState: any[] | string;
  FilterState: any | string;
  ExternalFilterState: any | string;
  IsPublic: boolean;
  IsDefault?: boolean;
}

export interface LayoutServices {
  getGridLayouts: string;
  getLayoutDetail: string;
  saveGridLayout: string;
  deleteGridLayout: string;
  dataProperty: string;
}

export interface IExternalFilter {
  getExternalFilterState(): any;
  clearExternalFilters(): void;
  setExternalFilter(externalFilterState: any): void;
}

export interface CustomGridOptions extends GridOptions {
  getExternalFilterState(): any;
  clearExternalFilters(): void;
  setExternalFilter(externalFilterState: any): void;
}

export interface CustomToolPanelParams extends IToolPanelParams {
  layoutServices: LayoutServices;
  userId: number | string;
  gridId: number | string;
  gridName: string;
  gridOptions: GridOptions | CustomGridOptions;
  defaultView?: string;
  dataSource?: IServerSideDatasource;
}
