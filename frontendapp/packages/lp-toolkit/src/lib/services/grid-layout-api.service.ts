import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GridLayoutAPIService {
  constructor(private httpClient: HttpClient, private toastrService: ToastrService) {}

  /*
    Get All Layouts of a Grid
    */
  getGridLayouts(url: string, userId: number | string, gridId: number | string): Observable<any> {
    const encodedURI = encodeURI(`${url}?userId=${userId}&gridId=${gridId}`);
    return this.httpClient.get(encodedURI).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  /*
    Get a Grid Layout Details
    */
  getGridLayout(url: string, layoutId: number | string): Observable<any> {
    const encodedURI = encodeURI(`${url}?id=${layoutId}`);
    return this.httpClient.get(encodedURI).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  /*
    Save a Grid Layout
    */
  saveGridLayout(url: string, payload: any): Observable<any> {
    return this.httpClient.post(encodeURI(url), payload).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  /*
    Delete a Grid Layout
    */
  deleteGridLayout(url: string, layoutId: number | string): Observable<any> {
    const encodedURI = encodeURI(`${url}/${layoutId}`);
    return this.httpClient.delete(encodedURI).pipe(
      map((response: any) => response),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    this.toastrService.error('Something went wrong. Try again later!');

    return throwError(error);
  }
}
