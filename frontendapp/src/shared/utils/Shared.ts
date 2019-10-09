import * as moment from 'moment';

export const SideBar = (id, name, gridInstance) => {
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
        id: 'custom filters',
        labelDefault: 'Layout',
        labelKey: 'Grid Layout',
        iconKey: 'filter',
        toolPanel: 'customToolPanel',
        toolPanelParams: {
          gridId: id,
          gridName: name,
          gridOptions: gridInstance
        }
      }
    ],
    defaultToolPanel: ''
  };
};

export const Ranges: any = {
  ITD: [moment('01-01-1901', 'MM-DD-YYYY'), moment()],
  YTD: [moment().startOf('year'), moment()],
  MTD: [moment().startOf('month'), moment()],
  Today: [moment(), moment()],
  Custom: [
    moment()
      .startOf('month')
      .subtract(1, 'month'),
    moment()
  ]
};

export const IgnoreFields = [
  'totalDebit',
  'totalCredit',
  'overall_count',
  'account_id',
  'value',
  'LpOrderId',
  'FilledQuantity',
  'OrderedQuantity'
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
      debit: tDebit,
      credit: tCredit,
      balance: tDebit - tCredit
    }
  ];
  return pinnedBottomRowData;
};

export const GetDateRangeLabel = (startDate, endDate) => {
  if (
    moment('01-01-1901', 'MM-DD-YYYY').diff(startDate, 'days') === 0 &&
    moment().diff(endDate, 'days') === 0
  ) {
    return 'ITD';
  }
  if (
    moment()
      .startOf('year')
      .diff(startDate, 'days') === 0 &&
    moment().diff(endDate, 'days') === 0
  ) {
    return 'YTD';
  }
  if (
    moment()
      .startOf('month')
      .diff(startDate, 'days') === 0 &&
    moment().diff(endDate, 'days') === 0
  ) {
    return 'MTD';
  }
  if (moment().diff(startDate, 'days') === 0 && moment().diff(endDate, 'days') === 0) {
    return 'Today';
  }
  return '';
};

export const SetDateRange = (dateFilter, startDate, endDate) => {
  if (typeof dateFilter === 'object') {
    startDate = moment(dateFilter.startDate);
    endDate = moment(dateFilter.endDate);
  }

  switch (dateFilter) {
    case 'ITD':
      startDate = moment('01-01-1901', 'MM-DD-YYYY');
      endDate = moment();
      break;
    case 'YTD':
      startDate = moment().startOf('year');
      endDate = moment();
      break;
    case 'MTD':
      startDate = moment().startOf('month');
      endDate = moment();
      break;
    case 'Today':
      startDate = moment();
      endDate = moment();
      break;
    default:
      break;
  }
  return [startDate, endDate];
};

export const DoesExternalFilterPass = (node, fund, startDate, endDate) => {
  if (fund !== 'All Funds' && startDate) {
    const cellFund = node.data.fund;
    const cellDate = new Date(node.data.when);

    return cellFund === fund && startDate.toDate() <= cellDate && endDate.toDate() >= cellDate;
  }

  if (fund !== 'All Funds') {
    const cellFund = node.data.fund;

    return cellFund === fund;
  }

  if (startDate) {
    const cellDate = new Date(node.data.when);

    return startDate.toDate() <= cellDate && endDate.toDate() >= cellDate;
  }
};

export const FormatNumber = numberToFormat => {
  if (numberToFormat !== null) {
    return numberToFormat.toFixed(2);
  }
};

export const FormatNumber4 = numberToFormat => {
  if (numberToFormat !== null) {
    return numberToFormat.toFixed(4);
  }
};

