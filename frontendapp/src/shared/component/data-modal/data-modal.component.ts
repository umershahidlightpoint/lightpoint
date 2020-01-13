/* Core/Libraries */
import { Component, OnInit, AfterViewInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.css']
})
export class DataModalComponent implements OnInit, AfterViewInit {
  @ViewChild('modal', { static: false }) modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();
  @Input() orderId: string;
  @Input() title = 'Data Details';
  @Input() isCustomData = false;

  tableData: any[] = [];
  customTableData: any[] = [];
  backdrop: any;

  styleForHeight = HeightStyle(220);

  containerDiv = {
    borderLeft: '1px solid #cecece',
    borderRight: '1px solid #cecece',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'overlay'
  };

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit(){
    this.modal.onHidden.subscribe(e => {
      this.customTableData = [];
    })
  }

  /*
  Open the Modal Passing in the Row Details / Custom Data
  */
  openModal(row: any, cols: any, isCustomData: boolean = false) {
    if (!isCustomData) {
      this.mapGridData(row, cols);
    } else {
      this.mapCustomData(row);
    }

    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
    this.customTableData = [];
  }

  mapGridData(row: any, cols: any) {
    const data = row.data;
    const columns = row.columnApi.columnController.columnDefs;
    const columnStates = cols
      .filter(i => !i.hide)
      .map(i => ({
        field: i.colId,
        headerName: this.mapHeaderName(columns, i.colId)
      }));
    // Key Value Pair (Name, Value)
    this.tableData = columnStates.map(i => ({
      name: i.headerName,
      value: data[i.field]
    }));
  }

  mapCustomData(row: any) {
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        this.customTableData.push({
          name: key,
          value: row[key]
        });
      }
    }
  }

  mapHeaderName(columns: any, fieldId: any): string {
    let match: string;

    for (const obj of columns) {
      if (obj.field === fieldId) {
        match = obj.headerName;
        break;
      }
    }

    return match;
  }
}
