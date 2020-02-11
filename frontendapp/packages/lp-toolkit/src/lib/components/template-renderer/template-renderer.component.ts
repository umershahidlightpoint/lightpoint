import { Component, TemplateRef } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'lp-template-renderer',
  templateUrl: './template-renderer.component.html',
  styleUrls: ['./template-renderer.component.scss']
})
export class TemplateRendererComponent implements ICellRendererAngularComp {
  public template: TemplateRef<any>;
  public templateContext: { $implicit: any; params: any };

  agInit(params: ICellRendererParams): void {
    // tslint:disable-next-line: no-string-literal
    this.template = params['ngTemplate'];
    this.refresh(params);
  }

  refresh(params: any): boolean {
    this.templateContext = {
      $implicit: params.data,
      params
    };

    return true;
  }
}
