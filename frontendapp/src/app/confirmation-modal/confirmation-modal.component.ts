import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.css']
})
export class ConfirmationModalComponent implements OnInit {
  @ViewChild('confirm') confirmModal: ModalDirective;
  @Output() confirmDeletion = new EventEmitter<any>();

  constructor() {}

  ngOnInit() {}

  showModal() {
    this.confirmModal.show();
  }

  closeModal() {
    this.confirmModal.hide();
  }

  deleteLayout() {
    this.confirmDeletion.emit(true);
    this.confirmModal.hide();
  }
}
