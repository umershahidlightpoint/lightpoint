import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileManagementApiService {
  private baseUrl: string;

  private selectedAccounList = new BehaviorSubject(null);
  selectedAccounList$ = this.selectedAccounList.asObservable();

  private dispatchModifications = new BehaviorSubject(null);
  dispatchModifications$ = this.dispatchModifications.asObservable();

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
  }

  /*
  Get All Files
  */
  getFiles() {
    const url = this.baseUrl + '/fileManagement/files';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  updateAction(body) {
    const url = this.baseUrl + '/fileManagement/UpdateFileAction';
    return this.http.post(url, body).pipe(map((response: any) => response));
  }

  /*
  Get Silver Files
  */
  getSilverFiles() {
    const url = this.baseUrl + '/fileManagement/s3Files';
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Generate Files
  */
  generateFiles(body) {
    const url = this.baseUrl + '/fileManagement/silverEndOfDay';
    return this.http.post(url, body).pipe(map((response: any) => response));
  }

  getInvalidExportRecords(): Observable<any> {
    const url = this.baseUrl + '/fileManagement/FileExportException';
    return this.http.get(url);
  }
}
