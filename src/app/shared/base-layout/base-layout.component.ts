/**
 * Title: base-layout.component.ts
 * Author: Richard Krasso
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/21/23
 * Description: base layout for UI for the bcrs project
 */

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { UserService } from '../../shared/services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../shared/models/user.interface';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css'],
})
export class BaseLayoutComponent implements OnInit {
  year: number = Date.now();

  userName: string;
  user: User;
  userId: string;


  constructor(private cookieService: CookieService, private router: Router, private userService: UserService,) {
    this.userName = this.cookieService.get('sessionuser') ?? '';

    this.userId = this.cookieService.get('session-id');
    this.user = {} as User;
  }

  ngOnInit(): void { }
  //logout function. deletes cookie session
  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }
}
