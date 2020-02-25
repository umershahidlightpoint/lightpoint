import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { ModalFooterConfig } from '../../models/modal-footer-config';

@Component({
  selector: 'lp-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit, OnChanges {
  @Input() size: 'small' | 'large' | 'extra-large';
  @Input() showCloseButton = false;
  @Input() showFooter = true;

  @Input() title = 'LP Modal';

  @Input() footerConfig: ModalFooterConfig;

  @Output() closed = new EventEmitter<void>();
  @Output() confirmed = new EventEmitter<void>();
  @Output() canceled = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  @ViewChild('lpModal', { static: false }) lpModal: ModalDirective;

  public modalFooterConfig: ModalFooterConfig = {
    showConfirmButton: false,
    confirmButtonText: 'Confirm',
    confirmButtonIcon: 'fa-check-square',
    confirmButtonDisabledState: false,
    confirmButtonLoadingState: false,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    cancelButtonIcon: 'fa-times',
    cancelButtonDisabledState: false,
    cancelButtonLoadingState: false,
    showDeleteButton: false,
    deleteButtonText: 'Delete',
    deleteButtonIcon: 'fa-trash',
    deleteButtonDisabledState: false,
    deleteButtonLoadingState: false
  };

  public config = {
    backdrop: 'static'
  };

  constructor() {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    for (const propName in changes) {
      if (changes.hasOwnProperty(propName)) {
        switch (propName) {
          case 'footerConfig': {
            this.modalFooterConfig = {
              ...this.modalFooterConfig,
              ...changes.footerConfig.currentValue
            };
            break;
          }
        }
      }
    }
  }

  onClose() {
    this.hideModal();
    this.closed.emit();
  }

  onConfirm() {
    this.confirmed.emit();
  }

  onCancel() {
    this.hideModal();
    this.canceled.emit();
  }

  onDelete() {
    this.deleted.emit();
  }

  showModal(): void {
    this.lpModal.show();
  }

  hideModal(): void {
    this.lpModal.hide();
  }
}
