import * as moment from 'moment';

export const SideBar = {
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
      id: 'custom filters',
      labelDefault: 'Layout',
      labelKey: 'Grid Layout',
      iconKey: 'filter',
      toolPanel: 'customToolPanel'
    }
  ],
  defaultToolPanel: ''
};

export const Ranges: any = {
  ITD: [moment('01-01-1901', 'MM-DD-YYYY'), moment()],
  YTD: [moment().startOf('year'), moment()],
  MTD: [moment().startOf('month'), moment()],
  Today: [moment(), moment()]
};

export const IgnoreFields = [
  'id',
  'totalDebit',
  'totalCredit',
  'overall_count',
  'account_id',
  'value',
  'LpOrderId'
];
