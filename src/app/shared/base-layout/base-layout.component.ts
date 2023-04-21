/**
 * Title: base-layout.component.ts
 * Author: Richard Krasso
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/16/23
 * Description: base layout for UI for the bcrs project
 */

import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-base-layout',
  templateUrl: './base-layout.component.html',
  styleUrls: ['./base-layout.component.css'],
})
export class BaseLayoutComponent implements OnInit {
  year: number = Date.now();

  userName: string;

  constructor(private cookieService: CookieService, private router: Router) {
    this.userName = this.cookieService.get('sessionuser') ?? '';
  }

  ngOnInit(): void {}

  logout() {
    this.cookieService.deleteAll();
    this.router.navigate(['/session/login']);
  }
}
