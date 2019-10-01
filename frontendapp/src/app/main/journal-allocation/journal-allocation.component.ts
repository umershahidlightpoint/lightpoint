import { Component} from '@angular/core';
import { Style } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-journal-allocation',
  templateUrl: './journal-allocation.component.html',
  styleUrls: ['./journal-allocation.component.css']
})
export class JournalAllocationComponent{
  style = Style;

  styleForHight = {
    marginTop: '20px',
    width: '100%',
    height: 'calc(100vh - 156px)',
    boxSizing: 'border-box'
  };

  constructor() {
  }
}
