import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
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
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /*
    Get a Grid Layout Details
    */
  getGridLayout(url: string, layoutId: number | string): Observable<any> {
    const encodedURI = encodeURI(`${url}?id=${layoutId}`);
    return this.httpClient.get(encodedURI).pipe(
      map((response: any) => response),
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  /*
    Save a Grid Layout
    */
  saveGridLayout(url: string, payload: any): Observable<any> {
    return this.httpClient
      .post(encodeURI(url), payload, {
        observe: 'response'
      })
      .pipe(
        tap((response: HttpResponse<any>) => {
          if (response.status >= 200 || response.status < 300) {
            this.toastrService.success('Grid layout saved successfully.');
          }
        }),
        map((response: HttpResponse<any>) => response.body),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  /*
    Delete a Grid Layout
    */
  deleteGridLayout(url: string, layoutId: number | string): Observable<any> {
    const encodedURI = encodeURI(`${url}/${layoutId}`);
    return this.httpClient
      .delete(encodedURI, {
        observe: 'response'
      })
      .pipe(
        tap((response: HttpResponse<any>) => {
          if (response.status >= 200 || response.status < 300) {
            this.toastrService.success('Grid layout deleted successfully.');
          }
        }),
        map((response: HttpResponse<any>) => response.body),
        catchError((error: HttpErrorResponse) => this.handleError(error))
      );
  }

  private handleError(error: HttpErrorResponse) {
    this.toastrService.error('Something went wrong. Try again later!');

    return throwError(error);
  }
}
