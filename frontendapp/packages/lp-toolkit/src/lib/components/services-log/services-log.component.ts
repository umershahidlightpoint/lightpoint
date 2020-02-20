import { Component, OnInit, AfterViewInit, ViewChild, TemplateRef, Input } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { GridOptions, ColDef, ColGroupDef } from 'ag-grid-community';
import { TemplateRendererComponent } from '../template-renderer/template-renderer.component';

@Component({
  selector: 'lp-services-log',
  templateUrl: './services-log.component.html',
  styleUrls: ['./services-log.component.scss']
})
export class ServicesLogComponent implements OnInit, AfterViewInit {
  @ViewChild('actionButtons', { static: false }) actionButtons: TemplateRef<any>;

  @Input() getLogsUrl: string;
  @Input() downloadFileUrl: string;

  public gridOptions: GridOptions;
  public logs: Log[];

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
      onGridReady: params => {
        this.setColDefs();
        params.api.sizeColumnsToFit();
      },
      onFirstDataRendered: params => {
        params.api.sizeColumnsToFit();
      },
      animateRows: true,
      enableFilter: true,
      suppressHorizontalScroll: true,
      suppressColumnVirtualisation: true
    };
  }

  setColDefs() {
    const colDefs: Array<ColDef | ColGroupDef> = [
      {
        field: 'FileName',
        headerName: 'File Name',
        enableRowGroup: true,
        sortable: true,
        filter: true,
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

  getDataFromAPI(): Observable<Response<Log>> {
    return this.http.get(this.getLogsUrl).pipe(map((response: Response<Log>) => response));
  }

  getFiles() {
    this.getDataFromAPI().subscribe(
      response => {
        this.logs = response.payload.map(item => ({
          FileName: item.FileName
        }));
        this.gridOptions.api.setRowData(this.logs);
      },
      error => {}
    );
  }

  getLogFile(fileName): Observable<any> {
    const url = this.downloadFileUrl + fileName;

    return this.http.get(url, { responseType: 'text' });
  }

  downloadFile(params) {
    const fileName = params.FileName;

    this.getLogFile(fileName).subscribe(response => {
      const blob = new Blob([response], { type: 'text/csv' });
      const element = document.createElement('a');

      element.href = URL.createObjectURL(blob);
      element.download = fileName + '.txt';
      document.body.appendChild(element);
      element.click();
    });
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
