import { Component, OnInit, EventEmitter, Input, ViewChild, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-date-picker-modal',
  templateUrl: './date-picker-modal.component.html',
  styleUrls: ['./date-picker-modal.component.css']
})
export class DatePickerModalComponent implements OnInit {
  @Input('modalTitle') title: string;
  @Input('modalDescription') description = 'Are you really sure?';
  @ViewChild('confirm') confirm: ModalDirective;
  @Output() dateSelected = new EventEmitter<any>();
  selectedDate = null;
  agGridParams = null;
  constructor() { }

  ngOnInit() {
  }

  showModal(params) {
    this.agGridParams = params;
    this.confirm.show();
  }

  closeModal() {
    this.confirm.hide();
  }

  delete() {
    this.confirm.hide();
  }

  changeDate(date) {
    let obj = {
      selectedDate: date.startDate,
      params : this.agGridParams
    }
    this.dateSelected.emit(obj);
    this.confirm.hide();
  }

}
