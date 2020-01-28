import { Component, TemplateRef, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TemplateRendererComponent } from '../../../template-renderer/template-renderer.component';
import { Log } from 'src/shared/models/log';
import { SideBar, Style, AutoSizeAllColumns, HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-services-log',
  templateUrl: './services-log.component.html',
  styleUrls: ['./services-log.component.scss']
})
export class ServicesLogComponent implements OnInit, AfterViewInit {

  // baseUrl = 'http://localhost:9092/api/log/files';
  // getFile = 'http://localhost:9092/api/log/download?path=';

  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<any>;

  @Input() title = 'Portfolio Accounting Services Log';
  @Input() gridId = 30;
  @Input() gridName = 'Services Log';

  @Input() baseUrl = window['config'].remoteServerUrl + '/log/files';
  @Input() geFile = window['config'].remoteServerUrl;

  gridOptions: GridOptions;
  logs: Log[];
  path: string;
  fileName: string;

  style = Style;

  styleForLogsHeight = HeightStyle(220);

  constructor(private http: HttpClient) {
     this.initGrid();
    }

  ngOnInit() {}

  ngAfterViewInit() {
    this.getFiles();
  }

  initGrid() {
    this.gridOptions = {
      rowData: null,
      getExternalFilterState: () => {
        return {};
      },
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

  }

  setColDefs() {
    const colDefs: Array<ColDef | ColGroupDef> = [
      {
        field: 'id',
        headerName: 'Id',
        hide: true
      },
      {
        field: 'fileName',
        headerName: 'File Name',
        sortable: true,
        filter: true,
        enableRowGroup: true,
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
    this.gridOptions.api.setColumnDefs(colDefs);
  }

 getDataFromAPI() {
  return this.http.get(this.baseUrl).pipe(map((response: any) => response));
}

  getFiles() {
    this.getDataFromAPI().subscribe(result => {
      this.logs = result.payload.map(item =>({
        id: item.id,
        fileName: item.FileName,
        filePath: item.FilePath,
        fileActionId: item.file_action_id,
        action: item.action,
      }));
      this.gridOptions.api.setRowData(this.logs);
    });
    this.setColDefs();
  }

  downloadFile(params) {

    const path = params.filePath;
    const fileName = params.fileName;
    this.getLogFile(path, fileName).subscribe(file => {
      const blob = new Blob([file], { type: 'text/csv' });
      const element = document.createElement('a');
      element.href = URL.createObjectURL(blob);
      element.download = fileName + '.txt';
      document.body.appendChild(element);
      element.click();
    });
}

getLogFile(path, name): Observable<any> {
  const url = this.geFile + '/log/download?path=' + path + '&fileName=' + name;
  return this.http.get(url, {responseType: 'text'});
}
}
