import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { IEmployee } from './employee';
// import 'rxjs/add/operator/catch';
// import 'rxjs/add/observable/throw';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private _url: string = '/assets/data/employee.json';
  constructor(private _http: HttpClient) {}
  getEmployees(): Observable<IEmployee[]> {
    return this._http
      .get<IEmployee[]>(this._url)
      .pipe(catchError(this.errorHandler));
  }
  errorHandler(error: HttpErrorResponse) {
    return throwError(error.message || 'Server Error');
  }
}
