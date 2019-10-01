import { Component} from '@angular/core';
import { Style } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-trade-allocation',
  templateUrl: './trade-allocation.component.html',
  styleUrls: ['./trade-allocation.component.css']
})
export class TradeAllocationComponent{

  style = Style;

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 156px)',
    boxSizing: 'border-box'
  };

  constructor() {}
}
