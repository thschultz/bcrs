/**
 * Title: login.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/16/23
 * Last Modified by: Jamal Damir
 * Last Modification Date: 04/18/23
 * Description: login component for the bcrs project
 */

// Import Statements
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Message } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { SessionService } from '../../shared/services/session.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup = this.fb.group({
    userName: [null, Validators.compose([Validators.required])],
    password: [
      null,
      Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'),
      ]),
    ],
  });

  errorMessages: Message[] = [];

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private sessionService: SessionService,
    private http: HttpClient
  ) { }

  ngOnInit(): void { }
  //login function
  login() {
    const userName = this.loginForm.controls['userName'].value;
    const password = this.loginForm.controls['password'].value;
    //if successful, navigate to home page
    this.sessionService.login(userName, password).subscribe({
      next: (res) => {
        console.log(res);
        this.cookieService.set('sessionuser', res.data.userName, 1);
        this.router.navigate(['/']);
      },
      //error handling if unsuccessful
      error: (e) => {
        this.errorMessages = [
          { severity: 'error', summary: 'error', detail: e.message },
        ];
        console.log(e);
      },
    });
  }

  createAccount() { }
  passwordReset() { }
}
