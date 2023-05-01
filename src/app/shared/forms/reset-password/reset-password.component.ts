/**
 * Title: reset-password.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/26/23
 * Last Modified by: Walter McCue
 * Last Modification Date: 04/26/23
 * Description: user reset password for the bcrs project
*/

// Import statements
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { Message } from 'primeng/api';
import { SessionService } from '../../../shared/services/session.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})

export class ResetPasswordComponent implements OnInit {

  isAuthenticated: string;
  userName: string;

  // Password reset FormGroup
  form: FormGroup = this.fb.group({
    password: [
      null,
      Validators.compose([
        Validators.required,
        Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'),
      ]),
    ],
  });

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private cookieService: CookieService,
    private sessionService: SessionService,
  ) {
    // getting isAuthenticated parameter from the current route snapshot and setting it to the isAuthenticated.
    this.isAuthenticated =
      this.route.snapshot.queryParamMap.get('isAuthenticated') ?? '';
    this.userName = this.route.snapshot.queryParamMap.get('username') ?? '';
  }

  ngOnInit(): void {
  }

  // Updates user password
  updatePassword() {
    const password = this.form.controls['password'].value;
    // Updates the user password by calling the updatePassword method of the sessionService
    this.sessionService.updatePassword(password, this.userName).subscribe({
      next: (res) => {
        this.sessionService.verifyUsername(this.userName).subscribe({
          next: (res) => {
            this.cookieService.set('session-id', res.data._id, 1);
          },
          error: (e) => {
            console.log(e);
          }
        })
        this.cookieService.set('sessionuser', this.userName, 1);
        this.router.navigate(['/']);
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

}
