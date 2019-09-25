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

export const CommaSeparatedFormat = numberToFormat => {
  return numberToFormat === 0
    ? '0.00'
    : Math.floor(numberToFormat)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};
