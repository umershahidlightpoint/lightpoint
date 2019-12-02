// tslint:disable: forin
// tslint:disable: triple-equals
import { Injectable } from '@angular/core';
import {
  FormatNumber4,
  CommaSeparatedFormat,
  FormatNumber,
  MoneyFormat,
  PercentageFormatter
} from 'src/shared/utils/Shared';
import { DecimalPipe } from '@angular/common';

@Injectable()
export class DataDictionary {
  constructor(private decimalPipe: DecimalPipe) {}

  column(field: string, isJournalGrid: boolean) {
    let columnDefinition = {};

    switch (field) {
      case 'balance': {
        columnDefinition = {
          field: 'balance',
          width: 120,
          headerName: 'Exposure(at Cost)',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter
        };
        cellClassRules(columnDefinition);
        break;
      }
      case 'BusinessDate': {
        columnDefinition = {
          field: 'BusinessDate',
          width: 120,
          headerName: 'Business Date',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          cellStyle: { 'text-align': 'right' }
        };
        break;
      }
      case 'credit': {
        columnDefinition = {
          field: 'credit',
          width: 120,
          colId: 'credit',
          headerName: 'Credit',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          valueFormatter: moneyFormatter
        };
        cellClassRulesCredit(columnDefinition);
        break;
      }
      case 'Currency': {
        columnDefinition = {
          field: 'Currency',
          width: 120,
          headerName: 'Currency',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          cellStyle: { 'text-align': 'right' }
        };
        break;
      }
      case 'debit': {
        columnDefinition = {
          field: 'debit',
          width: 120,
          colId: 'debit',
          headerName: 'Debit',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: moneyFormatter
        };
        cellClassRulesDebit(columnDefinition);
        break;
      }
      case 'Event': {
        columnDefinition = {
          field: 'Event',
          width: 120,
          headerName: 'Event',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true
        };
        break;
      }
      case 'event': {
        columnDefinition = {
          field: 'event',
          width: 120,
          headerName: 'Event',
          enableRowGroup: true,
          sortable: true,
          filter: isJournalGrid ? 'agTextColumnFilter' : true
        };

        break;
      }
      case 'end_price': {
        columnDefinition = {
          field: 'end_price',
          width: 120,
          headerName: 'End Price',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          valueFormatter: priceFormatter
        };
        break;
      }
      case 'fxrate': {
        columnDefinition = {
          field: 'fxrate',
          width: 120,
          headerName: 'Fx Rate',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          cellStyle: { 'text-align': 'right' },
          valueFormatter: priceFormatter
        };
        break;
      }
      case 'LastUpdatedBy': {
        columnDefinition = {
          field: 'LastUpdatedBy',
          width: 120,
          headerName: 'LastUpdatedBy',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true
        };
        break;
      }

      case 'LastUpdatedOn': {
        columnDefinition = {
          field: 'LastUpdatedOn',
          width: 120,
          headerName: 'LastUpdatedOn',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true
        };
        break;
      }
      case 'NetPrice': {
        columnDefinition = {
          field: 'NetPrice',
          width: 120,
          headerName: 'Net Price',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          valueFormatter: priceFormatter
        };
        break;
      }
      case 'Price': {
        columnDefinition = {
          field: 'Price',
          width: 120,
          headerName: 'Price',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          cellStyle: { 'text-align': 'right' }
        };
        break;
      }
      case 'SettleNetPrice': {
        columnDefinition = {
          field: 'SettleNetPrice',
          width: 120,
          headerName: 'SettleNet Price',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          valueFormatter: priceFormatter
        };
        break;
      }

      case 'start_price': {
        columnDefinition = {
          field: 'start_price',
          width: 120,
          headerName: 'Start Price',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          valueFormatter: priceFormatter
        };
        break;
      }

      case 'symbol': {
        columnDefinition = {
          field: 'Symbol',
          width: 120,
          headerName: 'Symbol',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true
        };
        break;
      }
      case 'Symbol': {
        columnDefinition = {
          field: 'Symbol',
          width: 120,
          headerName: 'Symbol',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true
        };
        break;
      }
      case 'SecurityId': {
        columnDefinition = {
          field: 'SecurityId',
          width: 120,
          headerName: 'SecurityId',
          sortable: true,
          filter: isJournalGrid ? 'agNumberColumnFilter' : true
        };
        break;
      }
      case 'TradePrice': {
        columnDefinition = {
          field: 'TradePrice',
          width: 120,
          headerName: 'Trade Price',
          sortable: true,
          cellStyle: { 'text-align': 'right' },
          filter: isJournalGrid ? 'agNumberColumnFilter' : true,
          valueFormatter: priceFormatter
        };
        break;
      }
      case 'when': {
        columnDefinition = {
          field: 'when',
          width: 120,
          headerName: 'When',
          enableRowGroup: true,
          sortable: true,
          filter: isJournalGrid ? 'agDateColumnFilter' : true
        };
        break;
      }

      default: {
        break;
      }
    }

    return columnDefinition;
  }

  numberFormatter(numberToFormat, isInPercentage?: boolean): string {
    let per = numberToFormat;
    if (isInPercentage) {
      per = PercentageFormatter(numberToFormat);
    }
    const formattedValue = this.decimalPipe.transform(per, '1.2-2');
    return formattedValue.toString();
  }
}

export function cellClassRulesCredit(columnDefinition: any) {
  columnDefinition['cellClassRules'] = {
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
  };
}

export function cellClassRulesDebit(columnDefinition: any) {
  columnDefinition['cellClassRules'] = {
    footerRow(params) {
      if (params.node.rowPinned) {
        return true;
      } else {
        return false;
      }
    }
  };
}

export function moneyFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return MoneyFormat(params.value);
}

export function cellClassRules(columnDefinition: any) {
  columnDefinition['cellClassRules'] = {
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
  };
}

function priceFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  return FormatNumber4(params.value);
}

export function valueFormatter(params) {
  if (params.value === undefined) {
    return;
  }
  if (params.value === 0.0) {
    return;
  }

  return CommaSeparatedFormat(params.value);
}

function colorRules() {
  return {
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
  };
}
