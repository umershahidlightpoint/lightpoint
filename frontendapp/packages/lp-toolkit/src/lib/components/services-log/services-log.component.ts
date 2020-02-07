import { Component, TemplateRef, OnInit, AfterViewInit, Input, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { TemplateRendererComponent } from '../template-renderer/template-renderer.component';
import { GridUtils } from '../../utils/index';

@Component({
  selector: 'lp-services-log',
  templateUrl: './services-log.component.html',
  styleUrls: ['./services-log.component.scss']
})
export class ServicesLogComponent implements OnInit, AfterViewInit {
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<any>;

  @Input() getLogsUrl: string;
  @Input() downloadFileUrl: string;

  gridOptions: GridOptions;
  logs: Log[];

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
      onGridReady: () => {
        this.gridOptions.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        GridUtils.autoSizeAllColumns(params);
        params.api.sizeColumnsToFit();
      },
      enableFilter: true,
      animateRows: true,
      alignedGrids: [],
      suppressHorizontalScroll: true,
      suppressColumnVirtualisation: true
    } as GridOptions;
  }

  setColDefs() {
    const colDefs: Array<ColDef | ColGroupDef> = [
      {
        field: 'FileName',
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
    return this.http.get(this.getLogsUrl).pipe(map((response: Response<Log>) => response));
  }

  getFiles() {
    this.getDataFromAPI().subscribe(result => {
      this.logs = result.payload.map(item => ({
        FileName: item.FileName
      }));
      this.gridOptions.api.setRowData(this.logs);
    });
    this.setColDefs();
  }

  downloadFile(params) {
    const fileName = params.FileName;
    this.getLogFile(fileName).subscribe(file => {
      const blob = new Blob([file], { type: 'text/csv' });
      const element = document.createElement('a');
      element.href = URL.createObjectURL(blob);
      element.download = fileName + '.txt';
      document.body.appendChild(element);
      element.click();
    });
  }

  getLogFile(name): Observable<any> {
    const url = this.downloadFileUrl + name;
    return this.http.get(url, { responseType: 'text' });
  }
}
interface Log {
  FileName: string;
}

interface Response<T> {
  message: string;
  payload: T[];
  statusCode: number;
}
