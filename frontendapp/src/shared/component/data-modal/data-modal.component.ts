/* Core/Libraries */
import {
  Component,
  OnInit,
  ViewChild,
  Output,
  Input,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-data-modal',
  templateUrl: './data-modal.component.html',
  styleUrls: ['./data-modal.component.css']
})
export class DataModalComponent implements OnInit, OnDestroy {
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();
  @Input() orderId: string;
  @Input() title: string = 'Data Details';

  tableData: any;
  backdrop: any;

  styleForHight = {
    //marginTop: '20px',
    width: '100%',
    //height: 'calc(100vh - 200px)',
    boxSizing: 'border-box'
  };

  containerDiv = {
    borderLeft: '1px solid #cecece',
    borderRight: '1px solid #cecece',
    width: '100%',
    //height: 'calc(100vh - 320px)',
    boxSizing: 'border-box',
    overflow: 'overlay'
  };

  constructor() {}

  ngOnInit() {}

  /*
  open the modal passing in the row details
  */
  openModal(row: any) {
    const data = row.data;
    const columns = row.columnApi.columnController.columnDefs;
    // name, value
    this.tableData = columns.map(i => ({ name: i.headerName, value: data[i.field] }));

    this.modal.show();
  }

  closeModal() {
    this.modal.hide();
  }

  ngOnDestroy() {}
}
