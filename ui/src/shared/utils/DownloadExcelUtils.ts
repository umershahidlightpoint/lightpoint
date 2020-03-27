import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({ providedIn: 'root' })
export class DownloadExcelUtils {
  // tslint:disable-next-line: no-string-literal
  isCefMode = !!window['cef'];

  constructor(private toastrService: ToastrService) {}

  ToastrMessage() {
    if (!this.isCefMode) {
      this.toastrService.info(
        'Your file is downloaded, Just click on it to view it or open your default download directory to view it there.',
        'Downloaded',
        {
          positionClass: 'toast-bottom-left',
          closeButton: true
        }
      );
    }
  }
}
