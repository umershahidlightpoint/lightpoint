import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { FinancePocServiceProxy } from '../../../shared/service-proxies/service-proxies';

@Component({
  selector: 'app-legder-modal',
  templateUrl: './legder-modal.component.html',
  styleUrls: ['./legder-modal.component.css']
})
export class LegderModalComponent implements OnInit {

  active = false;
  @ViewChild('modal') modal: ModalDirective;
  @Output() modalClose = new EventEmitter<any>();
  constructor(private _Service: FinancePocServiceProxy) { }

  ngOnInit() {
  }
  onShown() {

  }
  show() {
    this.active = true;
    this.modal.show();
  }
  close() {
    this.active = false;
    this.modalClose.emit(true);
    this.modal.hide();
  }
}
