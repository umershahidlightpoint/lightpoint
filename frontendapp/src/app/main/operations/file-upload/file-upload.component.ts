import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { FinancePocServiceProxy } from 'src/shared/service-proxies/service-proxies';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationModalComponent } from 'src/shared/Component/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit {
  @ViewChild('confirmationModal') confirmationModal: ConfirmationModalComponent;
  @ViewChild('fileInput') fileInput: ElementRef;

  fileToUpload: File = null;
  disableFileUpload = true;
  uploadLoader = false;
  confirmStatus = false;
  fileType = 'Select a File Type';
  fileTypes = ['Monthly Performance', 'Daily PnL'];

  constructor(
    private financeService: FinancePocServiceProxy,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {}

  changeFileType(selectedFileType) {
    this.disableFileUpload =
      this.fileToUpload === null && this.fileType === 'Select a File Type' ? true : false;
    this.fileType = selectedFileType;
  }

  onFileInput(files: FileList) {
    this.disableFileUpload = this.fileType === 'Select a File Type' ? true : false;
    this.fileToUpload = files.item(0);
  }

  uploadRows() {
    if (this.fileType === 'Monthly Performance') {
      this.uploadLoader = true;
      this.financeService.getMonthlyPerformanceStatus().subscribe(response => {
        this.uploadLoader = false;
        if (response.isSuccessful) {
          if (response.payload) {
            this.confirmStatus = true;
            this.confirmationModal.showModal();
          } else {
            this.uploadMonthlyPerformance();
          }
        } else {
          this.toastrService.error('Something went wrong! Try Again.');
        }
      });
    } else if (this.fileType === 'Daily PnL') {
      this.uploadDailyUnofficialPnl();
    }
  }

  confirmReset() {
    if (this.confirmStatus) {
      this.uploadMonthlyPerformance();
    }
  }

  uploadMonthlyPerformance() {
    this.uploadLoader = true;
    this.financeService.uploadMonthlyPerformance(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      this.confirmStatus = false;
      if (response.isSuccessful) {
        this.clearForm();
        this.toastrService.success('File uploaded successfully!');
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  uploadDailyUnofficialPnl() {
    this.uploadLoader = true;
    this.financeService.uploadDailyUnofficialPnl(this.fileToUpload).subscribe(response => {
      this.uploadLoader = false;
      if (response.isSuccessful) {
        this.clearForm();
        this.toastrService.success('File uploaded successfully!');
      } else {
        this.toastrService.error('Something went wrong! Try Again.');
      }
    });
  }

  clearForm() {
    this.disableFileUpload = true;
    this.fileType = 'Select a File Type';
    this.fileToUpload = null;
    this.fileInput.nativeElement.value = '';
  }
}
