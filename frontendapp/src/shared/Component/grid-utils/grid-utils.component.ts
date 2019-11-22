import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';
import { FinanceServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { UtilsConfig } from 'src/shared/Models/utils-config';
import { AutoSizeAllColumns } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-grid-utils',
  templateUrl: './grid-utils.component.html',
  styleUrls: ['./grid-utils.component.css']
})
export class GridUtilsComponent implements OnInit {
  @Input() gridOptions: any;
  @Input() excelParams: any;
  @Input() utilsConfig: UtilsConfig = {
    expandGrid: true,
    collapseGrid: true,
    refreshGrid: true,
    resetGrid: true,
    exportExcel: true
  };
  @Output() refresh: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private financeService: FinanceServiceProxy,
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

  resetGrid() {
    this.gridOptions.columnApi.resetColumnState();
    this.gridOptions.columnApi.resetColumnGroupState();
    this.gridOptions.api.setSortModel(null);
    this.gridOptions.api.setFilterModel(null);
    this.gridOptions.clearExternalFilter();
    AutoSizeAllColumns(this.gridOptions);
  }

  onBtExportFiles() {
    this.gridOptions.api.exportDataAsExcel(this.excelParams);
    this.downloadExcelUtils.ToastrMessage();
  }
}
