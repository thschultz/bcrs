/*
 * Title: register.component.ts
 * Author: Richard Krasso
 * Contributors: Thomas Schultz, Jamal Damir, Carl Logan, Walter McCue
 * Date: 04/27/2023
 * Last Modified by: Carl Logan
 * Last Modification Date: 04/27/2023
 * Description: JavaScript / TypeScript for the bcrs project
 */

import { Component, OnInit } from '@angular/core';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { SecurityQuestion } from 'src/app/shared/models/security-question.interface';
import { FormBuilder, FormGroup, NgModel, Validators } from '@angular/forms';
import { Message } from 'primeng/api';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { SecurityQuestionService } from 'src/app/shared/services/security-question.service';
import { User } from 'src/app/shared/models/user.interface';
import { SessionService } from 'src/app/shared/services/session.service';
import { SelectedSecurityQuestion } from '../../shared/models/selected-security-question.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {showError: true}
  }]
})
export class RegisterComponent implements OnInit {
  securityQuestions: SecurityQuestion[];
  errorMessages: Message[];
  user: User;
  selectedSecurityQuestions: SelectedSecurityQuestion[];
  securityMenu1 = '';
  securityMenu2 = '';
  securityMenu3 = '';

  contactForm: FormGroup = this.fb.group({
    firstName: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(35) ])],
    lastName: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(35) ])],
    phoneNumber: [null, Validators.compose([ Validators.required, Validators.pattern('\\d{3}\\-\\d{3}-\\d{4}') ])],
    email: [null, Validators.compose([ Validators.required, Validators.email])],
    address: [null, Validators.compose([ Validators.required, Validators.minLength(3), Validators.maxLength(75) ])]
  });

  sqForm: FormGroup = this.fb.group({
    securityQuestion1: [null, Validators.compose([Validators.required])],
    securityQuestion2: [null, Validators.compose([Validators.required])],
    securityQuestion3: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion1: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion2: [null, Validators.compose([Validators.required])],
    answerToSecurityQuestion3: [null, Validators.compose([Validators.required])]
  });

  credForm: FormGroup = this.fb.group({
    userName: [null, Validators.compose([Validators.required])],
    password: [null, Validators.compose([Validators.required, Validators.pattern('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$')])],
  });

  constructor(private router: Router, private fb: FormBuilder, private cookieService: CookieService,
              private securityQuestionsService: SecurityQuestionService, private sessionService: SessionService) {
                this.securityQuestions = [];
                this.errorMessages = [];
                this.user = {} as User;
                this.selectedSecurityQuestions = [];

                this.securityQuestionsService.findAllSecurityQuestions().subscribe({
                  next: (res) => {
                    this.securityQuestions = res.data;
                    console.log('register component --> ' + this.securityQuestions);
                  },
                  error: (e) => {
                    console.log(e);
                  }
                });
              }

              // if Drop Down Menu 1 is selected, returns false
              // if not selected, returns true and disables second drop down
              isSelectedMenu1() {
                if (this.securityMenu1) {
                  return false
                } else {
                  return true
                }
              }

              // if Drop Down Menu 2 is selected, returns false
              // if not selected, returns true and disables third drop down
              isSelectedMenu2() {
                if (this.securityMenu2) {
                  return false
                } else {
                  return true
                }
              }

  ngOnInit(): void {
  }

  register() {
    const contactInformation = this.contactForm.value;
    const securityQuestions = this.sqForm.value;
    const credentials = this.credForm.value;

    this.selectedSecurityQuestions = [
      {
        questionText: securityQuestions.securityQuestion1,
        answerText: securityQuestions.answerToSecurityQuestion1
      },
      {
        questionText: securityQuestions.securityQuestion2,
        answerText: securityQuestions.answerToSecurityQuestion2
      },
      {
        questionText: securityQuestions.securityQuestion3,
        answerText: securityQuestions.answerToSecurityQuestion3
      }
    ]
    console.log(this.selectedSecurityQuestions);

    this.user = {
      userName: credentials.userName,
      password: credentials.password,
      firstName: contactInformation.firstName,
      lastName: contactInformation.lastName,
      phoneNumber: contactInformation.phoneNumber,
      address: contactInformation.address,
      email: contactInformation.email,
      selectedSecurityQuestions: this.selectedSecurityQuestions
    }
    console.log(this.user);

    this.sessionService.register(this.user).subscribe({
      next: (res) => {
        this.cookieService.set('sessionuser', credentials.userName, 1);
        this.cookieService.set('session-id', res.data._id, 1);
        this.router.navigate(['/']);
      },
      error: (e) => {
        this.errorMessages = [
          {severity: 'error', summary: 'Error', detail: e.message}
        ]
        console.log(`Node.js server error; message:${e.message}`);
        console.log(e);
      }
    });
  }


}
