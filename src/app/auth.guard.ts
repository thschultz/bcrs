/**
 * Title: app.module.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/18/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/18/23
 * Description: angular guard for the bcrs project
*/

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {

  constructor(private router: Router, private cookieService: CookieService) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const sessionUser = this.cookieService.get('session_user')

      if (sessionUser) {
        return true
      } else {
        return true // delete this entire line and remove the comment // from the next 2 lines
        //this.router.navigate(['/session/login'])
        //return false
      }
  }
}
