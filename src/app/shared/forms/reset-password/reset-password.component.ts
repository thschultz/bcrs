

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

    this.isAuthenticated = this.route.snapshot.queryParamMap.get('isAuthenticated') ?? '';
    this.userName = this.route.snapshot.queryParamMap.get('username') ?? '';
  }

  ngOnInit(): void {
  }

  update() {
    const password = this.form.controls['password'].value;

    this.sessionService.updatePassword(password, this.userName).subscribe({
      next: => {
        this.cookieService.set('sessionuser', this.userName, 1);
        //this.cookieService.set('session-id', this.user._id, 1);
        this.router.navigate(['/']);
      },
      error: (e) => {
        console.log(e);
      }
    })
  }

}
