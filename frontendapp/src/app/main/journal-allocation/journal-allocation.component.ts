import { Component} from '@angular/core';
import { Style, HeightStyle } from 'src/shared/utils/Shared';

@Component({
  selector: 'app-journal-allocation',
  templateUrl: './journal-allocation.component.html',
  styleUrls: ['./journal-allocation.component.css']
})
export class JournalAllocationComponent {
  style = Style;

  styleForHight = HeightStyle(156);

  constructor() {
  }
}
