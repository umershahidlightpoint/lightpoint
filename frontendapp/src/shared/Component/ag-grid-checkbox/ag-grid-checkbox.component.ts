import { Component, OnInit } from '@angular/core';
import { AgRendererComponent } from 'ag-grid-angular';
import { IAfterGuiAttachedParams } from 'ag-grid-community';

@Component({
  selector: 'app-ag-grid-checkbox',
  templateUrl: './ag-grid-checkbox.component.html',
  styleUrls: ['./ag-grid-checkbox.component.scss']
})
export class AgGridCheckboxComponent implements AgRendererComponent {
  constructor() {}

  private params: any;

  agInit(params: any): void {
    this.params = params;
  }

  afterGuiAttached(params?: IAfterGuiAttachedParams): void {}

  refresh(params: any): boolean {
    params.data.estimated = params.value;
    params.api.refreshCells(params);
    params.colDef.customMethod(params);
    return false;
  }
}
