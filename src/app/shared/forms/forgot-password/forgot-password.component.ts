/**
 * Title: forgot-password.component.ts
 * Authors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/26/23
 * Last Modified by: Thomas Schultz
 * Last Modification Date: 04/26/23
 * Description: user reset password for the bcrs project
*/


import { Component, OnInit } from '@angular/core';
import { Message } from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SessionService } from '../../services/session.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit {

  errorMessages: Message[];

  form: FormGroup = this.fb.group({
    username: [null, Validators.compose([Validators.required])]
  });

  constructor(private fb: FormBuilder, private router: Router, private sessionService: SessionService) {
    this.errorMessages = [];
  }

  ngOnInit(): void {
  }
  // verifyUser function
  verifyUser() {
    const username = this.form.controls['username'].value;
    //successful username. if successful, will take them to verify questions page. if not, error message will appear
    this.sessionService.verifyUsername(username).subscribe({
      next: (res) => {
        console.log(res);
        this.router.navigate(['/session/verify-security-questions'], { queryParams: { username: username }, skipLocationChange: true });
      },
      error: (e) => {
        this.errorMessages = [
          { severity: 'error', summary: 'Error', detail: e.message }
        ]
        console.log(e);
      }
    })
  }
}
