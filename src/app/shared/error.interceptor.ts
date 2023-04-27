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
      if ([404].indexOf(err.status) !== -1) {
        this.router.navigate(['/session/404']);
      }

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
