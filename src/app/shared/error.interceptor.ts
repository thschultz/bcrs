/**
 * Title: error.interceptor.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/26/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/26/23
 * Description: error interceptor to redirect users in the event of a major error in the application for the bcrs project
 */

import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(catchError(err => {

      // 404 error redirects user to 404 page
      if ([404].indexOf(err.status) !== -1) {
        this.router.navigate(['/session/404']);
      }

      // 500 error redirects user to 500 page
      if ([500, 504].indexOf(err.status) !== -1) {
        this.router.navigate(['/session/500']);
      }

      const error = {
        message: err.error.message || err.message,
        httpCode: err.error.httpCode || err.status,
        url: err.url
      }

      console.log(`HttpInterceptor error; origin:${error.url};message:${error.message};httpCode:${error.httpCode}`);
      return throwError(() => error);
    }));
  }
}
