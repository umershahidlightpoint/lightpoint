import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ModalComponent, ModalFooterConfig } from 'lp-toolkit';

@Component({
  selector: 'app-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']
})
export class ConfirmationModalComponent implements OnInit {
  @ViewChild('lpModal', { static: false }) lpModal: ModalComponent;

  @Input() title = 'Confirm';
  @Input() description = 'Are you really sure?';

  @Output() confirmed = new EventEmitter<boolean>();
  @Output() canceled = new EventEmitter<boolean>();

  public footerConfig: ModalFooterConfig = {
    showConfirmButton: true
  };

  constructor() {}

  ngOnInit() {}

  showModal() {
    this.lpModal.showModal();
  }

  onCloseModal() {
    this.canceled.emit(true);
  }

  onConfirm() {
    this.confirmed.emit(true);
    this.lpModal.hideModal();
  }
}
