import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { interval, from, timer } from 'rxjs';
import { map, concatMap, filter, take } from 'rxjs/operators';
import * as moment from 'moment';

export const API_BASE_URL = environment.remoteServerUrl;
export const REF_DATA_BASE_URL = environment.referenceDataUrl;

@Injectable()
export class AgGridUtils {
  columizeData(data: any, columns:any) {
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
  constructor() {
  }


  /*
  Take the original Defs and append to them and then return the result
  */
  customizeColumns(colDefs:any, columns: any, ignoreFields:any) {

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
          clone.filter = column.filter;
          clone.colId = undefined;
          if (
            column.Type == 'System.Int32' ||
            column.Type == 'System.Decimal' ||
            column.Type == 'System.Double'
          ) {
            clone.cellStyle = { 'text-align': 'right' };
            clone.cellClass = 'twoDecimalPlaces';
            clone.valueFormatter = currencyFormatter;
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
}

function currencyFormatter(params) {
  return formatNumber(params.value);
}

function formatNumber(numberToFormat) {
  return numberToFormat === 0
    ? ''
    : Math.floor(numberToFormat)
        .toString()
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
