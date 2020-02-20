import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'lp-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @ViewChild('confirmationModal', { static: false }) confirmationModal: ModalDirective;

  @Input() title: string;
  @Input() description = 'Are you really sure?';
  @Output() confirmed = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  onConfirmed() {
    this.confirmed.emit(true);
    this.onCloseModal();
  }

  onCancelled() {
    this.cancelled.emit(true);
    this.onCloseModal();
  }

  showModal() {
    this.confirmationModal.show();
  }

  onCloseModal() {
    this.cancelled.emit(true);
    this.confirmationModal.hide();
  }
}
