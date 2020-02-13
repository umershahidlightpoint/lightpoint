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
  @Output() confirmDeletion = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  showModal() {
    this.confirmationModal.show();
  }

  closeModal() {
    this.confirmationModal.hide();
  }

  delete() {
    this.confirmDeletion.emit(true);
    this.confirmationModal.hide();
  }
}
