import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { Observable } from 'rxjs';
import { GridLayoutMenuComponent } from 'lp-toolkit';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { DataService } from 'src/services/common/data.service';
import { FinanceServiceProxy } from '../../../services/service-proxies';
import { AgGridUtils } from '../../../shared/utils/AgGridUtils';
import { DataDictionary } from 'src/shared/utils/DataDictionary';
import { SideBar, AutoSizeAllColumns } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-journals',
  templateUrl: './journals.component.html',
  styleUrls: ['./journals.component.scss']
})
export class JournalsComponent implements OnInit, OnChanges {
  @Input() subscription: Observable<string>;
  @Input() title = 'Journals';

  public journalsGridOptions: GridOptions;
  public journalsData: [];
  columnDefs: Array<ColDef | ColGroupDef>;
  journalsTradesData: any;

  constructor(
    private financeService: FinanceServiceProxy,
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
      this.subscription.subscribe(data => {
        if (data != null) {
          this.getTradeJournals(data);
        }
      });
    }
  }

  initGrid() {
    this.journalsGridOptions = {
      rowData: [],
      columnDefs: this.columnDefs,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      getExternalFilterState: () => {
        return {};
      },
      onGridReady: () => {},
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
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

      const columnDefs = [
        this.dataDictionary.column('when', false),
        this.dataDictionary.column('event', false),
        this.dataDictionary.column('debit', false),
        this.dataDictionary.column('credit', false),
        this.dataDictionary.column('balance', false),
        this.dataDictionary.column('end_price', false),
        this.dataDictionary.column('start_price', false),
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
        },
        {
          field: 'fund',
          width: 120,
          headerName: 'Fund',
          enableRowGroup: true,
          sortable: true,
          filter: true
        }
      ];
      const cdefs = this.agGridUtils.customizeColumns(
        columnDefs,
        this.journalsTradesData.meta.Columns,
        ['account_id', 'id', 'value', 'source', 'generated_by', 'Id', 'AllocationId', 'EMSOrderId'],
        false
      );
      this.journalsGridOptions.api.setColumnDefs(cdefs);
      this.journalsData = someArray as [];
    });
  }
}
