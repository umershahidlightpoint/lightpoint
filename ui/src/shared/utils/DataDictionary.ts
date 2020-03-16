// tslint:disable: forin
// tslint:disable: triple-equals
import { Injectable } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { ColDef, ColGroupDef } from 'ag-grid-community';
import { AgGridUtils } from './AgGridUtils';
import { priceFormatter, moneyFormatter, PercentageFormatter } from 'src/shared/utils/Shared';

@Injectable()
export class DataDictionary {
  constructor(private agGridUtils: AgGridUtils, private decimalPipe: DecimalPipe) {}

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
          valueFormatter: moneyFormatter
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
          valueFormatter: this.priceFormatterEx.bind(this)
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
          valueFormatter: this.priceFormatterEx.bind(this)
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

  priceFormatterEx(params) {
    if (params.value === undefined) {
      return;
    }

    return this.numberFormatter(params.value, false, '1.8-8');
  }

  numberFormatter(numberToFormat, isInPercentage?: boolean, digitsInfo: string = '1.2-2'): string {
    let per = numberToFormat;
    if (isInPercentage) {
      per = PercentageFormatter(numberToFormat);
    }
    const formattedValue = this.decimalPipe.transform(per, digitsInfo);
    return formattedValue.toString();
  }

  getTradeJournalColDefs(columns): Array<ColDef | ColGroupDef> {
    const colDefs: Array<ColDef> = [
      this.column('debit', false),
      this.column('credit', false),
      this.column('balance', false),
      this.column('when', false),
      this.column('event', false),
      this.column('end_price', false),
      this.column('start_price', false),
      {
        field: 'fund',
        headerName: 'Fund',
        enableRowGroup: true,
        sortable: true,
        filter: true
      },
      {
        field: 'AccountCategory',
        width: 120,
        headerName: 'Category',
        enableRowGroup: true,
        sortable: true,
        filter: true
      },
      {
        field: 'AccountType',
        width: 120,
        headerName: 'Type',
        rowGroup: true,
        enableRowGroup: true,
        sortable: true,
        filter: true
      },
      {
        field: 'AccountName',
        width: 120,
        headerName: 'Account Name',
        enableRowGroup: true,
        sortable: true,
        filter: true
      },
      {
        field: 'AccountDescription',
        width: 120,
        headerName: 'Account Description',
        enableRowGroup: true,
        sortable: true,
        filter: true
      }
    ];

    return this.agGridUtils.customizeColumns(
      colDefs,
      columns,
      ['account_id', 'id', 'value', 'source', 'generated_by', 'Id', 'AllocationId', 'EMSOrderId'],
      false
    );
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
