// tslint:disable: forin
// tslint:disable: triple-equals
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { moneyFormatter } from './Shared';

@Injectable()
export class AgGridUtils {
  baseUrl: string;
  refDataUrl: string;

  constructor() {
    this.baseUrl = window['config'].remoteServerUrl;
    this.refDataUrl = window['config'].referenceDataUrl;
  }

  columizeData(data: any, columns: any) {
    const someArray = [];

    for (const item in data) {
      const someObject = {};
      for (const i in columns) {
        const field = columns[i].field;
        if (columns[i].Type == 'System.DateTime') {
          someObject[field] = moment(data[item][field]).format('MM-DD-YYYY');
        } else {
          someObject[field] = data[item][field];
        }
      }
      someArray.push(someObject);
    }

    return someArray;
  }

  /*
  Take the original Defs and append to them and then return the result
  */
  customizeColumns(
    colDefs: any,
    columns: any,
    ignoreFields: any,
    isJournalGrid,
    filterData: any = [],
    sumFields: any = ['debit', 'credit', 'balance']
  ) {
    const cdefs = Object.assign([], colDefs);

    for (const i in columns) {
      const column = columns[i];
      // Check to see if it's an ignored field
      if (ignoreFields.filter(i => i == column.field).length == 0) {
        // Check to see if we have not already defined it
        if (cdefs.filter(i => i.field == column.field).length == 0) {
          const clone = { ...colDefs[0] };
          clone.field = column.field;
          clone.headerName = column.headerName;
          clone.filter = (() => {
            if (
              isJournalGrid &&
              (column.Type == 'System.Int32' ||
                column.Type == 'System.Decimal' ||
                column.Type == 'System.Double')
            ) {
              return 'agNumberColumnFilter';
            }

            if (isJournalGrid && column.Type == 'System.String') {
              return 'agTextColumnFilter';
            }

            if (isJournalGrid && column.Type == 'System.DateTime') {
              return 'agDateColumnFilter';
            }

            return column.filter;
          })();

          clone.colId = column.field;
          clone.valueFormatter = null;
          clone.cellStyle = null;

          // Assume all columns are sortable
          clone.sortable = true;
          if (
            column.Type == 'System.Int32' ||
            column.Type == 'System.Decimal' ||
            column.Type == 'System.Double'
          ) {
            if (sumFields.filter(i => i == column.field).length > 0) {
              clone.aggFunc = 'sum';
            } else {
              clone.aggFunc = values => {
                return 0;
              };
            }

            clone.cellStyle = { 'text-align': 'right' };
            if (!column.field.toLowerCase().endsWith('id')) {
              clone.cellClass = 'twoDecimalPlaces';
              clone.valueFormatter = moneyFormatter;
              clone.cellClassRules = {
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
              };
            }
          } else if (column.Type == 'System.DateTime') {
            clone.enableRowGroup = true;
            clone.cellStyle = { 'text-align': 'right' };
            clone.cellClass = 'twoDecimalPlaces';
            clone.minWidth = 50;
          } else {
            clone.enableRowGroup = true;
          }
          cdefs.push(clone);
        }
      }
    }
    return cdefs;
  }

  disableColumnFilters(colDefs: any, disabledFilterList: any) {
    const filteredCols = colDefs.filter(
      x => disabledFilterList.includes(x.colId) || disabledFilterList.includes(x.field)
    );
    filteredCols.map(x => (x.filter = false));
    return colDefs;
  }
}
