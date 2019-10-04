import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { GridOptions } from 'ag-grid-community';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { FinancePocServiceProxy } from 'src/shared/service-proxies/service-proxies';

@Component({
  selector: 'app-grid-utils',
  templateUrl: './grid-utils.component.html',
  styleUrls: ['./grid-utils.component.css']
})
export class GridUtilsComponent implements OnInit {
  @Input('gridOptions') gridOptions: GridOptions;
  @Input('excelParams') excelParams: any;
  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private financeService: FinancePocServiceProxy,
    private downloadExcelUtils: DownloadExcelUtils
  ) {}

  ngOnInit() {}

  setGroupingStateForFiles(value: boolean) {
    this.gridOptions.api.forEachNode((node, index) => {
      if (node.group) {
        node.setExpanded(value);
      }
    });
  }

  refreshGrid() {
    this.refresh.emit();
  }

  onBtExportFiles() {
    this.gridOptions.api.exportDataAsExcel(this.excelParams);
    this.downloadExcelUtils.ToastrMessage();
  }
}
