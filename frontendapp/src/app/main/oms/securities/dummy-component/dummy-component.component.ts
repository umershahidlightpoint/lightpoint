import { Component, OnInit, ViewChild } from '@angular/core';
import { CreateSecurityComponent } from './../../../../../shared/Modal/create-security/create-security.component';


@Component({
  selector: 'app-dummy-component',
  templateUrl: './dummy-component.component.html',
  styleUrls: ['./dummy-component.component.scss']
})
export class DummyComponentComponent implements OnInit {

  @ViewChild('securityModal', { static: false }) securityModal: CreateSecurityComponent;

  constructor() { }

  ngOnInit() {
  }

  openSecurityModal() {
    this.securityModal.openModal(null);
  }

  closeSecurityModal() {
  }

}
