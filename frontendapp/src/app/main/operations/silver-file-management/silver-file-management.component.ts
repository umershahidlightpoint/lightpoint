import {
  Component,
  TemplateRef,
  ElementRef,
  OnInit,
  ViewChild,
  OnDestroy,
  Output
} from '@angular/core';
import { FinancePocServiceProxy } from '../../../../shared/service-proxies/service-proxies';
import { GridOptions } from 'ag-grid-community';
import { takeWhile } from 'rxjs/operators';
import { TemplateRendererComponent } from '../../../template-renderer/template-renderer.component';
import { SilverFile } from 'src/shared/models/silverFile';
import { SideBar, Style, AutoSizeAllColumns } from 'src/shared/utils/Shared';
import { GridLayoutMenuComponent } from 'src/shared/Component/grid-layout-menu/grid-layout-menu.component';
import { ToastrService } from 'ngx-toastr';
import { DataService } from 'src/shared/common/data.service';
import { GridId, GridName } from 'src/shared/utils/AppEnums';
import { GetContextMenu } from 'src/shared/utils/ContextMenu';
import { DownloadExcelUtils } from 'src/shared/utils/DownloadExcelUtils';

@Component({
  selector: 'app-silver-file-management',
  templateUrl: './silver-file-management.component.html',
  styleUrls: ['./silver-file-management.component.css']
})
export class SilverFileManagementComponent implements OnInit, OnDestroy {
  @ViewChild('actionButtons') actionButtons: TemplateRef<any>;
  @ViewChild('divToMeasure') divToMeasureElement: ElementRef;

  filesGridOptions: GridOptions;
  files: SilverFile[];
  isSubscriptionAlive: boolean;

  excelParams = {
    fileName: 'Silver File',
    sheetName: 'First Sheet',
    columnKeys: ['name', 'uploadDate', 'size']
  };

  style = Style;

  styleForLogsHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 220px)',
    boxSizing: 'border-box'
  };

  constructor(
    private financeService: FinancePocServiceProxy,
    private dataService: DataService,
    private downloadExcelUtils: DownloadExcelUtils,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.isSubscriptionAlive = true;
    this.initGrid();
    this.getSilverFiles();
  }

  initGrid() {
    const columnDefsForFiles = [
      {
        field: 'name',
        headerName: 'Name',
        sortable: true,
        filter: true,
        resizable: true
      },
      {
        field: 'uploadDate',
        headerName: 'Upload Date',
        sortable: true,
        filter: true,
        enableRowGroup: true,
        resizable: true
      },
      {
        field: 'size',
        headerName: 'Size',
        resizable: true
      },
      {
        headerName: 'View',
        cellRendererFramework: TemplateRendererComponent,
        cellRendererParams: {
          ngTemplate: this.actionButtons
        }
      }
    ];
    this.filesGridOptions = {
      rowData: null,
      sideBar: SideBar,
      columnDefs: columnDefsForFiles,
      frameworkComponents: { customToolPanel: GridLayoutMenuComponent },
      onGridReady: params => {},
      onFirstDataRendered: params => {
        AutoSizeAllColumns(params);
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: false,
      suppressColumnVirtualisation: true
    } as GridOptions;
    this.filesGridOptions.sideBar = SideBar(
      GridId.silverFilesId,
      GridName.silverFiles,
      this.filesGridOptions
    );
    // this.dataService.changeMessage(this.filesGridOptions);
    // this.dataService.changeGrid({ gridId: GridId.silverFilesId, gridName: GridName.silverFiles });
  }

  getSilverFiles() {
    this.financeService
      .getSilverFiles()
      .pipe(takeWhile(() => this.isSubscriptionAlive))
      .subscribe(result => {
        this.files = result.payload.map(item => ({
          name: item.Name,
          uploadDate: item.UploadDate,
          size: item.Size
        }));
        this.filesGridOptions.api.setRowData(this.files);
      });
  }

  refreshFilesGrid() {
    this.filesGridOptions.api.showLoadingOverlay();
    this.getSilverFiles();
  }

  getContextMenuItems = params => {
    return GetContextMenu(true, null, true, null, params);
  };

  downloadFile(file) {}

  ngOnDestroy() {
    this.isSubscriptionAlive = false;
  }
}
