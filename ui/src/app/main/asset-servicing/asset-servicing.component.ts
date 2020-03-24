import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/services/common/data.service';
import { Style } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-asset-servicing',
  templateUrl: './asset-servicing.component.html',
  styleUrls: ['./asset-servicing.component.scss']
})
export class AssetServicingComponent implements OnInit {
  hideGrid = false;
  optionsActive = true;

  style = Style;

  processingMsgDiv = {
    border: '1px solid #eee',
    padding: '4px',
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 125px)',
    boxSizing: 'border-box'
  };

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.flag$.subscribe(obj => {
      this.hideGrid = obj;
    });
  }

  activateOptions() {
    this.optionsActive = true;
  }
}
