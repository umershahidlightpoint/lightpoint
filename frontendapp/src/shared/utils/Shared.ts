import * as moment from 'moment';
import { GridOptions } from 'ag-grid-community';

export const SideBar = (id: number, name: string, gridInstance: GridOptions) => {
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

export const IgnoreFields: Array<string> = [
  'totalDebit',
  'totalCredit',
  'overall_count',
  'account_id',
  // 'value',
  'LpOrderId',
  //'LPOrderId',
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

export const ApplyRowStyles = params => {
  const rowColors = [
    { backgroundColor: '#B8B8B8', TextColor: '#000000' },
    { backgroundColor: '#C2C2C2', TextColor: '#000000' },
    { backgroundColor: '#D2D2D2', TextColor: '#000000' },
    { backgroundColor: '#E2E2E2', TextColor: '#000000' },
    { backgroundColor: '#F2F2F2', TextColor: '#000000' }
  ];
  if (params.node.group) {
    return {
      background: rowColors[params.node.level].backgroundColor,
      color: rowColors[params.node.level].TextColor
    };
  }
};

export const CalTotalRecords = (gridOptions: GridOptions) => {
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

export const CalTotal = (
  rows: Array<any>,
  fields: Array<{ name: string; total: number }>
): Array<{ name: string; total: number }> => {
  rows.forEach(row => {
    fields.map(field => {
      field.total += row[field.name];
    });
  });
  return fields;
};

export const GetDateRangeLabel = (startDate, endDate): string => {
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
    startDate = dateFilter.startDate !== '' ? moment(dateFilter.startDate) : null;
    endDate = dateFilter.endDate !== '' ? moment(dateFilter.endDate) : null;
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

export const DoesExternalFilterPass = (node, fund, startDate, endDate): boolean => {
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

export const HeightStyle = (height: number) => {
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
  const colDefs = gridColumnApi.getAllColumns();
  if (colDefs !== null) {
    gridColumnApi.getAllColumns().forEach(column => {
      allColumnIds.push(column.colId);
    });
    gridColumnApi.autoSizeColumns(allColumnIds);
  }
};

export const CommonCols = (isJournalGrid, filters = null) => {
  return [
    {
      field: 'id',
      minWidth: 50,
      headerName: 'Id',
      filter: isJournalGrid ? 'agNumberColumnFilter' : true,
      colId: 'id',
      rowGroup: false
    },
    {
      field: 'source',
      minWidth: 300,
      enableRowGroup: true,
      headerName: 'Source',
      filter: isJournalGrid ? 'agTextColumnFilter' : true,
      colId: 'source'
    },
    {
      field: 'fund',
      headerName: 'Fund',
      enableRowGroup: true,
      enablePivot: true,
      filter: filters !== null ? 'agSetColumnFilter' : true,
      width: 120,
      colId: 'fund',
      ...(filters !== null && {
        filterParams: {
          cellHeight: 20,
          values: filters.find(item => item.ColumnName === 'fund').Values,
          debounceMs: 1000
        }
      })
    },
    {
      field: 'AccountCategory',
      headerName: 'Category',
      enableRowGroup: true,
      rowGroup: false,
      width: 100,
      enablePivot: true,
      filter: filters !== null ? 'agSetColumnFilter' : true,
      colId: 'AccountCategory',
      ...(filters !== null && {
        filterParams: {
          cellHeight: 20,
          values: filters.find(item => item.ColumnName === 'AccountCategory').Values,
          debounceMs: 1000
        }
      })
    },
    {
      field: 'AccountType',
      headerName: 'Type',
      enableRowGroup: true,
      width: 200,
      enablePivot: true,
      filter: filters !== null ? 'agSetColumnFilter' : true,
      colId: 'AccountType',
      ...(filters !== null && {
        filterParams: {
          cellHeight: 20,
          values: filters.find(item => item.ColumnName === 'AccountType').Values,
          debounceMs: 1000
        }
      })
    },
    {
      field: 'accountName',
      headerName: 'Account Name',
      sortable: true,
      rowGroup: false,
      enableRowGroup: true,
      filter: filters !== null ? 'agSetColumnFilter' : true,
      colId: 'accountName',
      ...(filters !== null && {
        filterParams: {
          cellHeight: 20,
          values: filters.find(item => item.ColumnName === 'AccountName').Values,
          debounceMs: 1000
        }
      })
    },
    {
      field: 'accountDescription',
      headerName: 'Account Description',
      sortable: true,
      enableRowGroup: true,
      filter: isJournalGrid ? 'agTextColumnFilter' : true,
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
      filter: isJournalGrid ? 'agDateColumnFilter' : true,
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
      filter: isJournalGrid ? 'agNumberColumnFilter' : true,
      valueFormatter: BracketFormatter,
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
      valueFormatter: BracketFormatter,
      width: 100,
      colId: 'credit',
      filter: isJournalGrid ? 'agNumberColumnFilter' : true,
      cellStyle: { 'text-align': 'right' },
      cellClass: 'twoDecimalPlaces',
      cellClassRules: {
        // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
        redFont(params) {
          if (noColorCategories(params) || params.node.rowPinned) {
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
      valueFormatter: BracketFormatter,
      width: 100,
      colId: 'balance',
      filter: isJournalGrid ? 'agNumberColumnFilter' : true,
      cellStyle: { 'text-align': 'right' },
      cellClass: 'twoDecimalPlaces',
      cellClassRules: {
        // greenBackground: function (params) { if (params.node.rowPinned) return false; else return params.value > 300; },
        greenFont(params) {
          if (
            noColorCategories(params) ||
            params.data.AccountCategory === 'Asset' ||
            params.data.AccountCategory === 'Liability' ||
            params.node.rowPinned
          ) {
            return false;
          } else {
            return params.value > 0;
          }
        },
        redFont(params) {
          if (
            noColorCategories(params) ||
            params.data.AccountCategory === 'Asset' ||
            params.node.rowPinned
          ) {
            return false;
          } else if (params.data.AccountCategory === 'Liability') {
            return true;
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
      valueFormatter: moneyFormatter,
      colId: 'Quantity',
      headerName: 'Quantity',
      sortable: true,
      enableRowGroup: true,
      filter: isJournalGrid ? 'agNumberColumnFilter' : true,
      type: 'numericColumn'
    },

    {
      field: 'TradeCurrency',
      width: 100,
      headerName: 'Trade Ccy',
      sortable: true,
      enableRowGroup: true,
      filter: isJournalGrid ? 'agTextColumnFilter' : true,
      colId: 'TradeCurrency'
    },
    {
      field: 'SettleCurrency',
      headerName: 'Settle Ccy',
      sortable: true,
      enableRowGroup: true,
      filter: isJournalGrid ? 'agTextColumnFilter' : true,
      width: 100,
      colId: 'SettleCurrency'
    },
    {
      field: 'Symbol',
      headerName: 'Symbol',
      sortable: true,
      enableRowGroup: true,
      filter: filters !== null ? 'agSetColumnFilter' : true,
      colId: 'Symbol',
      ...(filters !== null && {
        filterParams: {
          cellHeight: 20,
          values: filters.find(item => item.ColumnName === 'symbol').Values,
          debounceMs: 1000
        }
      })
    },
    {
      field: 'Side',
      headerName: 'Side',
      sortable: true,
      enableRowGroup: true,
      filter: isJournalGrid ? 'agTextColumnFilter' : true,
      width: 100,
      colId: 'Side'
    }
  ];
};

export function noColorCategories(params) {
  if (
    params.data.AccountCategory === 'Equity' ||
    params.data.AccountCategory === 'Revenues' ||
    params.data.AccountCategory === 'Expenses'
  ) {
    return true;
  }
  return false;
}

export const FormatNumber2 = (numberToFormat: number) => {
  if (numberToFormat !== null) {
    return numberToFormat.toFixed(2);
  }
};

export const FormatNumber4 = (numberToFormat: number) => {
  if (numberToFormat !== null) {
    return numberToFormat.toFixed(4);
  }
};

export function priceFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return FormatNumber4(params.value);
}

export const MoneyFormat = (numberToFormat: number) => {
  if (numberToFormat !== null) {
    return numberToFormat.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
  }
};

export function BracketFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  if (
    (params.data.AccountCategory === 'Equity' ||
      params.data.AccountCategory === 'Revenues' ||
      params.data.AccountCategory === 'Expenses') &&
    params.value < 0
  ) {
    return '( ' + MoneyFormat(Math.abs(params.value)) + ' )';
  }
  return MoneyFormat(params.value);
}

export function moneyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return MoneyFormat(params.value);
}

export const CommaSeparatedFormat = (numberToFormat: number) => {
  return numberToFormat === 0
    ? '0.00'
    : Math.floor(numberToFormat)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export function commaFormater(params) {
  if (params.value === undefined) {
    return;
  }
  return CommaSeparatedFormat(params.value);
}

export const FormatDate = (date: any, format: string) => {
  return moment(date).format(format);
};

export const DateFormatter = dateToFormat => {
  return moment(dateToFormat).format('YYYY-MM-DD');
};

export const PercentageFormatter = (value: number) => {
  return value * 100;
};
