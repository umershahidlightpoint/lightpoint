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
  'totalDebit',
  'totalCredit',
  'overall_count',
  'account_id',
  'value',
  'LpOrderId'
];

export const Style = {
  marginTop: '20px',
  width: '100%',
  height: '100%',
  boxSizing: 'border-box'
};

export const ContainerDiv = {
  border: '1px solid #eee',
  padding: '4px',
  marginTop: '20px',
  width: '100%',
  height: 'calc(100vh - 125px)',
  boxSizing: 'border-box'
};

export const ExcelStyle = [
  {
    id: 'twoDecimalPlaces',
    numberFormat: { format: '#,##0' }
  },
  {
    id: 'footerRow',
    font: {
      bold: true
    }
  },
  {
    id: 'greenBackground',
    interior: {
      color: '#b5e6b5',
      pattern: 'Solid'
    }
  },
  {
    id: 'redFont',
    font: {
      fontName: 'Calibri Light',
      italic: true,
      color: '#ff0000'
    }
  },
  {
    id: 'header',
    interior: {
      color: '#CCCCCC',
      pattern: 'Solid'
    },
    borders: {
      borderBottom: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1
      },
      borderLeft: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1
      },
      borderRight: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1
      },
      borderTop: {
        color: '#5687f5',
        lineStyle: 'Continuous',
        weight: 1
      }
    }
  }
];

export const CalTotalRecords = gridOptions => {
  let tTotal = 0;
  let tCredit = 0;
  let tDebit = 0;
  let isGrouped = false;

  gridOptions.api.forEachNodeAfterFilter((rowNode, index) => {
    if (rowNode.group && rowNode.level === 0) {
      isGrouped = true;
      tTotal += rowNode.allChildrenCount;
      tCredit += rowNode.aggData.credit;
      tDebit += rowNode.aggData.debit;
    }
    if (!rowNode.group && !isGrouped) {
      tTotal += 1;
      tCredit += rowNode.data.credit;
      tDebit += rowNode.data.debit;
    }
  });

  const pinnedBottomRowData = [
    {
      source: 'Total Records: ' + tTotal,
      AccountType: '',
      accountName: '',
      when: '',
      debit: Math.abs(tDebit),
      credit: tCredit,
      balance: Math.abs(tDebit) - Math.abs(tCredit)
    }
  ];
  return pinnedBottomRowData;
};
