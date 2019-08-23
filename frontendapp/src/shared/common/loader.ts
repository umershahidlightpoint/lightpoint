import { Component, Input } from "@angular/core";
import "ag-grid-enterprise";

@Component({
  selector: "app-loader",
  template: `
    <div
      *ngIf="isLoading"
      style="height: 100%; width: 100% ;background-color: rgba(0, 0, 0, 0.3);"
    >
      <p>Loading</p>
      {{ Progress }}
    </div>
  `
})
export class LoaderComponent {
  @Input("isLoading") isLoading: boolean;
  @Input("Progress") Progress: boolean;
  constructor() {
  }
}