export const CommaSeparatedFormat = numberToFormat => {
  return numberToFormat === 0
    ? '0.00'
    : Math.floor(numberToFormat)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const HeightStyle = height => {
  return {
    marginTop: '20px',
    width: '100%',
    height: `calc(100vh - ${height}px)`,
    boxSizing: 'border-box'
  };
};

export const AutoSizeAllColumns = params => {
  const gridColumnApi = params.columnApi;

  const allColumnIds = [];
  gridColumnApi.getAllColumns().forEach(column => {
    allColumnIds.push(column.colId);
  });
  gridColumnApi.autoSizeColumns(allColumnIds);
};

export const CommonCols = () => {
  return [
    {
      field: 'id',
      minWidth: 50,
      headerName: 'Id',
      colId: 'id'
    },
    {
      field: 'source',
      minWidth: 300,
      enableRowGroup: true,
      headerName: 'Source',
      colId: 'source'
    },
    {
      field: 'fund',
      headerName: 'Fund',
      enableRowGroup: true,
      enablePivot: true,
      filter: true,
      width: 120,
      colId: 'fund'
    },
    {
      field: 'AccountCategory',
      headerName: 'Category',
      enableRowGroup: true,
      rowGroup:false,
      width: 100,
      enablePivot: true,
      filter: true,
      colId: 'AccountCategory'
    },
    {
      field: 'AccountType',
      headerName: 'Type',
      enableRowGroup: true,
      width: 200,
      enablePivot: true,
      filter: true,
      colId: 'AccountType'
    },
    {
      field: 'accountName',
      headerName: 'Account Name',
      sortable: true,
      rowGroup:false,
      enableRowGroup: true,
      filter: true,
      colId: 'accountName'
    },
    {
      field: 'accountDescription',
      headerName: 'Account Description',
      sortable: true,
      enableRowGroup: true,
      filter: true,
      colId: 'accountDescription'
    },
    {
      field: 'when',
      headerName: 'when',
      sortable: true,
      enableRowGroup: true,
      width: 100,
      enablePivot: true,
      colId: 'when',
      filter: 'agDateColumnFilter',
      filterParams: {
        comparator(filterLocalDateAtMidnight, cellValue) {
          const dateAsString = cellValue;
          const dateParts = dateAsString.split('/');
          const cellDate = new Date(
            Number(dateParts[2]),
            Number(dateParts[1]) - 1,
            Number(dateParts[0])
          );

          if (filterLocalDateAtMidnight.getTime() == cellDate.getTime()) {
            return 0;
          }

          if (cellDate < filterLocalDateAtMidnight) {
            return -1;
          }

          if (cellDate > filterLocalDateAtMidnight) {
            return 1;
          }
        }
      }
    },
    {
      field: 'debit',
      aggFunc: 'sum',
      headerName: '$Debit',
      valueFormatter: currencyFormatter,
      width: 100,
      colId: 'debit',
      cellStyle: { 'text-align': 'right' },
      cellClass: 'twoDecimalPlaces',
      cellClassRules: {
        // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value < -300; },
        footerRow(params) {
          if (params.node.rowPinned) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    {
      field: 'credit',
      aggFunc: 'sum',
      headerName: '$Credit',
      valueFormatter: currencyFormatter,
      width: 100,
      colId: 'credit',
      cellStyle: { 'text-align': 'right' },
      cellClass: 'twoDecimalPlaces',
      cellClassRules: {
        // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
        redFont(params) {
          if (params.node.rowPinned) {
            return false;
          } else {
            return params.value != 0;
          }
        },
        footerRow(params) {
          if (params.node.rowPinned) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    {
      field: 'balance',
      aggFunc: 'sum',
      headerName: '$Balance',
      valueFormatter: currencyFormatter,
      width: 100,
      colId: 'balance',
      cellStyle: { 'text-align': 'right' },
      cellClass: 'twoDecimalPlaces',
      cellClassRules: {
        // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
        greenFont(params) {
          if (params.node.rowPinned) {
            return false;
          } else {
            return params.value > 0;
          }
        },
        redFont(params) {
          if (params.node.rowPinned) {
            return false;
          } else {
            return params.value < 0;
          }
        },
        footerRow(params) {
          if (params.node.rowPinned) {
            return true;
          } else {
            return false;
          }
        }
      }
    },
    {
      field: 'Quantity',
      aggFunc: 'sum',
      width: 100,
      colId: 'Quantity',
      headerName: 'Quantity',
      sortable: true,
      enableRowGroup: true,
      filter: true
    },

    {
      field: 'TradeCurrency',
      width: 100,
      headerName: 'Trade Ccy',
      sortable: true,
      enableRowGroup: true,
      filter: true,
      colId: 'TradeCurrency'
    },
    {
      field: 'SettleCurrency',
      headerName: 'Settle Ccy',
      sortable: true,
      enableRowGroup: true,
      filter: true,
      width: 100,
      colId: 'SettleCurrency'
    },
    {
      field: 'Symbol',
      headerName: 'Symbol',
      sortable: true,
      enableRowGroup: true,
      filter: true,
      colId: 'Symbol'
    },
    {
      field: 'Side',
      headerName: 'Side',
      sortable: true,
      enableRowGroup: true,
      filter: true,
      width: 100,
      colId: 'Side'
    }
  ];
};

function currencyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(params.value);
}

export const FormatDate = (date: any, format: string) => {
  return moment(date).format(format);
};
