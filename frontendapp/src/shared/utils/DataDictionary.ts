// tslint:disable: forin
// tslint:disable: triple-equals
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as moment from 'moment';
import { FormatNumber4, CommaSeparatedFormat } from 'src/shared/utils/Shared';

@Injectable()
export class DataDictionary {
    constructor() { }

    public column(field: string) {
        let columnDefinition = {};

        switch (field) {
            case 'when': {
                columnDefinition = {
                    field: 'when',
                    width: 120,
                    headerName: 'When',
                    enableRowGroup: true,
                    sortable: true,
                    filter: true,
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
                    filter: true,
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
                    filter: true,
                    valueFormatter: priceFormatter
                };
                break;
            };
            case 'NetPrice': {
                columnDefinition = {
                    field: 'NetPrice',
                    width: 120,
                    headerName: 'Net Price',
                    sortable: true,
                    cellStyle: { 'text-align': 'right' },
                    filter: true,
                    valueFormatter: priceFormatter
                };
                break;
            };
            case 'SettleNetPrice': {
                columnDefinition = {
                    field: 'SettleNetPrice',
                    width: 120,
                    headerName: 'SettleNet Price',
                    sortable: true,
                    cellStyle: { 'text-align': 'right' },
                    filter: true,
                    valueFormatter: priceFormatter
                };
                break;
            };

            case 'start_price': {
                columnDefinition = {
                    field: 'start_price',
                    width: 120,
                    headerName: 'Start Price',
                    sortable: true,
                    cellStyle: { 'text-align': 'right' },
                    filter: true,
                    valueFormatter: priceFormatter
                };
                break;
            };
            case 'end_price': {
                columnDefinition = {
                    field: 'end_price',
                    width: 120,
                    headerName: 'End Price',
                    sortable: true,
                    cellStyle: { 'text-align': 'right' },
                    filter: true,
                    valueFormatter: priceFormatter
                };
                break;
            };
            case 'balance': {
                columnDefinition = {
                    field: 'balance',
                    width: 120,
                    headerName: 'Exposure(at Cost)',
                    sortable: true,
                    filter: true,
                    cellStyle: { 'text-align': 'right' },
                    valueFormatter: valueFormatter
                };
                cellClassRules(columnDefinition);
                break;
            };
            case 'credit': {
                columnDefinition = {
                    field: 'credit',
                    width: 120,
                    headerName: 'Credit',
                    sortable: true,
                    cellStyle: { 'text-align': 'right' },
                    filter: true,
                    valueFormatter: valueFormatter
                };
                cellClassRules(columnDefinition);
                break;
            };
            case 'debit': {
                columnDefinition = {
                    field: 'debit',
                    width: 120,
                    headerName: 'Debit',
                    sortable: true,
                    filter: true,
                    cellStyle: { 'text-align': 'right' },
                    valueFormatter: valueFormatter
                };
                cellClassRules(columnDefinition);
                break;
            };
            default: {
                break;
            };
        }

        return columnDefinition;
    }
}

function cellClassRules(columnDefinition: any) {
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

function valueFormatter(params) {
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
    }
}

