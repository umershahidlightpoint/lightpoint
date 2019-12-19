import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GridLayoutApiService {
  private baseUrl: string;

  constructor(private http: HttpClient) {
    this.baseUrl = window['config'].remoteServerUrl;
  }

  /*
  Save Grid Layout State
  */
  saveDataGridState(data) {
    const url = this.baseUrl + '/DataGrid';
    return this.http.post(url, data).pipe(map((response: any) => response));
  }

  /*
  Get Grid Layout Status
  */
  getDataGridStatus(id) {
    const url = this.baseUrl + '/DataGrid/' + id;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get All Grid Layouts
  */
  getAllGridLayouts() {
    const url = encodeURI(this.baseUrl + '/DataGrid/GetGridLayouts');
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get All Layouts of Grid 
  */
  getGridLayouts(gridId, userId) {
    const url = encodeURI(
      this.baseUrl + '/DataGrid/GetDataGridLayouts?gridId=' + gridId + '&userId=' + userId
    );
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Get a Grid Layout
  */
  GetAGridLayout(id) {
    const url = this.baseUrl + '/DataGrid/GetAGridLayout?id=' + id;
    return this.http.get(url).pipe(map((response: any) => response));
  }

  /*
  Delete a Grid Layout
  */
  deleteGridLayout(id) {
    const url = this.baseUrl + '/DataGrid/' + id;
    return this.http.delete(url).pipe(map((response: any) => response));
  }
}
