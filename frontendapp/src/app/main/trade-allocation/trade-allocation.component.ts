import { Component} from '@angular/core';
import { Style, HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-trade-allocation',
  templateUrl: './trade-allocation.component.html',
  styleUrls: ['./trade-allocation.component.css']
})
export class TradeAllocationComponent {

  style = Style;

  styleForHight = HeightStyle(156);

  constructor() {}
}
