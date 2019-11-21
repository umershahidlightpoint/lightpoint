import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { AgGridUtils } from '../../../shared/utils/ag-grid-utils';
import { DataService } from 'src/shared/common/data.service';
import { SideBar, AutoSizeAllColumns, FormatNumber4, CommaSeparatedFormat } from 'src/shared/utils/Shared';
import { PostingEngineService } from 'src/shared/common/posting-engine.service';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { DataDictionary } from 'src/shared/utils/DataDictionary';

import { Observable } from 'rxjs';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.css']
})
export class JournalsComponent implements OnInit, OnChanges {
  @Input() subscription: Observable<string>;
  @Input() title: string = "Journals";

  public journalsGridOptions: GridOptions;
  public journalsData: [];
  columnDefs = [];
  journalsTradesData: any;

  constructor(
    private financeService: FinancePocServiceProxy,
    private dataService: DataService,
    private agGridUtils: AgGridUtils,
    private dataDictionary: DataDictionary
  ) {
    this.initGrid();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.subscription == null) {
      this.dataService.allocationId.subscribe(data => {
        if (data != null) {
          this.getTradeJournals(data);
        }
      });
    } else {
      debugger;
      this.subscription.subscribe(data => {
        if (data != null) {
          this.getTradeJournals(data);
        }
      });
    }
  }

  ngOnInit() {
    if (this.subscription == null) {
      this.dataService.allocationId.subscribe(data => {
        if (data != null) {
          this.getTradeJournals(data);
        }
      });
    } else {
      debugger;
      this.subscription.subscribe(data => {
        if (data != null) {
          this.getTradeJournals(data);
        }
      });
    }
  }

  initGrid() {
    this.journalsGridOptions = {
      rowData: null,
      columnDefs: this.columnDefs,
      //onCellDoubleClicked: this.openModal.bind(this),
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      onGridReady: () => {
        // this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);

        // params.api.sizeColumnsToFit();
      },
      suppressColumnVirtualisation: true,
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false
    } as GridOptions;
    this.journalsGridOptions.sideBar = SideBar(
      GridId.journalsId,
      GridName.journals,
      this.journalsGridOptions
    );
  }

  getTradeJournals(lpOrderId) {
    this.financeService.getTradeJournals(lpOrderId).subscribe(result => {
      this.journalsTradesData = result;
      const someArray = this.agGridUtils.columizeData(
        result.data,
        this.journalsTradesData.meta.Columns
      );

      let columnDefs = [
        this.dataDictionary.column('when'),
        this.dataDictionary.column('event'),
        this.dataDictionary.column('debit'),
        this.dataDictionary.column('credit'),
        this.dataDictionary.column('balance'),
        this.dataDictionary.column('end_price'),
        this.dataDictionary.column('start_price'),
        {
          field: 'AccountCategory',
          width: 120,
          headerName: 'Category',
          enableRowGroup: true,
          sortable: true,
          filter: true,
        },
        {
          field: 'AccountType',
          width: 120,
          headerName: 'Type',
          enableRowGroup: true,
          sortable: true,
          filter: true,
        },
        {
          field: 'AccountName',
          width: 120,
          headerName: 'Account Name',
          enableRowGroup: true,
          sortable: true,
          filter: true,
        },
        {
          field: 'AccountDescription',
          width: 120,
          headerName: 'Account Description',
          enableRowGroup: true,
          sortable: true,
          filter: true,
        },
        {
          field: 'fund',
          width: 120,
          headerName: 'Fund',
          enableRowGroup: true,
          sortable: true,
          filter: true,
        },
      ];
      const cdefs = this.agGridUtils.customizeColumns(columnDefs, this.journalsTradesData.meta.Columns, [
        'account_id',
        'id',
        'value',
        'source',
        'generated_by',
        'Id',
        'AllocationId',
        'EMSOrderId'
      ]);
      this.journalsGridOptions.api.setColumnDefs(cdefs);
      this.journalsData = someArray as [];
    });
  }
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

