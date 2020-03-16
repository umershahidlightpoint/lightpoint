/* Core/Libraries */
import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { ModalComponent } from 'lp-toolkit';

@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.scss']
})
export class DataModalComponent implements OnInit, AfterViewInit {
  @ViewChild('lpModal', { static: false }) lpModal: ModalComponent;

  @Input() title = 'Data Details';
  @Input() isCustomData = false;

  @Output() closed = new EventEmitter<void>();

  tableData: any[] = [];
  customTableData: any[] = [];

  constructor() {}

  ngOnInit() {}

  ngAfterViewInit() {
    // this.lpModal.onHidden.subscribe(e => {
    //   this.customTableData = [];
    // });
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

    this.lpModal.showModal();
  }

  onClose() {
    this.customTableData = [];
    this.closed.emit();
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
