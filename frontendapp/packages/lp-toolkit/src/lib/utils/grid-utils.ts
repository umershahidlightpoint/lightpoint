import { Column, GridOptions, IServerSideDatasource, SideBarDef } from 'ag-grid-community';
import {
  CustomToolPanelParams,
  CustomGridOptions,
  LayoutServices
} from '../models/grid-layout.model';

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

export const SideBar = (
  userId: number,
  gridId: number,
  gridName: string,
  gridOptions: GridOptions | CustomGridOptions,
  layoutServices: LayoutServices,
  defaultView: string = '',
  dataSource: IServerSideDatasource = null,
  hiddenByDefault: boolean = false,
  position: 'left' | 'right' = 'right'
) => {
  const customToolPanelParams: CustomToolPanelParams = {
    api: gridOptions.api,
    userId,
    gridId,
    gridName,
    gridOptions,
    layoutServices,
    defaultView,
    dataSource
  };
  const sideBarDef: SideBarDef = {
    hiddenByDefault,
    position,
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel'
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel'
      },
      {
        id: 'layouts',
        labelDefault: 'Layout',
        labelKey: 'Grid Layout',
        iconKey: 'chart',
        toolPanel: 'customToolPanel',
        toolPanelParams: customToolPanelParams
      }
    ],
    defaultToolPanel: ''
  };
  return {
    toolPanels: [
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel'
      },
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel'
      },
      {
        id: 'layouts',
        labelDefault: 'Layout',
        labelKey: 'Grid Layout',
        iconKey: 'chart',
        toolPanel: 'customToolPanel',
        toolPanelParams: customToolPanelParams
      }
    ],
    defaultToolPanel: ''
  };
};
