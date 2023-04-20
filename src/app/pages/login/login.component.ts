/**
 * Title: login.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Jamal Damir
 * Last Modification Date: 04/18/23
 * Description: login component for the bcrs project
 */

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Message } from 'primeng/api';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    userName: [
      null,
      Validators.compose([
        Validators.required,
        Validators.pattern(/[a-zA-Z0-9]{3,}/),
      ]),
    ],
    password: [
      null,
      Validators.compose([
        Validators.required,
        Validators.pattern(
          /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
        ),
      ]),
    ],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cookieService: CookieService
  ) {}

  ngOnInit(): void {}

  login() {}
  createAccount() {}
  passwordReset() {}
}
