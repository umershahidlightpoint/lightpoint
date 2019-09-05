import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-button-renderer',
  template: `
    <button type="button" style="width:100%;height:100%;padding:10px" (click)="onClick($event)">
      {{ label }}
    </button>
  `
  // template: `<button type="button" style="width:100%;height:100%;padding:10px" (click)="onClick($event)">{{params.value}}</button>`
})
export class ButtonRendererComponent implements ICellRendererAngularComp {
  params: any;
  label: string;

  agInit(params): void {
    this.params = params;
    this.label = this.params.label || null;
  }

  refresh(params?: any): boolean {
    return true;
  }

  onClick($event) {
    if (this.params.onClick instanceof Function) {
      // Put anything into Params u want Pass into Parents Component
      const params = {
        event: $event,
        rowData: this.params.node.data
        // Something...
      };
      this.params.onClick(params);
    }
  }
}
